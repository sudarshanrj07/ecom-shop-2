import { genrateToken } from "../configs/jwtGenrator.js";
import { User } from "../modles/User.js";
import asyncHandler from "express-async-handler";
import { validateMongoDbId } from "../utils/validateMongoDbId.js";
import { genrateRefreshToken } from "../configs/refreshToken.js";
import jwt from "jsonwebtoken";

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

	if (findUser && (await findUser.matchPassword(password))) {
		const refreshToken = genrateRefreshToken(findUser?._id);
		const updatedUser = await User.findByIdAndUpdate(
			findUser._id,
			{ refreshToken },
			{ new: true }
		);
		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			maxAge: 3 * 24 * 60 * 60 * 1000, //3days
		});
		return res.status(200).json({
			id: findUser._id,
			fistName: findUser?.firstName,
			lastName: findUser?.lastName,
			email: findUser?.email,
			token: genrateToken(findUser?._id),
		});
	}
	throw new Error("Invalid Credentials");
});

//User update
export const updateUser = asyncHandler(async (req, res) => {
	const { id } = req.user;
	validateMongoDbId(id);
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
	validateMongoDbId(id);
	try {
		const findUser = await User.findById(id);
		if (!findUser) throw new Error("User does not exists");
		return res.status(200).json(findUser);
	} catch (error) {
		throw new Error(error);
	}
});

//remove user by id
export const deleteUser = asyncHandler(async (req, res) => {
	const { id } = req.params;
	validateMongoDbId(id);
	try {
		const findUser = await User.findByIdAndDelete(id);
		if (!findUser) throw new Error("User does not exists");
		return res.status(200).json(findUser);
	} catch (error) {
		throw new Error(error);
	}
});

//User block unblock only by admin
export const blockUnblockUser = asyncHandler(async (req, res) => {
	const {
		params: { id },
		body: { isBlocked },
	} = req;
	validateMongoDbId(id);

	try {
		const findUser = await User.findByIdAndUpdate(
			id,
			{ isBlocked },
			{ new: true }
		);
		if (!findUser) throw new Error("User not found!");
		return res.json({ message: `User Block status is: ${isBlocked}` });
	} catch (error) {
		throw new Error(error);
	}
});

//refresh token handler
export const handleRefreshToken = asyncHandler(async (req, res) => {
	const refreshToken = req.cookies.refreshToken;
	if (!refreshToken) throw new Error("Refresh token error, Please login again");

	const findUser = await User.findOne({ refreshToken });

	if (!findUser)
		throw new Error(
			"No user found or Refresh Token is invalid, Please login again"
		);

	jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
		if (err || findUser.id !== decoded.id)
			throw new Error(
				"There is something wrong with RefreshToken please login again"
			);
		const accessToken = genrateToken(findUser?._id);
		return res.status(200).json(accessToken);
	});
});

//User logout

export const userLogout = asyncHandler(async (req, res) => {
	const refreshToken = req.cookies.refreshToken;

	if (!refreshToken) throw new Error("No RefreshToken found");

	const findUser = await User.findOne({ refreshToken });

	if (!findUser) {
		res.clearCookie("refreshToken", { httpOnly: true, secure: true });
		return res.sendStatus(204); //forbidden
	}
	await User.findOneAndUpdate(
		{ refreshToken: refreshToken },
		{ refreshToken: "" }
	);

	res.clearCookie("refreshToken", {
		httpOnly: true,
		secure: true,
	});
	return res.sendStatus(204); //forbidden
});
