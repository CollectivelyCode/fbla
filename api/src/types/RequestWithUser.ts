import {Request} from "express";
import {User} from "../resources/user/entities/user.entity";
export interface RequestWithUser extends Request {
    user: User
}