import useSWR, {mutate} from "swr";
import React from "react";
import {ActionIcon, Group, LoadingOverlay, Menu, ScrollArea, Table, Text} from "@mantine/core";
import _ from "lodash"
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import {IconCheck, IconDots, IconLoader, IconTrash, IconX} from "@tabler/icons";
import {modals} from "@mantine/modals";
import axios from "axios";
import {polyfillFetch} from "../common/polyfillFetch";

export default function PrizeFulfillmentTable() {
    const {data, isLoading} = useSWR(`${process.env.NEXT_PUBLIC_API_PATH}/prize/redemptions`, polyfillFetch)
    if (!data || isLoading) {
        return <LoadingOverlay visible={true}/>
    }
    dayjs.extend(timezone)
    dayjs.extend(utc)
    // @ts-ignore
    const rows = data.map((item) => {
        const statusItems = {
            "complete": <Menu.Item onClick={() => {
                axios.post(`${process.env.NEXT_PUBLIC_API_PATH}/prize/redemptions/${item.id}/complete`, {}, {
                    withCredentials: true
                }).then(async () => {
                    await mutate(`${process.env.NEXT_PUBLIC_API_PATH}/prize/redemptions`)
                    await mutate(`${process.env.NEXT_PUBLIC_API_PATH}/prize/redemptions/${item.id}`)
                })
            }} icon={<IconCheck size="1rem" stroke={1.5}/>}>
                Mark complete
            </Menu.Item>,
            "cancelled": <Menu.Item onClick={() => {
                axios.patch(`${process.env.NEXT_PUBLIC_API_PATH}/prize/redemptions/${item.id}`, {
                    "status": "cancelled"
                }, {
                    withCredentials: true
                }).then(async () => {
                    await mutate(`${process.env.NEXT_PUBLIC_API_PATH}/prize/redemptions`)
                    await mutate(`${process.env.NEXT_PUBLIC_API_PATH}/prize/redemptions/${item.id}`)
                })
            }} icon={<IconX size="1rem" stroke={1.5}/>}>
                Mark cancelled
            </Menu.Item>,
            "processing": <Menu.Item onClick={() => {
                axios.patch(`${process.env.NEXT_PUBLIC_API_PATH}/prize/redemptions/${item.id}`, {
                    "status": "processing"
                }, {
                    withCredentials: true
                }).then(async () => {
                    await mutate(`${process.env.NEXT_PUBLIC_API_PATH}/prize/redemptions`)
                    await mutate(`${process.env.NEXT_PUBLIC_API_PATH}/prize/redemptions/${item.id}`)
                })
            }} icon={<IconLoader size="1rem" stroke={1.5}/>}>
                Mark processing
            </Menu.Item>
        }
        return (
            <tr key={item.id}>
                <td>
                    <Group spacing="sm">
                        <div>
                            <Text fz="sm" fw={500}>
                                {item.id}
                            </Text>
                        </div>
                    </Group>
                </td>
                <td>
                    <Text fz="sm">{_.startCase(item.redemptionOrigin)}</Text>
                    <Text fz="xs" c="dimmed">
                        Redemption Origin
                    </Text>
                </td>
                <td>
                    <Text fz="sm">{item.redeemedFor.name}</Text>
                    <Text fz="xs" c="dimmed">
                        Student Name
                    </Text>
                </td>
                <td>
                    <Text fz="sm">{item.prize.name}</Text>
                    <Text fz="xs" c="dimmed">
                        Prize
                    </Text>
                </td>
                <td>
                    <Text fz="sm">{_.capitalize(item.status)}</Text>
                    <Text fz="xs" c="dimmed">
                        Fulfillment Status
                    </Text>
                </td>
                <td>
                    <Text fz="sm">{dayjs(item.redeemedAt).local().format("MM/DD/YYYY h:m a")}</Text>
                    <Text fz="xs" c="dimmed">
                        Redeemed At
                    </Text>
                </td>
                <td>
                    <Text
                        fz="sm">{item.fulfilledAt ? dayjs(item.fulfilledAt).local().format("MM/DD/YYYY h:m a") : "Not yet fulfilled"}</Text>
                    <Text fz="xs" c="dimmed">
                        Fulfilled At
                    </Text>
                </td>
                <td>
                    <Group spacing={0} position="right">
                        <Menu
                            transitionProps={{transition: 'pop'}}
                            withArrow
                            position="bottom-end"
                            withinPortal
                        >
                            <Menu.Target>
                                <ActionIcon>
                                    <IconDots size="1rem" stroke={1.5}/>
                                </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                                {
                                    _.values(_.omit(statusItems, [item.status]))
                                }
                                <Menu.Item onClick={() => {
                                    modals.openConfirmModal({
                                        title: "Remove this redemption?!?",
                                        children: (
                                            <Text size={"sm"}>
                                                Are you sure you want to remove this redemptions?
                                            </Text>
                                        ),
                                        labels: {confirm: 'Remove redemption', cancel: "No! I want to keep it!"},
                                        confirmProps: {color: 'red'},
                                        onConfirm: () => axios.delete(`${process.env.NEXT_PUBLIC_API_PATH}/prize/redemptions/${item.id}`).then(async () => {
                                            await mutate(`${process.env.NEXT_PUBLIC_API_PATH}/prize/redemptions`)
                                            await mutate(`${process.env.NEXT_PUBLIC_API_PATH}/prize/redemptions/${item.id}`)
                                        }),
                                    })
                                }} icon={<IconTrash size="1rem" stroke={1.5}/>} color="red">
                                    Remove Redemption
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Group>
                </td>
            </tr>)
    })
    return (
        <ScrollArea>
            <Table sx={{minWidth: 800}} verticalSpacing="md">
                <tbody>{rows}</tbody>
            </Table>
        </ScrollArea>
    );
}

