import Query from '../models/query.model.js';
import redisClient from '../config/redisClient.js';
import { findSimilarQueries } from '../utils/findSimilarQueries.js';


export const getQueryById = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized: User not found in request" });
    }
    try {
        const query = await Query.findById(req.params.id);

        if (!query) {
            return res.status(404).json({ error: "Query not found with id " + req.params.id });
        }

        res.status(200).json(query);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch query", details: error });
    }
};

export const getQueries = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized: User not found in request" });
    }
    try {
        const { status, category, location, brandName, productName, sort } = req.query;
        const sortField = sort || '-createdAt';

        const filter = {};
        if (status) filter.status = status;
        if (category) {
            const formattedCategory = category.toLowerCase().replace(/\s+/g, '');
            filter.category = { $regex: new RegExp(formattedCategory, 'i') };
        }

        if (location) {
            const formattedLocation = location.toLowerCase().replace(/\s+/g, '');
            filter.location = { $regex: new RegExp(formattedLocation, 'i') };
        }
        if (brandName) {
            const formattedBrandName = brandName.toLowerCase().replace(/\s+/g, '');
            filter.brandName = { $regex: new RegExp(formattedBrandName, 'i') };
        }
        if (productName) {
            const formattedProductName = productName.toLowerCase().replace(/\s+/g, '');
            filter.productName = { $regex: new RegExp(formattedProductName, 'i') };
        }

        //   console.log(filter);

        const redisKey = `queries:status:${status || null}:category:${category || null}:location:${location || null}:brand:${brandName || null}:product:${productName || null}`;

        //   console.log("Checking cache for:", redisKey);

        const cachedData = await redisClient.get(redisKey);
        if (cachedData) {
            // console.log("Cache hit, returning cached data");
            return res.json(JSON.parse(cachedData));
        }

        // console.log("Cache miss, fetching from DB...");

        const queries = await Query.find(filter).sort(sortField);
        //   console.log(queries);

        if (queries.length > 0) {
            // console.log("Caching result in Redis...");
            await redisClient.setEx(redisKey, 300, JSON.stringify(queries));
        } else {
            // console.log("No queries found, not caching empty results.");
        }

        res.json(queries);

    }
    catch (error) {

        console.error("Error fetching queries:", error);
        res.status(500).json({ error: 'Failed to fetch queries', details: error.message });

    }
};

export const createQuery = async (req, res) => {

    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized: User not found in request" });
    }
    try {
        // location , product name , brandname , cate
        console.log("0");
        const newQuery = new Query({
            user: req.user.id,
            status: req.body.status,
            category: req.body.category ? req.body.category.toLowerCase().replace(/\s+/g, '') : '',
            brandName: req.body.brandName ? req.body.brandName.toLowerCase().replace(/\s+/g, '') : '',
            productName: req.body.productName ? req.body.productName.toLowerCase().replace(/\s+/g, '') : '',
            description: req.body.description,
            primaryColor: req.body.primaryColor,
            uniqueIdentifier: req.body.uniqueIdentifier,
            date: req.body.date ? req.body.date.split('-').reverse().join('-') : new Date(),
            time: req.body.time,
            location: req.body.location ? req.body.location.toLowerCase().replace(/\s+/g, '') : '',
            imageUrl: req.body.imageUrl,
            type: req.body.type || 'open',
        });

        console.log("1");
        const savedQuery = await newQuery.save();
        console.log("2");

        const notifiedQueries = await findSimilarQueries(savedQuery);
        console.log("3");

        if (notifiedQueries.length > 0) {
            // console.log(" Notified Queries " + notifiedQueries);
        }
        else {
            // console.log("No new notifications.");
        }

        res.status(201).json({ message: "Query created successfully", query: savedQuery });
    } catch (err) {
        res.status(500).json({ error: "Failed to create query", details: err });
    }
};

export const updateQuery = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized: User not found in request" });
    }
    try {
        const { id } = req.params;

        if (req.body.location) {
            req.body.location = req.body.location.toLowerCase().replace(/\s+/g, '');
        }
        if (req.body.brandName) {
            req.body.brandName = req.body.brandName.toLowerCase().replace(/\s+/g, '');
        }
        if (req.body.productName) {
            req.body.productName = req.body.productName.toLowerCase().replace(/\s+/g, '');
        }

        const updatedQuery = await Query.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedQuery) {
            return res.status(404).json({ error: "Query not found" });
        }

        const notifiedQuery = await findSimilarQueries(updateQuery);

        if (notifiedQuery.length > 0) {
            // console.log(" Notified Queries " + notifiedQueries);
        }
        else {
            // console.log("No new notifications.");
        }

        res.json({ message: "Query updated successfully", query: updatedQuery });
    } catch (err) {
        res.status(500).json({ error: "Failed to update query", details: err });
    }
};

export const deleteQuery = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized: User not found in request" });
    }
    try {
        const { id } = req.params;

        await Notification.deleteMany({ similarQuery: id });

        const deletedQuery = await Query.findByIdAndDelete(id);

        if (!deletedQuery) {
            return res.status(404).json({ error: "Query not found" });
        }

        res.status(200).json({ message: "Query deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete query", details: err });
    }
};
