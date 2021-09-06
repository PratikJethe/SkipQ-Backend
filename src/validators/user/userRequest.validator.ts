import { body, check } from "express-validator"
import { exists } from "fs"
import { authProviderEnum, genderEnum } from "../../constants/enums"


export const userRegisterValidation = [

    check('fullName','fullName is required').exists({checkFalsy:true}).isString().withMessage('Invalid fullname'),
    check('phoneNo','phoneNo is required').exists({checkFalsy:true}).isNumeric().withMessage('Invalid phone number').isLength({min:10,max:10}).withMessage('Invalid phone number'),
    check('authProvider','authProvider is required').exists({checkFalsy:true}).bail().custom((authProvider)=>{
         return  Object.values(authProviderEnum).includes(authProvider)
    }),
    check('fcm','fcm token required').exists({checkFalsy:true}).bail().isString().withMessage('Invalid fcm token'),
    check('apartment','Invalid apartment value').optional().exists({checkFalsy:true}).isString(),
    check('address','Invalid address value').optional().exists({checkFalsy:true}).isString(),
    check('email','Invalid email value').optional().exists({checkFalsy:true}).isString().isEmail(),
    check('coordinates','Invalid coordinates').optional().exists({checkFalsy:true}).isArray({min:2,max:2}).bail().custom((coordinates)=>{
        console.log(coordinates)
        return (coordinates[0]>=-180 && coordinates[0]<=180 && coordinates[1]>=-90 && coordinates[1]<=90)
    }),
    check('gender','Invalid gender value').optional().exists({checkFalsy:true}).isString().bail().custom((gender)=>{
        return  Object.values(genderEnum).includes(gender)
    }),
    check('dateOfBirth','Invalid Date of birth').optional().exists({checkFalsy:true}).bail().isString().bail().isISO8601(),
    check('profilePicUrl','Invalid profile pic url').optional().exists({checkFalsy:true}).bail().isString().bail()
    
    // custom((apartment)=>{
    //     console.log('aprt',apartment)
    //     if(!apartment){
    //      return true
    //     }else{
    //         console.log('ala')
          
    //       if(typeof apartment !=="string") return 'Invalid apartment 2'
    //     }
    //   return true  
    // }
    
]
export const phoneLoginValidation = [

]


// fullName:String,
// phoneNo:number,
// authProvider:authProviderEnum,
// fcm:String
// apartment?:String,
// address2?:String,
// email?:String,
// geometry?:IGeometry,
// gender?:genderEnum,