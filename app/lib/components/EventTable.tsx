import {ActionIcon, Group, LoadingOverlay, Menu, ScrollArea, Table, Text} from '@mantine/core';
import {IconDots, IconPencil, IconTrash,} from '@tabler/icons';
import useEvents from "../middleware/useEvents";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import {modals} from "@mantine/modals";
import {Event} from "../../types/Event"
import axios from "axios";
import React from "react";
import EditEventForm from "./EditEventForm";

export function EventTable() {
    const {events, isLoading} = useEvents()
    if (!events || isLoading) {
        return <LoadingOverlay visible={true}/>
    }
    dayjs.extend(timezone)
    dayjs.extend(utc)
    const rows = events.map((item) => (
        <tr key={item.name}>
            <td>
                <Group spacing="sm">
                    <div>
                        <Text fz="sm" fw={500}>
                            {item.name}
                        </Text>
                    </div>
                </Group>
            </td>
            <td>
                <Text fz="sm">{item.description}</Text>
                <Text fz="xs" c="dimmed">
                    Description
                </Text>
            </td>
            <td>
                <Text fz="sm">{dayjs(item.startDate).local().format("MM/DD/YYYY h:m a")}</Text>
                <Text fz="xs" c="dimmed">
                    Start Date
                </Text>
            </td>
            <td>
                <Text fz="sm">{dayjs(item.endDate).local().format("MM/DD/YYYY h:m a")}</Text>
                <Text fz="xs" c="dimmed">
                    End Date
                </Text>
            </td>
            <td>
                <Text fz="sm">{item.points}</Text>
                <Text fz="xs" c="dimmed">
                    Points
                </Text>
            </td>
            <td>
                <Text fz="sm">{item.attendanceCode ? item.attendanceCode : "None"}</Text>
                <Text fz="xs" c="dimmed">
                    Attendance Code
                </Text>
            </td>
            <td>
                <Group spacing={0} position="right">
                    <OpenEditEventModal event={item}/>
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
                            <Menu.Item onClick={() => {
                                modals.openConfirmModal({
                                    title: "Delete this event?!?",
                                    children: (
                                        <Text size={"sm"}>
                                            Are you sure you want to delete this event?
                                        </Text>
                                    ),
                                    labels: {confirm: 'Delete event', cancel: "No! I want to keep it!"},
                                    confirmProps: {color: 'red'},
                                    onConfirm: () => axios.delete(`${process.env.NEXT_PUBLIC_API_PATH}/event/${item.id}`, {
                                        withCredentials: true
                                    }).then(() => {

                                    }),
                                })
                            }} icon={<IconTrash size="1rem" stroke={1.5}/>} color="red">
                                Delete Event
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Group>
            </td>
        </tr>
    ));

    return (
        <ScrollArea>
            <Table sx={{minWidth: 800}} verticalSpacing="md">
                <tbody>{rows}</tbody>
            </Table>
        </ScrollArea>
    );
}

function OpenEditEventModal(props: { event: Event }) {
    const {event} = props;
    return (
        <ActionIcon onClick={() => {
            modals.open({
                title: `Edit ${event.name}`,
                children: (
                    <EditEventForm event={event}/>
                )
            })
        }}>
            <IconPencil size={"1rem"} stroke={1.5}/>
        </ActionIcon>
    )
}

