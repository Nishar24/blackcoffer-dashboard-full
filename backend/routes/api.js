const express = require("express");
const router = express.Router();
const { getFilterOptions, getData, getStats } = require("../controllers/dataController");

router.get("/filters", getFilterOptions);
router.get("/data", getData);
router.get("/stats", getStats);

module.exports = router;
