export const polyfillFetch = (url: string) => fetch(url, {
    credentials: "include"
}).then(r => r.json())