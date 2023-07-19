
import { check } from "express-validator";
import { emailValidation } from "./validation.common.js";


const loginValidator = [
    ...emailValidation,
    check('password', "Password is required").not().isEmpty()
]





export {
    loginValidator,
}