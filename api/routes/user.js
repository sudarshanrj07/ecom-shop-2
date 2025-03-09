import { Router } from "express";
import {
	blockUnblockUser,
	createUserHandler,
	deleteUser,
	getAllUser,
	getUser,
	handleRefreshToken,
	loginUserHandler,
	updateUser,
	userLogout,
} from "../controllers/user.js";
import { adminAuth, userAuth } from "../middlewares/authentication.js";

const router = Router();

router.post("/signup", createUserHandler);
router.post("/signin", loginUserHandler);
router.get("/get-all-users", userAuth, adminAuth, getAllUser);
router.get("/get-user/", userAuth, getUser);
router.put("/update-user/", userAuth, updateUser);
router.delete("/delete-user/:id", deleteUser);
router.put("/user-block-unblock/:id", userAuth, adminAuth, blockUnblockUser);
router.get("/refresh", handleRefreshToken);
router.get("/logout", userLogout);

export default router;
