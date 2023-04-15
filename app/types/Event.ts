import {z} from "zod";
import dayjs from "dayjs";

export interface Event {
    id: number
    name: string
    startDate: Date
    eventType: EventType
    endDate: Date
    description: string
    attendanceCode?: number
    points: number
}
export enum EventType {
    Sports = "Sports",
    NonSport = "NonSport"
}
// @ts-ignore
export const eventSchema = z.object({
    name: z.string().min(4).max(32),
    startDate: z.date().min(dayjs().toDate()),
    endDate: z.date().min(dayjs().toDate()),
    description: z.string().min(4).max(512),
    eventType: z.nativeEnum(EventType),
    points: z.number().min(0),
    attendanceCode: z.string().regex(new RegExp("/[0-9]{4}/g")).optional()
})