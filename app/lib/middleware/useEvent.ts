import useSWR from "swr"
import {polyfillFetch} from "../common/polyfillFetch";
import {Event} from "../../types/Event"

export default function useEvent(id: number) {
    const {
        data,
        error,
        isLoading
    } = useSWR<Event, Error>(`${process.env.NEXT_PUBLIC_API_PATH}/event/${id}`, polyfillFetch)
    return {
        event: data,
        isLoading,
        isError: error
    }
}
