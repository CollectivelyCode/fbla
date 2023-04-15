import {useForm, zodResolver} from "@mantine/form";
import {notifications} from "@mantine/notifications";
import axios from "axios";
import {IconCheck} from "@tabler/icons";
import {mutate} from "swr";
import {modals} from "@mantine/modals";
import {Button, Checkbox, NumberInput, TextInput} from "@mantine/core";
import React, {useState} from "react";
import {useId} from "@mantine/hooks";
import {PrizeSchema} from "../../types/Prize";

export default function CreatePrizeForm() {
    const form = useForm({
        initialValues: {
            selfRedeemable: false
        },
        validate: zodResolver(PrizeSchema)
    })
    const [selfRedeem, setSelfRedeem] = useState(false)
    const id = useId()
    return (
        <form onSubmit={form.onSubmit((values) => {
            notifications.show({
                id: `create-prize-${id}`,
                title: "Saving your changes",
                message: "",
                loading: true
            })
            axios.post(`${process.env.NEXT_PUBLIC_API_PATH}/prize/`, values, {
                withCredentials: true
            }).then(async () => {
                notifications.update({
                    id: `create-prize-${id}`,
                    title: "Done!",
                    message: "We saved your changes!",
                    color: "teal",
                    icon: <IconCheck size={16}/>,
                    autoClose: 2000
                })
                await mutate(`${process.env.NEXT_PUBLIC_API_PATH}/prize/`)
                modals.closeAll()
            }).catch(() => {

            })
        })}>
            <TextInput withAsterisk label={"Name"} {...form.getInputProps("name")} />
            <Checkbox label={"Allow student to self-redeem?"} {...form.getInputProps("selfRedeemable")}/>
            <NumberInput withAsterisk label={"Points"} {...form.getInputProps("pointsRequired")} />
            <NumberInput withAsterisk label={"Stock"} {...form.getInputProps("stock")} />
            <Button type={"submit"} mt={"md"}>
                Save
            </Button>
        </form>)
}