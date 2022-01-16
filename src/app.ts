import express, { Application, Request, Response, json, NextFunction } from "express";
import { mongoConnect } from "./helpers/mongodb";
import userRoutes from "./module/user/routes/v1";
import { v4 as uuidv4 } from "uuid";
import { apiResponseService } from "./services/apiResponse.service";
import { IApiResponse } from "./interfaces/apiResponse.interface";
import clinicRoutes from "./module/clinic/routes/v1";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ClinicModel } from "./module/clinic/model/clinic.model";
import { firebaseService } from "./services/firebase/firebase.service";
import { initializeBackend } from "./helpers/initialize";
import clinicDao from "./module/clinic/dao/clinic.dao";
require('dotenv').config({path:'.env'})

const app: Application = express();

//  mongoConnect()
//   .then(() => {
//     console.log("connected");
//     firebaseService.initializeFirebaseApp();
//   })
//   .catch((error) => {
//     console.log(error)
//     console.log("mongo connection failed");
//     process.exit(1);
//   });

initializeBackend
  .initializeBackend()
  .then(() => {

 

    app.use(json());
    app.use(express.urlencoded({ extended: true }))
    app.use(cookieParser());
    app.use(cors());

    app.use(function (req: Request, res: Response, next: NextFunction) {
      req.requestId = uuidv4();
      console.log(req.requestId);
      next();
    });

    //user specific routes
    app.use("/api/v1/user", userRoutes);

    //clinic specific routes
    app.use("/api/v1/clinic", clinicRoutes);

    app.post("/api/v1/webhook", async (req: Request, res: Response, next: NextFunction) => {
      console.log('Webhook')
      console.log(req.body)
      return res.status(200).send("DONE");
    });

    //mismatched routes
    app.use("*", (req, res, next) => {
      console.log("not found");
      console.log(req.baseUrl);
      let response: IApiResponse = {
        status: 404,
        errorMsg: "route not found"
      };
      apiResponseService.responseHandler(response, req, res, next);
    });

    app.use(async (response: IApiResponse, req: Request, res: Response, next: NextFunction) => {
      apiResponseService.responseHandler(response, req, res, next);
    });

    app.listen( process.env.PORT||3000 as any, "192.168.0.103", () => console.log("running"));
  })
  .catch((error) => {
    console.log(error);
    console.log("mongo connection failed");
    process.exit(1);
  });