export function StudentPrizeFulfillmentTable({studentId}: { studentId: number }) {
    const {
        data,
        isLoading
    } = useSWR(`${process.env.NEXT_PUBLIC_API_PATH}/prize/redemptions/findByStudent/${studentId}`, polyfillFetch)
    if (!data || isLoading) {
        return <LoadingOverlay visible={true}/>
    }
    dayjs.extend(timezone)
    dayjs.extend(utc)
    //@ts-ignore
    const rows = data.map((item) => {
        return (
            <tr key={item.id}>
                <td>
                    <Group spacing="sm">
                        <div>
                            <Text fz="sm" fw={500}>
                                {item.id}
                            </Text>
                        </div>
                    </Group>
                </td>
                <td>
                    <Text fz="sm">{item.prize.name}</Text>
                    <Text fz="xs" c="dimmed">
                        Prize
                    </Text>
                </td>
                <td>
                    <Text fz="sm">{_.startCase(item.redemptionOrigin)}</Text>
                    <Text fz="xs" c="dimmed">
                        Redemption Origin
                    </Text>
                </td>
                <td>
                    <Text fz="sm">{_.capitalize(item.status)}</Text>
                    <Text fz="xs" c="dimmed">
                        Fulfillment Status
                    </Text>
                </td>
                <td>
                    <Text fz="sm">{dayjs(item.redeemedAt).local().format("MM/DD/YYYY h:m a")}</Text>
                    <Text fz="xs" c="dimmed">
                        Redeemed At
                    </Text>
                </td>
                <td>
                    <Text
                        fz="sm">{item.fulfilledAt ? dayjs(item.fulfilledAt).local().format("MM/DD/YYYY h:m a") : "Not yet fulfilled"}</Text>
                    <Text fz="xs" c="dimmed">
                        Fulfilled At
                    </Text>
                </td>
            </tr>)
    })
    return (
        <ScrollArea>
            <Table sx={{minWidth: 800}} verticalSpacing="md">
                <tbody>{rows}</tbody>
            </Table>
        </ScrollArea>
    );
}