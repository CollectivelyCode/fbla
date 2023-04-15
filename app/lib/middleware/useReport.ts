import useSWR from "swr";
import {polyfillFetch} from "../common/polyfillFetch";

export default function useReport(timeSpan: "week"|"month"|"quarter"): {
    report: {
        [key: string]: {
            title: string,
            value: string | number,
            diff?: string,
            description: string
        }
    },
    isLoading: boolean,
    isError: any
} {
    const {
        data,
        error,
        isLoading
    } = useSWR(`${process.env.NEXT_PUBLIC_API_PATH}/analytics/report/?timeSpan=${timeSpan}`, polyfillFetch)
    return {
        report: data,
        isLoading,
        isError: error
    }
}
