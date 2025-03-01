import { Router } from "express";
import { createUser } from "../controllers/user.js";

const router = Router();

router.post("/signup", createUser);

export default router;
