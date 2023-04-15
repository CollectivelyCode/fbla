import useEvent from "../middleware/useEvent";
import {
    ActionIcon,
    Badge,
    Button,
    Card,
    Group,
    LoadingOverlay,
    Skeleton,
    Text,
    TextInput,
    Tooltip
} from "@mantine/core";
import Link from "next/link";
import React, {useState} from "react";
import axios, {AxiosError} from "axios";
import {notifications} from "@mantine/notifications";
import {IconCheck, IconX} from "@tabler/icons";
import useProfile from "../middleware/useProfile";
import useSWR, {mutate} from "swr";
import {polyfillFetch} from "../common/polyfillFetch";
import {Event} from "../../types/Event"
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

export default function EventCard(props: {
    id: number
}) {
    const eventData = useEvent(props.id)
    const userData = useProfile()
    if (eventData.isLoading || userData.isLoading) {
        return (
            <Skeleton>
                <Card shadow={"sm"} withBorder={true}>
                    <Group>
                        <Text weight={500}>Breaking Bad: not Live</Text>
                        <Badge color={"blue"}>10</Badge>
                    </Group>
                    <Text size={"sm"} color={"dimmed"}>
                        This is some filler text I made up
                    </Text>
                    <Button variant="light" color="blue" fullWidth mt="md" radius="md">
                        Fallback
                    </Button>
                </Card>
            </Skeleton>
        )
    }
    if (eventData.isError || userData.isError || !eventData.event) {
        return <h1>error</h1>
    }
    const event = eventData.event
    const user = userData.user
    const startTime = dayjs(event.startDate)
    dayjs.extend(relativeTime)
    if (dayjs().isBefore(startTime)) {
        return (
            <Card shadow={"sm"} withBorder={true}>
                <Group>
                    <Text weight={500}>{event.name}</Text>
                    <Badge color={"blue"}>{event.points} points</Badge>
                </Group>
                <Text size={"sm"} color={"dimmed"}>
                    {event.description}
                </Text>
                <Tooltip label={`Available ${startTime.fromNow()}`}>
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
                        Mark My Attendance
                    </Button>
                </Tooltip>
            </Card>
        )
    }
    return (
        <>
            <Card shadow={"sm"} withBorder={true}>
                <Group>
                    <Link href={`/event/${event.id}`}>
                        <Text weight={500}>{event.name}</Text>
                    </Link>
                    <Badge color={"blue"}>{event.points} points</Badge>
                </Group>
                <Text size={"sm"} color={"dimmed"}>
                    {event.description}
                </Text>
                {userData.user.roles == "admin" ? <AdminStats event={event}/> : null}
                {userData.user.roles == "student" ?
                    <AttendanceButton studentId={user.student.id} eventId={event.id}/> : null}
            </Card>
        </>
    )
}

