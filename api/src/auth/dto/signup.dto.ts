import {StudentOptions} from "../auth.service";

export interface SignupDto {
    username: string
    password: string
    accountType: "student"|"admin"
    studentData?: StudentOptions
    signUpCode?: string
}