import express from "express"
import { getRoles } from "../controllers/roleController.js";

const roleRouter = express.Router();

roleRouter.get("/",getRoles);

export default roleRouter;