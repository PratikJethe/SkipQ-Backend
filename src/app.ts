import express, { Application, Request, Response, json, NextFunction } from "express";
import { mongoConnect } from "./helpers/mongodb";
import userRoutes from "./routes/v1/user";
import { v4 as uuidv4 } from "uuid";
import { apiResponseService } from "./services/apiResponse.service";
import { IApiResponse } from "./interfaces/apiResponse.interface";
import clinicRoutes from "./routes/v1/clinic";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ClinicModel } from "./models/clinic/clinic.model";
const app: Application = express();




mongoConnect()
  .then(() => {
    console.log("connected");
  })
  .catch((error) => {
    console.log("mongo connection failed");
    process.exit(1);
  });

app.use(json());
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

//mismatched routes
app.use("*", (req, res, next) => {
console.log('not found')
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

app.listen(3000, "192.168.0.104", () => console.log("running"));
