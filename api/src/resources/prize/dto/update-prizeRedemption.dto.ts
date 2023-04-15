import {Column, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Student} from "../../student/entities/student.entity";
import {Prize} from "../entities/prize.entity";

export default class UpdatePrizeRedemptionDto {
    status?: "fulfilled"|"cancelled"|"processing"
    fulfilledAt?: Date
    fulfillmentComments?: string
}