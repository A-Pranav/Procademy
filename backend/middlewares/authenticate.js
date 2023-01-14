// import { check, validationResult } from "express-validator";
import jwt from "jsonwebtoken";

export default async function authenticate(req, res, next) {
    try {
        const token = req.header('x-auth-token');
        if (!token) {
            return res.status(401).json({ msg: 'No token, authorization denied' });
        }
        const verified= jwt.verify(token, process.env.JWT_SECRET);
        // config.get('jwtSecret'));
        if(!verified){
            return res.status(401).json({"msg":"validation failed"})
        }
        req.user = decoded.user_id;
        next();
    } catch (err) {
        console.log("middleware auth err",err);
        res.status(500).json({ error:err.message });
    }
}