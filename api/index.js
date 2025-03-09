import express from "express";
import "dotenv/config";
import { dbConnect } from "./configs/dbConnect.js";
import routes from "./routes/routes.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";

const app = express();

const { PORT, DB_URL } = process.env;

//database connection
dbConnect(DB_URL);

//global middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//routes
app.use("/api", routes);

//custom middlewares
app.use(notFound);
app.use(errorHandler);

app.listen(PORT || 3000);
