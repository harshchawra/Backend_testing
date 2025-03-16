import express from "express";
import authenticateUser from "../middleware/auth.middleware.js";
import { getQueryById, getQueries, createQuery, updateQuery, deleteQuery } from "../controllers/project.controllers.js";

const router = express.Router();

router.get("/test" , (req,res) => {
  res.json({mssg : "API is working."});
});

router.get('/queries/:id',authenticateUser, getQueryById);
// router.get('/queries/:id', getQueryById);
router.get("/queries", authenticateUser, getQueries);
// router.get("/queries", getQueries);
router.post("/queries", authenticateUser, createQuery);
// router.post("/queries", createQuery);
router.patch("/queries/:id", authenticateUser, updateQuery);
// router.patch("/queries/:id", updateQuery);
router.delete("/queries/:id", authenticateUser, deleteQuery);
// router.delete("/queries/:id", deleteQuery);


export default router;
