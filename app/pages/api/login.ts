import {NextApiRequest, NextApiResponse} from "next";
import axios, {AxiosError} from "axios";
import {setCookie} from "cookies-next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!req.body.username || !req.body.password) {
        return res.status(400).send({
            error: "Bad request"
        })
    }
    try {
        const loginData = await axios.post(`${process.env.NEXT_PUBLIC_API_PATH}/auth/login`, req.body)
        if (loginData.status == 200) {
            setCookie("auth_token", loginData.data["auth_token"], {req, res, path: '/'})
            res.status(200).end()
            return
        }
    }
        // @ts-ignore
    catch (error: AxiosError) {
        if (error.response.status == 401) {
            res.send({
                "errorCode": 6010,
                "message": "Invalid username or password"
            })
        }
        res.status(error.response.status || 400).end()
    }
}