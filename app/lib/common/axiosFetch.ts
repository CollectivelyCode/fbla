import axios from "axios";

export const axiosFetch = (url: string) => axios.get(url).then(r => r.data)