import express, { Application,Request,Response,json, NextFunction} from "express"
import { mongoConnect } from "./helpers/mongodb"
import userRoutes from "./routes/v1/user"
import { v4 as uuidv4 } from 'uuid';
import { apiResponseService } from "./services/apiResponse.service";
import { IApiResponse } from "./interfaces/apiResponse.interface";
import clinicRoutes from "./routes/v1/clinic";
import cookieParser from "cookie-parser";
import cors from 'cors'
import { clinicSubscriptionService } from "./services/clinic/clinicSubscription.service";
const app:Application = express()



clinicSubscriptionService.generateStartEndDate(1)
mongoConnect().then(()=>{
   console.log('connected')
}).catch((error)=>{
   console.log('mongo connection failed')
   process.exit(1)
})

app.use(json());
app.use(cookieParser())
app.use(cors(
))

app.use(function (req:Request, res:Response,next:NextFunction) {

   req.requestId = uuidv4();
   next();
 })

//user specific routes
app.use('/api/v1/user',userRoutes)



//clinic specific routes
app.use('/api/v1/clinic',clinicRoutes)

app.use(async (response: IApiResponse, req: Request, res: Response, next: NextFunction) => {
     apiResponseService.responseHandler(response,req,res,next)
  });



app.listen(3000,()=>console.log('running'))