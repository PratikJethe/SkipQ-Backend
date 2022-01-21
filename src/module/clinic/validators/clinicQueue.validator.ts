import { check } from "express-validator"
import { authProviderEnum, genderEnum } from "../../../constants/enums"


//when user requests a token 
export const onlineTokenCreateValidation = [
    check('clinicId','clinicId required').exists({checkFalsy:true}).bail().isMongoId().withMessage('Invalid clinic id').bail()
]
//when doctor creates token for offline user
export const offlineTokenCreateValidation = [
    check('userName','Inavlid user name').optional().exists({checkFalsy:true}).isString()
]

//online patient token update
export const onlineTokenUpdateValidation =[
    check('tokenId','tokenId is required').exists({checkFalsy:true}).bail().isMongoId().withMessage('Invalid token').bail()
]

//offline patient token update
export const offlineTokenUpdateValidation =[
    check('tokenId','tokenId is required').exists({checkFalsy:true}).bail().isString().withMessage('Invalid token').bail()
]

