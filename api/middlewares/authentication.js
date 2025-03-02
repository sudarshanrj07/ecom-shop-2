import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { User } from "../modles/User.js";

export const userAuth = asyncHandler(async (req, res, next) => {
	const { JWT_SECRET } = process.env;
	let token;
	if (!req?.headers?.authorization?.startsWith("Bearer"))
		throw new Error("Not Authorized, Pleae login again");
	token = req.headers.authorization.split(" ")[1];

	try {
		const decode = jwt.verify(token, JWT_SECRET);
		const findUser = await User.findById(decode?.id).select("-password");
		if (!findUser) throw new Error("User doesn't exist");
		req.user = findUser;
		next();
	} catch (error) {
		throw new Error("Not Authorized, Pleae login again");
	}
});

export const adminAuth = asyncHandler(async (req, res, next) => {
	const { email } = req.user;
	const adminUser = await User.find({ email });

	if (!adminUser && adminUser.role !== "admin")
		throw new Error("Admin Privilages are required");
	next();
});
