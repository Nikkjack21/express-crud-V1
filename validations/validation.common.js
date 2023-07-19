
import { check } from "express-validator";


const emailValidation = [
    check('email', 'Email is required').not().isEmpty(),
    check('email', 'Invalid email').normalizeEmail().isEmail(),
]

















export {
    emailValidation,
}