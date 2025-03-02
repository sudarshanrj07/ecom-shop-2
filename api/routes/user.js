import { Router } from "express";
import {
	createUserHandler,
	deleteUser,
	getAllUser,
	getUser,
	loginUserHandler,
	updateUser,
} from "../controllers/user.js";

const router = Router();

router.post("/signup", createUserHandler);
router.post("/signin", loginUserHandler);
router.get("/get-all-users", getAllUser);
router.get("/get-user/:id", getUser);
router.delete("/delete-user/:id", deleteUser);
router.put("/update-user/:id", updateUser);

export default router;
