import { compare, genSalt, hash } from "bcrypt";
import { Schema, model } from "mongoose";

const userSchema = new Schema({
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	mobile: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		enum: ["user", "admin"],
		default: "user",
	},
});

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) next();
	const salt = await genSalt(10);
	this.password = await hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
	return await compare(enteredPassword, this.password);
};

export const User = model("User", userSchema);
