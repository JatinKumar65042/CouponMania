import express from "express";
import { config } from "dotenv";
import cors from "cors" ;
import cookieParser from 'cookie-parser' ;
import userRoutes from "./src/routes/user.route.js";
import couponRoutes from "./src/routes/coupon.route.js" ;
import path from "path" ;
config() ;

const app = express() ;
const _dirname = path.resolve() ;
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.json({limit: "16kb"})) 
app.use(express.urlencoded({extended:true , limit: "16kb"})) 
app.use(express.static("public"))
app.use(cookieParser())
// app.get("/", (req, res) => {
//     res.send("Backend is running!");
// });
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/coupon' , couponRoutes)


app.use(express.static(path.join(_dirname , "/client/dist")))
app.get("*", (req, res) => {
    res.sendFile(path.resolve(_dirname, "client", "dist", "index.html"));
});

export {app} ;
