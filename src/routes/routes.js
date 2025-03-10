const express = require("express");
const {
  getQueries,
  createQuery,
  updateQuery,
  deleteQuery,
} = require("../controllers/project.controllers.js");

const router = express.Router();

router.get("/" , (req,res) =>{
    res.json({mssg : "API is working"});
});

router.get("/queries", getQueries); //Fetch Query

router.post("/queries", createQuery); // Create Query
router.put("/queries/:id", updateQuery); // Update Query

router.delete("/queries/:id", deleteQuery); // Delete Query

module.exports = router;
