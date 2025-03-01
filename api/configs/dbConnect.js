import mongoose from "mongoose";

export const dbConnect = async (url) => {
	return mongoose.connect(url);
};
