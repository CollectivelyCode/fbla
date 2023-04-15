import useSWR from "swr";
import {polyfillFetch} from "../common/polyfillFetch";
import {Prize} from "../../types/Prize";

export default function usePrizes() {
    const {data, error, isLoading} = useSWR<Prize[], Error>(`${process.env.NEXT_PUBLIC_API_PATH}/prize/`, polyfillFetch)
    return {
        prizes: data,
        isLoading,
        isError: error
    }
}
