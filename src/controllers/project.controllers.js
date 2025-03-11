import Query from '../models/query.model.js';

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
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized: User not found in request" });
    }
    try {
        const newQuery = new Query({
            type: req.body.type,
            user: req.user.id, // Automatically store the authenticated user's ID
            phone: req.body.phone,
            location: req.body.location,
            productName: req.body.productName,
            description: req.body.description,
            imageUrl:req.body.imageUrl
        });
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

export { getQueries, createQuery, updateQuery, deleteQuery };
