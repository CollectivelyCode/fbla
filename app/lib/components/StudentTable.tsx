import {
    ActionIcon,
    Button,
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
import useStudents from "../middleware/useStudents";
import {Student, StudentSchema} from "../../types/Student";

export function StudentTable() {
    const {students, isLoading, isError} = useStudents()
    if (!students || isLoading) {
        return <LoadingOverlay visible={true}/>
    }
    dayjs.extend(timezone)
    dayjs.extend(utc)
    const rows = students.map((item) => (
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
                <Text fz="sm">{item.grade}</Text>
                <Text fz="xs" c="dimmed">
                    Grade
                </Text>
            </td>
            <td>
                <Text fz="sm">{item.points}</Text>
                <Text fz="xs" c="dimmed">
                    Points
                </Text>
            </td>
            <td>
                <Group spacing={0} position="right">
                    <OpenEditStudentModal student={item}/>
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
                                    title: "Delete this student?!?",
                                    children: (
                                        <Text size={"sm"}>
                                            Are you sure you want to delete this student?
                                        </Text>
                                    ),
                                    labels: {confirm: 'Delete student', cancel: "No! I want to go back!"},
                                    confirmProps: {color: 'red'},
                                    onConfirm: () => axios.delete(`${process.env.NEXT_PUBLIC_API_PATH}/student/${item.id}`),
                                })
                            }} icon={<IconTrash size="1rem" stroke={1.5}/>} color="red">
                                Delete Student
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

function OpenEditStudentModal(props: { student: Student }) {
    const {student} = props;
    return (
        <ActionIcon onClick={() => {
            modals.open({
                title: `Edit ${student.name}`,
                children: (
                    <EditStudentForm student={student}/>
                )
            })
        }}>
            <IconPencil size={"1rem"} stroke={1.5}/>
        </ActionIcon>
    )
}

function EditStudentForm(props: { student: Student }) {
    const {student} = props;
    const form = useForm({
        initialValues: {
            name: student.name,
            points: student.points,
            grade: student.grade
        },
        validate: zodResolver(StudentSchema)
    })
    return (
        <form onSubmit={form.onSubmit((values) => {
            notifications.show({
                id: `edit-student-${student.id}`,
                title: "Saving your changes",
                message: "",
                loading: true
            })
            axios.patch(`${process.env.NEXT_PUBLIC_API_PATH}/student/${student.id}`, values).then(async () => {
                notifications.update({
                    id: `edit-student-${student.id}`,
                    title: "Done!",
                    message: "We saved your changes!",
                    color: "teal",
                    icon: <IconCheck size={16}/>,
                    autoClose: 2000
                })
                await mutate(`${process.env.NEXT_PUBLIC_API_PATH}/student/`)
                await mutate(`${process.env.NEXT_PUBLIC_API_PATH}/student/${student.id}`)
                modals.closeAll()
            }).catch(() => {

            })
        })}>
            <TextInput label={"Name"} {...form.getInputProps("name")} />
            <NumberInput label={"Grade"} {...form.getInputProps("grade")} />
            <NumberInput label={"Points"} {...form.getInputProps("points")} />
            <Button type={"submit"} mt={"md"}>
                Save
            </Button>
        </form>
    )
}
