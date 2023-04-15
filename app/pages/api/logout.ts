import {NextApiRequest, NextApiResponse} from "next";
import {deleteCookie} from "cookies-next";

export default function Logout(req: NextApiRequest, res: NextApiResponse) {
    deleteCookie("auth_token", {req, res, path: '/'})
    res.status(200).end()
}