import useSWR from "swr";
import {polyfillFetch} from "../common/polyfillFetch";

export default function useProfile(): {
    user: {
        id: number,
        username: string
        roles: "admin" | "student",
        student: {
            id: number
            name: string
            grade: number
            points: number
        }
    },
    isLoading: boolean,
    isError: any
} {
    const {data, error, isLoading} = useSWR(`${process.env.NEXT_PUBLIC_API_PATH}/auth/profile`, polyfillFetch)
    return {
        user: data,
        isLoading,
        isError: error
    }
}
