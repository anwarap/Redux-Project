import express from "express";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import { notFound,errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
import userRoutes from './routes/userRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
const port = process.env.PORT || 5000;
dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("backend/public"));
app.use(cookieParser());
app.use('/api/users',userRoutes)
app.use('/api/admin', adminRoutes);
app.get('/', (req, res) => res.send('server is ready'))

app.use(notFound)
app.use(errorHandler)

app.listen(port,()=>console.log(`Server is running on port ${port}`));