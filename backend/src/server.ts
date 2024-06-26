import express from "express";
import bodyParser from "body-parser"
import * as dotenv from "dotenv"
import { webRoutes } from "./routes/web"
import connectDB from "./configs/connectDB";
import { errorHandler } from "./middlewares/error";
import cors from 'cors';
import cookieParser from "cookie-parser";

dotenv.config();

let app = express()

app.use(cors())
app.use(cookieParser());

app.use((req, res, next) => {
    /**Request methods you wish to allow*/
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    /**Request headers you wish to allow*/
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    /**Set to true if you need the website to include cookies in the requests sent
    to the API (e.g. in case you use sessions)*/
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    next();
})

/**Cấu hình các tham số phía Body-parser gửi lên*/
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
webRoutes(app)
connectDB()

app.use(errorHandler)

let port = process.env.PORT;

app.listen(port, () => {
    console.log('Backend is running on port', port);
})