function AttendanceButton(props: {
    studentId: number
    eventId: number
}) {
    const [code, setCode] = useState()
    const attendanceData = useSWR(`${process.env.NEXT_PUBLIC_API_PATH}/student/${props.studentId}/attendance/${props.eventId}`, polyfillFetch)
    const eventData = useEvent(props.eventId)
    if (attendanceData.isLoading || eventData.isLoading) {
        return (
            <Button
                loading
                variant="light"
                fullWidth mt="md"
                radius="md"
                styles={(theme) => ({
                    label: {
                        color: theme.white
                    }
                })}/>
        )
    }
    console.log(attendanceData.error)
    const hasAttended: boolean = attendanceData.data.hasAttended
    if (hasAttended) {
        return (
            <Tooltip label={"You've already attended this event"}>
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
                    Mark My Attendance
                </Button>
            </Tooltip>
        )
    }
    if (eventData.isError || (attendanceData.error) || !eventData.event) {
        return <h1>Error</h1>
    }
    if (eventData.event.attendanceCode) {
        return (
            <Group>
                <Tooltip label={"This event requires an attendance code"}>
                    <TextInput value={code} onChange={(event) => {
                        // @ts-ignore
                        setCode(event.currentTarget.value)
                    }}/>
                </Tooltip>
                <ActionIcon color={"blue"} variant={"filled"} onClick={
                    (event) => {
                        const notificationId = "attendance-" + props.eventId
                        notifications.show({
                            id: notificationId,
                            loading: true,
                            title: "Marking your attendance",
                            message: "Our techno-wizard-monkeys are hard at work doing database stuffs",
                            autoClose: false
                        })
                        const data = axios.post<any, AxiosError>(`${process.env.NEXT_PUBLIC_API_PATH}/student/${props.studentId}/attendance/${props.eventId}`,
                            {
                                "attendanceCode": code
                            },
                            {
                                withCredentials: true
                            })
                            .then(async (response) => {
                                notifications.update({
                                    id: notificationId,
                                    color: "teal",
                                    title: "Done!",
                                    message: `We marked your attendance at the event with id ${props.eventId}! Hope you have fun!`,
                                    icon: <IconCheck size={16}/>,
                                    autoClose: 2000
                                })
                                await mutate(`${process.env.NEXT_PUBLIC_API_PATH}/student/${props.studentId}/attendance/${props.eventId}`)

                            })
                            .catch((error: AxiosError) => {
                                console.log(error)
                                // @ts-ignore
                                if (error.response.data.code == 601) {
                                    notifications.update({
                                        id: notificationId,
                                        color: "red",
                                        title: "Uh oh!",
                                        message: "Invalid attendance code!",
                                        icon: <IconX size={16}/>,
                                        autoClose: 2000
                                    })
                                } else {
                                    notifications.update({
                                        id: notificationId,
                                        color: "red",
                                        title: "Uh oh!",
                                        message: `Something went wrong. If you're a technical nerd, we printed the error in the dev console.`,
                                        icon: <IconX size={16}/>,
                                        autoClose: 2000
                                    })
                                }
                            })
                    }}>
                    <IconCheck size="1rem"/>
                </ActionIcon>
            </Group>
        )
    }
    return (
        <Button variant="light" color="blue" fullWidth mt="md" radius="md" onClick={(event) => {
            const notificationId = "attendance-" + props.eventId
            notifications.show({
                id: notificationId,
                loading: true,
                title: "Marking your attendance",
                message: "Our techno-wizard-monkeys are hard at work doing database stuffs",
                autoClose: false
            })
            const data = axios.post(`${process.env.NEXT_PUBLIC_API_PATH}/student/${props.studentId}/attendance/${props.eventId}`,
                {},
                {
                    withCredentials: true
                })
                .then((response) => {
                    notifications.show({
                        id: notificationId,
                        color: "teal",
                        title: "Done!",
                        message: `We marked your attendance at the event with id ${props.eventId}! Hope you have fun!`,
                        icon: <IconCheck size={16}/>,
                        autoClose: 2000
                    })
                    mutate(`${process.env.NEXT_PUBLIC_API_PATH}/student/${props.studentId}/attendance/${props.eventId}`)
                })
                .catch((error) => {
                    console.log(error)
                    notifications.show({
                        id: notificationId,
                        color: "red",
                        title: "Uh oh!",
                        message: `Something went wrong. If you're a technical nerd, we printed the error in the dev console.`,
                        icon: <IconX size={16}/>,
                        autoClose: 2000
                    })
                })
        }}>
            Mark my attendance
        </Button>
    )
}

function AdminStats({event}: { event: Event }) {
    const report = useSWR(`${process.env.NEXT_PUBLIC_API_PATH}/event/${event.id}/report`, polyfillFetch)
    if (report.isLoading) {
        return <LoadingOverlay visible={true}/>
    }
    return <>
        <Text weight={300}>Quick Stats </Text>
        <ul>
            <li>
                <Text>{report.data["eventAttendance"]} attendee(s)</Text>
            </li>
        </ul>
    </>
}