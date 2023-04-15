declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NEXT_PUBLIC_API_PATH: string
            NEXT_PUBLIC_APP_PATH: string
        }
    }
}
export {};