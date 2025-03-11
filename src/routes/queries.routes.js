import express from "express";
import authenticateUser from "../middleware/auth.middleware.js";
import { getQueries, createQuery, updateQuery, deleteQuery } from "../controllers/project.controllers.js";

const router = express.Router();

router.get("/test" , (req,res) => {
  res.json({mssg : "API is working."});
});

router.get("/queries", authenticateUser, getQueries);
router.post("/queries", authenticateUser, createQuery);
router.patch("/queries/:id", authenticateUser, updateQuery);
router.delete("/queries/:id", authenticateUser, deleteQuery);


export default router;
