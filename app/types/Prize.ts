import { z } from "zod"

export interface Prize {
    id: number
    name: string
    selfRedeemable: boolean
    pointsRequired: number
    stock?: number

}
export const PrizeSchema = z.object({
    name: z.string().min(4).max(64),
    selfRedeemable: z.boolean(),
    pointsRequired: z.number().min(1).optional(),
    stock: z.number().positive().optional()
})