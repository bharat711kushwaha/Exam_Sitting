const express = require("express");
const { generateSeating, exportSeating } = require("../controllers/seatingController");
const router = express.Router();

router.post("/generate", generateSeating);
router.get("/export", exportSeating);

module.exports = router;
