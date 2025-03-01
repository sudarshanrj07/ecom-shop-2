export const notFound = (req, res, next) => {
	const error = new Error(`Not Found: ${req.orignalUrl}`);
	req.status(404);
	next(error);
};

export const errorHandler = (err, req, res, next) => {
	const statuscode = res.statusCode == 200 ? 500 : res.statusCode;
	req.status(statuscode);
	res.json({
		message: err?.message,
		stack: err?.stack,
	});
};
