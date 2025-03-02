import { genrateToken } from "../configs/jwtGenrator.js";
import { User } from "../modles/User.js";
import asyncHandler from "express-async-handler";

//User creation/signup route
export const createUserHandler = asyncHandler(async (req, res) => {
	const findUser = await User.findOne({ email: req.body.email });

	if (findUser) throw new Error("User already exists");

	//Create new user
	const newUser = await User.create(req.body);

	if (!newUser) throw new Error("User Creation failed");
	return res.status(201).json(newUser);
});

//User login/singin route
export const loginUserHandler = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	//Check if user exists or not
	const findUser = await User.findOne({ email });

	if (findUser && (await findUser.matchPassword(password)))
		return res.status(200).json({
			id: findUser._id,
			fistName: findUser?.firstName,
			lastName: findUser?.lastName,
			email: findUser?.email,
			token: genrateToken(findUser?._id),
		});

	throw new Error("Invalid Credentials");
});

export const updateUser = asyncHandler(async (req, res) => {
	const { id } = req.user;
	try {
		const updatedUser = await User.findByIdAndUpdate(
			id,
			{
				...req.body,
			},
			{ new: true }
		);
		return res.status(200).json(updatedUser);
	} catch (error) {
		throw new Error(error);
	}
});

//fetch all existing users
export const getAllUser = asyncHandler(async (req, res) => {
	try {
		const getUsers = await User.find();
		return res.status(200).json(getUsers);
	} catch (error) {
		throw new Error(error);
	}
});

//fetch user by id
export const getUser = asyncHandler(async (req, res) => {
	const { id } = req.user;
	try {
		const findUser = await User.findById(id);
		if (!findUser) throw new Error("User does not exists");
		return res.status(200).json(findUser);
	} catch (error) {
		throw new Error(error);
	}
});

//removed user by id
export const deleteUser = asyncHandler(async (req, res) => {
	const { id } = req.params;
	try {
		const findUser = await User.findByIdAndDelete(id);
		if (!findUser) throw new Error("User does not exists");
		return res.status(200).json(findUser);
	} catch (error) {
		throw new Error(error);
	}
}); //1:46
