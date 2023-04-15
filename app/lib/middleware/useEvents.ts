import useSWR, {BareFetcher} from "swr";
import {polyfillFetch} from "../common/polyfillFetch";
import {Event} from "../../types/Event";
import {PublicConfiguration} from "swr/_internal";

export default function useEvents(options?: Partial<PublicConfiguration<Event[], Error, BareFetcher<Event[]>>>) {
    const {
        data,
        error,
        isLoading
    } = useSWR<Event[], Error>(`${process.env.NEXT_PUBLIC_API_PATH}/event/`, polyfillFetch, options)
    return {
        events: data,
        isLoading,
        isError: error
    }
}
