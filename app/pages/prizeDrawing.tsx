import {Button, Group, LoadingOverlay, SegmentedControl, Select, Stack, Stepper, Text, Tooltip} from "@mantine/core";
import React, {useState} from "react";
import usePrizes from "../lib/middleware/usePrizes";
import axios from "axios";
import {modals} from "@mantine/modals";
import Shell from "../lib/components/Shell";

export default function PrizeDrawing() {
    const [active, setActive] = useState(0);
    const {prizes, isError, isLoading} = usePrizes()
    const nextStep = () => setActive((current) => (current < 2 ? current + 1 : current));
    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));
    const [prizeId, setPrizeId] = useState()
    const [prizesAvail, setPrizesAvail] = useState(true)
    const [drawMethod, setDrawMethod] = useState("drawTopFromGrades")
    if (isLoading) {
        return <LoadingOverlay visible={true}/>
    }
    console.log(prizes)
    if (!prizes || prizes.length == 0) {
        setPrizesAvail(false)
    }
    console.log(prizesAvail)
    return (
        <Shell>
            <>
                <h1>Prize Drawing</h1>
                <Stepper active={active} onStepClick={setActive} breakpoint="sm">
                    <Stepper.Step label="First step" description="Select a prize">
                        <Stack>
                            {prizesAvail ? <Select

                                // @ts-ignore
                                onChange={setPrizeId} data={prizes?.map((prize) => {
                                return {
                                    value: prize.id,
                                    label: prize.name,
                                    disabled: prize.stock ? ((prize.stock - 1) < 0) : false
                                }
                            })}/> : "No prizes available"}
                        </Stack>
                    </Stepper.Step>
                    <Stepper.Step label="Second step" description="Select Drawing Method">
                        Select Method:
                        <SegmentedControl value={drawMethod} onChange={setDrawMethod} data={[
                            {label: "Top From Grades", value: "drawTopFromGrades"},
                            {label: "Random From Grades", value: "drawRandomFromGrades"}
                        ]}/>
                    </Stepper.Step>
                    <Stepper.Completed>
                        Options set. Click Submit to draw students.
                    </Stepper.Completed>
                </Stepper>
                {prizesAvail ? <Group position="center" mt="xl">
                    <Button variant="default" onClick={prevStep}>Back</Button>
                    <Button onClick={active == 2 ? () => {
                        axios.get(`${process.env.NEXT_PUBLIC_API_PATH}/prize/${prizeId}/${drawMethod}`, {
                            withCredentials: true
                        })
                            .then((res) => {
                                modals.open({
                                    id: `prize-${prizeId}-draw`,
                                    title: "Prizes Added to Student Accounts",
                                    children: <>
                                        {Object.entries(res.data).map((studentData) => {
                                            // @ts-ignore
                                            if (!studentData[1].hasOwnProperty("name")) {
                                                // @ts-ignore
                                                return (<Text key={studentData[1].id} fz={"md"}>{studentData[0]}th grade winner: No winner
                                                    selected</Text>)
                                            }
                                            // @ts-ignore
                                            return (<Text key={studentData[1].id} fz={"md"}>{studentData[0]}th grade
                                                winner: {
                                                    // @ts-ignore
                                                    studentData[1]["name"]
                                            }</Text>)
                                        })}
                                    </>
                                })
                                setActive(0)
                            })}
                     : nextStep}>{active == 2 ? "Submit" : "Next step"}</Button>
                </Group> : <Group position="center">
                    <Tooltip label="No prizes available">
                        <Button
                            data-disabled
                            sx={{'&[data-disabled]': {pointerEvents: 'all'}}}
                            onClick={(event) => event.preventDefault()}
                        >
                            Next Step
                        </Button>
                    </Tooltip>
                </Group>}
            </>
        </Shell>
    )
}