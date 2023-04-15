import Shell from "../lib/components/Shell";
import useProfile from "../lib/middleware/useProfile";
import {Divider, LoadingOverlay, Title} from "@mantine/core";
import {StudentPrizeFulfillmentTable} from "../lib/components/PrizeFulfillmentTable";

export default function PrizeRedemptions() {
    const profile = useProfile()
    if (profile.isLoading || !profile.user) {
        return <LoadingOverlay visible={true}/>
    }
    return (
        <Shell>
            <Title order={1}>
                Your Prize Redemptions
            </Title>
            <Divider my={"sm"}/>
            <StudentPrizeFulfillmentTable studentId={profile.user.student.id}/>
        </Shell>
    )
}