import express from "express";
import cors from "cors";
// import path from "path";
import dotenv from "dotenv";
import connector from "./database/connection.js";
import userRoutes from "./routes/user_auth.js";

dotenv.config();
connector()

const app=express();
app.use(express.json());
app.use(cors());
// app.use(express.static(path.join(__dirname),"public"));
// routes

app.use("/user",userRoutes);



app.listen(process.env.PORT, () => {
    console.log(`Server is running at port ${process.env.PORT}`);
})