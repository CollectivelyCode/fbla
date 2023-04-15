import useReport from "../lib/middleware/useReport";
import {Card, Divider, Group, LoadingOverlay, Select, Title} from "@mantine/core";
import {StatsGroup} from "../lib/components/StatsGroup";
import {StatsGridIcons} from "../lib/components/StatsGridIcon";
import Shell from "../lib/components/Shell";
import React, {useState} from "react";

export default function Reports() {
    const [period, setPeriod] = useState<"week"|"month"|"quarter">("month")
    const {report, isError, isLoading} = useReport(period)
    if (isLoading) {
        return <LoadingOverlay visible={true}/>
    }

    return (
        <Shell>
            <Card shadow={"sm"} withBorder>
                <Group>
                    <Title order={1}>
                        Your Report
                    </Title>
                    <Divider orientation="vertical"/>
                    <Select
                        // @ts-ignore
                        label={"Reporting period"} value={period} onChange={setPeriod} data={[
                        {value: "month", label: "Month"},
                        {value: "week", label: "Week"}
                    ]}/>
                </Group>
                <Divider my={"sm"}/>

                <>
                    <StatsGroup data={[
                        report["averagePointBalance"],
                        report["totalPointsAccrued"],
                        report["topPrize"],
                        report["topEvent"]
                    ]}/>
                    <Divider my={"sm"}/>
                    <StatsGridIcons period={period} data={
                        [
                            // @ts-ignore
                            report["prizeRedemptions"],
                            // @ts-ignore
                            report["eventAttendance"]
                        ]}/>
                </>
            </Card>

        </Shell>
    )
}