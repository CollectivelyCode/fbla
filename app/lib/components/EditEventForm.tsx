import {Event, eventSchema, EventType} from "../../types/Event";
import {useForm, zodResolver} from "@mantine/form";
import dayjs from "dayjs";
import {notifications} from "@mantine/notifications";
import axios from "axios";
import {IconCheck} from "@tabler/icons";
import {mutate} from "swr";
import {modals} from "@mantine/modals";
import {Button, NumberInput, Select, TextInput} from "@mantine/core";
import {DateTimePicker} from "@mantine/dates";
import React from "react";

export default function EditEventForm(props: { event: Event }) {
    const {event} = props;
    const form = useForm({
        initialValues: {
            startDate: dayjs(event.startDate).toDate(),
            endDate: dayjs(event.endDate).toDate(),
            name: event.name,
            eventType: event.eventType,
            description: event.description,
            points: event.points
        },
        validate: zodResolver(eventSchema)
    })
    return (
        <form onSubmit={form.onSubmit((values) => {
            notifications.show({
                id: `edit-event-${event.id}`,
                title: "Saving your changes",
                message: "",
                loading: true
            })
            axios.patch(`${process.env.NEXT_PUBLIC_API_PATH}/event/${event.id}`, values, {
                withCredentials: true
            }).then(async () => {
                notifications.update({
                    id: `edit-event-${event.id}`,
                    title: "Done!",
                    message: "We saved your changes!",
                    color: "teal",
                    icon: <IconCheck size={16}/>,
                    autoClose: 2000
                })
                await mutate(`${process.env.NEXT_PUBLIC_API_PATH}/event/`)
                await mutate(`${process.env.NEXT_PUBLIC_API_PATH}/event/${event.id}`)
                modals.closeAll()
            }).catch(() => {

            })
        })}>
            <TextInput label={"Name"} {...form.getInputProps("name")} />
            <TextInput label={"Description"} {...form.getInputProps("description")} />
            <DateTimePicker label={"Start Date"} {...form.getInputProps("startDate")} />
            <DateTimePicker label={"End Date"} {...form.getInputProps("endDate")} />
            <NumberInput hideControls label={"Attendance Code"}{...form.getInputProps("attendanceCode")} />
            <NumberInput label={"Points"} {...form.getInputProps("points")} />
            <Select label={"Event Type"}
                    data={Object.getOwnPropertyNames(EventType)} {...form.getInputProps("eventType")} />
            <Button type={"submit"} mt={"md"}>
                Save
            </Button>
        </form>
    )
}