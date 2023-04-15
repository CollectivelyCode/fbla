import {
    ActionIcon,
    Button,
    Checkbox,
    Group,
    LoadingOverlay,
    Menu,
    NumberInput,
    ScrollArea,
    Table,
    Text,
    TextInput
} from '@mantine/core';
import {IconCheck, IconDots, IconPencil, IconTrash,} from '@tabler/icons';
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import {modals} from "@mantine/modals";
import {useForm, zodResolver} from "@mantine/form";
import axios from "axios";
import {notifications} from "@mantine/notifications";
import React from "react";
import {mutate} from "swr";
import usePrizes from "../middleware/usePrizes";
import {Prize, PrizeSchema} from "../../types/Prize";

export function PrizeTable() {
    const {prizes, isLoading} = usePrizes()
    if (!prizes || isLoading) {
        return <LoadingOverlay visible={true}/>
    }
    dayjs.extend(timezone)
    dayjs.extend(utc)
    const rows = prizes.map((item) => (
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
                <Text fz="sm">{`${item.selfRedeemable}`}</Text>
                <Text fz="xs" c="dimmed">
                    Self Redeemable
                </Text>
            </td>
            <td>
                <Text fz="sm">{item.pointsRequired}</Text>
                <Text fz="xs" c="dimmed">
                    Points Required
                </Text>
            </td>
            <td>
                <Text fz="sm">{item.stock}</Text>
                <Text fz="xs" c="dimmed">
                    Stock
                </Text>
            </td>
            <td>
                <Group spacing={0} position="right">
                    <OpenEditPrizeModal prize={item}/>
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
                                    title: "Delete this prize?!?",
                                    children: (
                                        <Text size={"sm"}>
                                            Are you sure you want to delete this prize?
                                        </Text>
                                    ),
                                    labels: {confirm: 'Delete prize', cancel: "No! I want to go back!"},
                                    confirmProps: {color: 'red'},
                                    onConfirm: () => axios.delete(`${process.env.NEXT_PUBLIC_API_PATH}/prize/${item.id}`).then(async () => {
                                        await mutate(`${process.env.NEXT_PUBLIC_API_PATH}/prize/`)
                                    }),
                                })
                            }} icon={<IconTrash size="1rem" stroke={1.5}/>} color="red">
                                Delete Prize
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

function OpenEditPrizeModal(props: { prize: Prize }) {
    const {prize} = props;
    return (
        <ActionIcon onClick={() => {
            modals.open({
                title: `Edit ${prize.name}`,
                children: (
                    <EditPrizeForm prize={prize}/>
                )
            })
        }}>
            <IconPencil size={"1rem"} stroke={1.5}/>
        </ActionIcon>
    )
}

function EditPrizeForm(props: { prize: Prize }) {
    const {prize} = props;
    const form = useForm({
        initialValues: {
            name: prize.name,
            selfRedeemable: prize.selfRedeemable,
            stock: prize.stock,
            pointsRequired: prize.pointsRequired
        },
        validate: zodResolver(PrizeSchema)
    })
    return (
        <form onSubmit={form.onSubmit((values) => {
            notifications.show({
                id: `edit-prize-${prize.id}`,
                title: "Saving your changes",
                message: "",
                loading: true
            })
            axios.patch(`${process.env.NEXT_PUBLIC_API_PATH}/prize/${prize.id}`, values, {
                withCredentials: true
            }).then(async () => {
                notifications.update({
                    id: `edit-prize-${prize.id}`,
                    title: "Done!",
                    message: "We saved your changes!",
                    color: "teal",
                    icon: <IconCheck size={16}/>,
                    autoClose: 2000
                })
                await mutate(`${process.env.NEXT_PUBLIC_API_PATH}/prize/`)
                await mutate(`${process.env.NEXT_PUBLIC_API_PATH}/prize/${prize.id}`)
                modals.closeAll()
            }).catch(() => {

            })
        })}>
            <TextInput label={"Name"} {...form.getInputProps("name")} />
            <Checkbox label={"Self Redeemable"} {...form.getInputProps("selfRedeemable")} />
            <NumberInput label={"Points Required"} {...form.getInputProps("pointsRequired")} />
            <NumberInput label={"Stock"} {...form.getInputProps("stock")} />
            <Button type={"submit"} mt={"md"}>
                Save
            </Button>
        </form>
    )
}
