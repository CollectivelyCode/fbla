import useSWR from "swr";
import {polyfillFetch} from "../common/polyfillFetch";

export default function useUser(id: number): {
    user: {
        id: number
        username: string
    }
    isLoading: boolean,
    isError: any
} {
    const {data, error, isLoading} = useSWR(`${process.env.NEXT_PUBLIC_API_PATH}/user/${id}`, polyfillFetch)
    return {
        user: data,
        isLoading,
        isError: error
    }
}
