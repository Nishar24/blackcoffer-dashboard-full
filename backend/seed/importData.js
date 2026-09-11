// Run with: npm run seed
// Reads jsondata.json and loads it into the "datapoints" collection.
// Safe to re-run: it wipes the collection first so you never get duplicates.

require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const DataPoint = require("../models/DataPoint");

const importData = async () => {
  try {
    await connectDB();

    const filePath = path.join(__dirname, "jsondata.json");
    const rawData = fs.readFileSync(filePath, "utf-8");
    const jsonData = JSON.parse(rawData);

    console.log(`Read ${jsonData.length} records from jsondata.json`);

    await DataPoint.deleteMany({});
    console.log("Cleared existing data from 'datapoints' collection");

    await DataPoint.insertMany(jsonData);
    console.log(`Inserted ${jsonData.length} records into MongoDB`);

    console.log("Seeding complete.");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding data:", err);
    process.exit(1);
  }
};

importData();
