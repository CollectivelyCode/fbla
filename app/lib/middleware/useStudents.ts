import useSWR from "swr";
import {polyfillFetch} from "../common/polyfillFetch";

export default function useStudents(): {
    students: {
        id: number
        name: string
        grade: number
        points: number
        eventAttendance: Event[],
        user: {
            username: string
        }
    }[]
    isLoading: boolean,
    isError: any
} {
    const {data, error, isLoading} = useSWR(`${process.env.NEXT_PUBLIC_API_PATH}/student`, polyfillFetch)
    return {
        students: data,
        isLoading,
        isError: error
    }
}
