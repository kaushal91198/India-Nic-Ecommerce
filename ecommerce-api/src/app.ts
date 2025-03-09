import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import "express-async-errors"; // Patch express to handle async errors
import routes from "./routes";
import { Routes } from "./interfaces/route.interface";
import errorMiddleware from "./middlewares/error.middleware";
import path from "path";

dotenv.config();

const app = express();

// Middlewares
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors());
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));
app.use(express.text({ limit: '200mb' }));

// Routes

app.use('/images', express.static(path.join(process.cwd(), 'public/images')));


routes.forEach((router: Routes) => {
    app.use(`/${router.path}`, router.route);
})


// Global error handling middleware (should be registered last)
app.use(errorMiddleware);

export default app;
