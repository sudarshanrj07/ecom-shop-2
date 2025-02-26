import express from "express";
import "dotenv/config";

const app = express();

const { PORT } = process.env;

app.get("/", (req, res) => {
	res.send("Hi There!");
});

app.listen(PORT || 3000);
