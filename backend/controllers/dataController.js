const DataPoint = require("../models/DataPoint");

// Builds a Mongo filter object from query params.
// All filters are optional and combine with AND logic.
const buildFilterQuery = (query) => {
  const filter = {};

  if (query.end_year) filter.end_year = query.end_year;
  if (query.topic) filter.topic = query.topic;
  if (query.sector) filter.sector = query.sector;
  if (query.region) filter.region = query.region;
  if (query.pestle) filter.pestle = query.pestle;
  if (query.source) filter.source = query.source;
  if (query.country) filter.country = query.country;

  const numRange = (field, minKey, maxKey) => {
    const min = query[minKey];
    const max = query[maxKey];
    if (min || max) {
      filter[field] = {};
      if (min) filter[field].$gte = Number(min);
      if (max) filter[field].$lte = Number(max);
    }
  };
  numRange("intensity", "intensityMin", "intensityMax");
  numRange("likelihood", "likelihoodMin", "likelihoodMax");
  numRange("relevance", "relevanceMin", "relevanceMax");

  return filter;
};

// GET /api/filters
// Returns distinct, sorted, non-empty values for every filter dropdown.
exports.getFilterOptions = async (req, res) => {
  try {
    const fields = ["end_year", "topic", "sector", "region", "pestle", "source", "country"];
    const results = {};

    await Promise.all(
      fields.map(async (field) => {
        const values = await DataPoint.distinct(field);
        results[field] = values.filter((v) => v !== null && v !== "").sort();
      })
    );

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/data
// Returns paginated, filtered raw records (used by the data table).
exports.getData = async (req, res) => {
  try {
    const filter = buildFilterQuery(req.query);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      DataPoint.find(filter).sort({ added: -1 }).skip(skip).limit(limit),
      DataPoint.countDocuments(filter),
    ]);

    res.json({
      data: records,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/stats
// Returns every aggregation the dashboard's charts need, in one call,
// all respecting the same active filters.
exports.getStats = async (req, res) => {
  try {
    const filter = buildFilterQuery(req.query);

    const [
      kpis,
      intensityByTopic,
      likelihoodVsRelevance,
      countryIntensity,
      regionDistribution,
      yearTrend,
      sectorDistribution,
      pestleDistribution,
      sourceDistribution,
    ] = await Promise.all([
      // KPI cards: totals + averages
      DataPoint.aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            totalRecords: { $sum: 1 },
            avgIntensity: { $avg: "$intensity" },
            avgLikelihood: { $avg: "$likelihood" },
            avgRelevance: { $avg: "$relevance" },
          },
        },
      ]),

      // Avg intensity per topic (top 15)
      DataPoint.aggregate([
        { $match: { ...filter, topic: { $ne: "" } } },
        { $group: { _id: "$topic", avgIntensity: { $avg: "$intensity" }, count: { $sum: 1 } } },
        { $sort: { avgIntensity: -1 } },
        { $limit: 15 },
      ]),

      // Likelihood vs relevance scatter (capped sample for performance)
      DataPoint.aggregate([
        { $match: filter },
        { $project: { _id: 0, likelihood: 1, relevance: 1, intensity: 1, topic: 1, country: 1 } },
        { $limit: 500 },
      ]),

      // Avg intensity per country (top 15, non-empty)
      DataPoint.aggregate([
        { $match: { ...filter, country: { $ne: "" } } },
        { $group: { _id: "$country", avgIntensity: { $avg: "$intensity" }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 15 },
      ]),

      // Record count per region (non-empty)
      DataPoint.aggregate([
        { $match: { ...filter, region: { $ne: "" } } },
        { $group: { _id: "$region", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      // Record count per start_year (trend line, non-empty, numeric-sorted)
      DataPoint.aggregate([
        { $match: { ...filter, start_year: { $ne: "" } } },
        { $group: { _id: "$start_year", count: { $sum: 1 } } },
        { $addFields: { yearNum: { $toInt: "$_id" } } },
        { $sort: { yearNum: 1 } },
      ]),

      // Record count per sector
      DataPoint.aggregate([
        { $match: { ...filter, sector: { $ne: "" } } },
        { $group: { _id: "$sector", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      // Record count per PEST(LE) category
      DataPoint.aggregate([
        { $match: { ...filter, pestle: { $ne: "" } } },
        { $group: { _id: "$pestle", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      // Top sources
      DataPoint.aggregate([
        { $match: { ...filter, source: { $ne: "" } } },
        { $group: { _id: "$source", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
    ]);

    res.json({
      kpis: kpis[0] || { totalRecords: 0, avgIntensity: 0, avgLikelihood: 0, avgRelevance: 0 },
      intensityByTopic,
      likelihoodVsRelevance,
      countryIntensity,
      regionDistribution,
      yearTrend,
      sectorDistribution,
      pestleDistribution,
      sourceDistribution,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
