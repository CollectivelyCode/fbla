import useSWR from "swr"
import {polyfillFetch} from "../common/polyfillFetch";
import {Event} from "../../types/Event"

export default function useCurrentEvents() {
    const {
        data,
        error,
        isLoading
    } = useSWR<Event[], Error>(`${process.env.NEXT_PUBLIC_API_PATH}/event/currentEvents`, polyfillFetch)
    return {
        events: data,
        isLoading,
        isError: error
    }
}
