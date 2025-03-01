import { User } from "../modles/User.js";
import asyncHandler from "express-async-handler";
export const createUser = asyncHandler(async (req, res) => {
	const findUser = await User.findOne({ email: req.body.email });

	if (findUser)
		// return res.status(400).json({ msg: "User already exists", success: false });
		throw new Error("User already exists");

	const newUser = await User.create(req.body);

	if (!newUser)
		// return res
		// 	.status(400)
		// 	.json({ msg: "User creation failed", success: false });
		throw new Error("User Creation failed");
	return res.status(201).json(newUser);
});
