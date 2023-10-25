import express from "express";
import bodyParser from "body-parser";
import * as dotenv from 'dotenv'

dotenv.config();

let app = express();

app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', process.env.URL_REACT);

    /**Request methods you wish to allow*/
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    /**Request headers you wish to allow*/
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    /**Set to true if you need the website to include cookies in the requests sent
    to the API (e.g. in case you use sessions)*/
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});
app.use(express.json())
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

webRoutes(app)
databaseConnect()

let port = process.env.PORT;

app.listen(port, () => {
    console.log("Backend is running on port", port);
})