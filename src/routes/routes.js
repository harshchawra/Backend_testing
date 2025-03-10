const express = require("express");
const router = express.Router();
const {getDb} = require("../index.js");

router.get("/", (req, res) => {
    res.json({msg : "API is working."});
});

router.get('/books' ,async (req,res) => {
    const db = await getDb();
    db.collection('books')
        .find()
        .sort()
        .toArray()
        .then((book) =>  {
            res.json(book);
        })
        .catch(() => {
            res.json({error : "DB error while fetching."});
        })
});

module.exports = router;
