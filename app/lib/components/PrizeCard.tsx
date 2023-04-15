import {Prize} from "../../types/Prize";
import {Badge, Button, Card, Group, LoadingOverlay, Text, Tooltip} from "@mantine/core";
import React from "react";
import useProfile from "../middleware/useProfile";
import {modals} from "@mantine/modals";
import axios from "axios";
import {notifications} from "@mantine/notifications";
import {IconCheck} from "@tabler/icons";
import {mutate} from "swr";

export default function PrizeCard(props: { prize: Prize }) {
    const {prize} = props
    const profile = useProfile()
    if (profile.isLoading) {
        return <LoadingOverlay visible={true}/>
    }
    if ((profile.user.student.points - prize.pointsRequired) < 0) {
        return (
            <Card shadow={"sm"} withBorder={true}>
                <Group>
                    <Text weight={500}>{prize.name}</Text>
                    <Badge color={"blue"}>{prize.stock} left</Badge>
                </Group>
                <Tooltip label={"You don't have enought points to redeem this prize"}>
                    <Button
                        data-disabled variant="light"
                        fullWidth mt="md"
                        radius="md"
                        sx={{
                            '&[data-disabled]': {
                                pointerEvents: 'all',
                                opacity: 0.4
                            }
                        }}
                        styles={(theme) => ({
                            label: {
                                color: theme.white
                            }
                        })}
                        onClick={(event) => event.preventDefault()}>
                        Redeem for {prize.pointsRequired} points
                    </Button>
                </Tooltip>
            </Card>
        )
    }
    return (
        <Card shadow={"sm"} withBorder={true}>
            <Group>
                <Text weight={500}>{prize.name}</Text>
                <Badge color={"blue"}>{prize.stock} left</Badge>
            </Group>
            <Button variant={"light"} color={"blue"} fullWidth mt={"md"} radius={"md"} onClick={() => {
                modals.openConfirmModal({
                    title: "Are you sure you want to redeem this prize?",
                    children: (
                        <Text size={"sm"}>
                            Redeeming this prize will cost {prize.pointsRequired} points, this action is permanent.
                        </Text>
                    ),
                    onConfirm() {
                        notifications.show({
                            id: `redeem-${prize.id}`,
                            title: "Redeeming your prize",
                            message: "*jeopardy theme intensifies*",
                            loading: true,
                            autoClose: false
                        })
                        axios.post(`${process.env.NEXT_PUBLIC_API_PATH}/prize/${prize.id}/redeem`, {}, {
                            withCredentials: true
                        }).then(async () => {
                            await mutate(`${process.env.NEXT_PUBLIC_API_PATH}/prize/`)
                            await mutate(`${process.env.NEXT_PUBLIC_API_PATH}/prize/${prize.id}`)
                            notifications.update({
                                id: `redeem-${prize.id}`,
                                title: "Prize redeemed!",
                                message: "Your prize will be fulfilled (delivered to you) asap!",
                                icon: <IconCheck/>,
                                color: "teal",
                                autoClose: 5000
                            })
                        })
                    }
                })
            }}>
                Redeem for {prize.pointsRequired} points
            </Button>
        </Card>
    )
}