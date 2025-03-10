const Query = require("../models/user.model.js");

// Fetch all queries
const getQueries = async (req, res) => {
    try {
        const queries = await Query.find();
        console.log(queries);
        res.json(queries);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch queries", details: err });
    }
};

// Create a new query
const createQuery = async (req, res) => {
    try {
        const newQuery = new Query(req.body);
        const savedQuery = await newQuery.save();
        res.status(201).json({ message: "Query created successfully", query: savedQuery });
    } catch (err) {
        res.status(500).json({ error: "Failed to create query", details: err });
    }
};

// Update a query
const updateQuery = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedQuery = await Query.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedQuery) return res.status(404).json({ error: "Query not found" });
        res.json({ message: "Query updated successfully", query: updatedQuery });
    } catch (err) {
        res.status(500).json({ error: "Failed to update query", details: err });
    }
};

// Delete a query
const deleteQuery = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedQuery = await Query.findByIdAndDelete(id);

        if (!deletedQuery) return res.status(404).json({ error: "Query not found" });
        res.json({ message: "Query deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete query", details: err });
    }
};

module.exports = { getQueries, createQuery, updateQuery, deleteQuery };
