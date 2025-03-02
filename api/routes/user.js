import { Router } from "express";
import {
	createUserHandler,
	deleteUser,
	getAllUser,
	getUser,
	loginUserHandler,
	updateUser,
} from "../controllers/user.js";
import { adminAuth, userAuth } from "../middlewares/authentication.js";

const router = Router();

router.post("/signup", createUserHandler);
router.post("/signin", loginUserHandler);
router.get("/get-all-users", userAuth, adminAuth, getAllUser);
router.get("/get-user/", userAuth, getUser);
router.put("/update-user/", userAuth, updateUser);
router.delete("/delete-user/:id", deleteUser);

export default router;
