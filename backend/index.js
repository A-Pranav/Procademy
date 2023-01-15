import express from "express";
import cors from "cors";
// import path from "path";
import dotenv from "dotenv";
import connector from "./database/connection.js";
import userRoutes from "./routes/user_auth.js";
import courseRoutes from "./routes/courseRoutes.js";

dotenv.config();
connector()

const app=express();
app.use(express.json());
app.use(cors());
// app.use(express.static(path.join(__dirname),"public"));
// routes
console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");

app.use("/user",userRoutes);
app.use("/course",courseRoutes);

console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");

app.listen(process.env.PORT, () => {
    console.log(`Server is running at port ${process.env.PORT}`);
})