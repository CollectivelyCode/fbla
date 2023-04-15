import {useForm, zodResolver} from "@mantine/form";
import {eventSchema, EventType} from "../../types/Event";
import {notifications} from "@mantine/notifications";
import axios from "axios";
import {IconCheck} from "@tabler/icons";
import {mutate} from "swr";
import {modals} from "@mantine/modals";
import {Button, Checkbox, NumberInput, Select, TextInput} from "@mantine/core";
import {DateTimePicker} from "@mantine/dates";
import React from "react";
import {useId} from "@mantine/hooks";

export default function CreateEventForm() {
    const form = useForm({
        initialValues: {
            attendanceCodeRequired: false
        },
        validate: zodResolver(eventSchema)
    })
    const id = useId()
    return (
        <form onSubmit={form.onSubmit((values) => {
            notifications.show({
                id: `create-event-${id}`,
                title: "Saving your changes",
                message: "",
                loading: true
            })
            axios.post(`${process.env.NEXT_PUBLIC_API_PATH}/event/`, values, {
                withCredentials: true
            }).then(async () => {
                notifications.update({
                    id: `create-event-${id}`,
                    title: "Done!",
                    message: "We saved your changes!",
                    color: "teal",
                    icon: <IconCheck size={16}/>,
                    autoClose: 2000
                })
                await mutate(`${process.env.NEXT_PUBLIC_API_PATH}/event/`)
                modals.closeAll()
            }).catch(() => {

            })
        })}>
            <TextInput withAsterisk label={"Name"} {...form.getInputProps("name")} />
            <TextInput withAsterisk label={"Description"} {...form.getInputProps("description")} />
            <DateTimePicker withAsterisk label={"Start Date"} {...form.getInputProps("startDate")} />
            <DateTimePicker withAsterisk label={"End Date"} {...form.getInputProps("endDate")} />
            <Checkbox label={"Require Attendance Code"} {...form.getInputProps("attendanceCodeRequired")} />
            <NumberInput withAsterisk label={"Points"} {...form.getInputProps("points")} />
            <Select withAsterisk label={"Event Type"}
                    data={Object.getOwnPropertyNames(EventType)} {...form.getInputProps("eventType")} />
            <Button type={"submit"} mt={"md"}>
                Save
            </Button>
        </form>)
}