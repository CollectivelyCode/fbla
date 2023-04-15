import {useForm, zodResolver} from "@mantine/form";
import {Box, Button, Group, PasswordInput, TextInput} from "@mantine/core";
import axios, {AxiosError} from "axios";
import {z} from "zod";
import useSWR, {mutate} from "swr";
import {useState} from "react";
import {GetServerSidePropsContext} from "next";
import {useRouter} from "next/router";
import {notifications} from "@mantine/notifications";

const loginFormSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string()
})
export default function Login(props: { redirectPath: string }) {
    const loginForm = useForm({
        validateInputOnChange: true,
        validate: zodResolver(loginFormSchema),
        initialValues: {
            username: "",
            password: ""
        }
    })
    const [loading, setState] = useState()
    const router = useRouter()
    const user = useSWR(`${process.env.NEXT_PUBLIC_API_PATH}/auth/profile`)
    return (
        <Box sx={{maxWidth: 300}} mx="auto">
            <form onSubmit={loginForm.onSubmit(values => {
                axios.post(`/api/login`, values).then(async (response) => {
                    if (response.status == 200) {
                        await mutate(`${process.env.NEXT_PUBLIC_API_PATH}/auth/profile`)
                        router.push(`${process.env.NEXT_PUBLIC_APP_PATH}${props?.redirectPath ? props.redirectPath : "/"}`)
                    }
                }).catch((error: AxiosError) => {
                    // @ts-ignore
                    if (error.response?.data["errorCode"] == 6010) {
                        notifications.show({
                            title: "Username or Password Invalid",
                            message: "Double check your username and password",
                            color: "red",
                            autoClose: 3000
                        })
                    } else {
                        notifications.show({
                            title: "Something went wrong",
                            message: "An error occurred",
                            color: "red",
                            autoClose: 3000
                        })
                    }

                })
            })}>
                <TextInput label={"Username"} {...loginForm.getInputProps("username")} />
                <PasswordInput label={"Password"} {...loginForm.getInputProps("password")} />
                <Group position={"center"} mt={"md"}>
                    <Button type={"submit"}>Submit</Button>
                </Group>
            </form>
        </Box>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    return {
        props: {
            redirectPath: context.query["redirect"] || null
        }
    }
}