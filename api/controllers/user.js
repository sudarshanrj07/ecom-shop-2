import { User } from "../modles/User.js";

export const createUser = async (req, res) => {
	const findUser = await User.findOne({ email: req.body.email });

	if (findUser)
		return res.status(400).json({ msg: "User already exists", success: false });

	const newUser = await User.create(req.body);

	if (!newUser)
		return res
			.status(400)
			.json({ msg: "User creation failed", success: false });

	return res.status(201).json(newUser);
};
