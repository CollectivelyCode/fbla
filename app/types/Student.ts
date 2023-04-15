import {z} from "zod";

export interface Student {
    id: number
    name: string
    grade: number
    points: number
    eventAttendance: Event[],
    user: {
        username: string
    }
}
export const StudentSchema = z.object({
    name: z.string(),
    grade: z.number().min(9).max(12),
    points: z.number().min(0).positive().int()
})