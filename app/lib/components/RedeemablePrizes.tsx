import useRedeemablePrizes from "../middleware/useRedeemablePrizes";
import PrizeCard from "./PrizeCard";
import {LoadingOverlay} from "@mantine/core";

export function RedeemablePrizes() {
    const {prizes, isLoading, isError} = useRedeemablePrizes()
    if (isLoading) {
        return <LoadingOverlay visible={true}/>
    }
    if (!prizes || isError) {
        return <LoadingOverlay visible={true}/>
    }
    return (
        <>
            {prizes.map((prize) => {
                return (
                    <PrizeCard key={prize.id} prize={prize}/>
                )
            })}
        </>
    )
}