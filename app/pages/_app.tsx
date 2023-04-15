import {AppProps} from 'next/app';
import Head from 'next/head';
import {LoadingOverlay, MantineProvider} from '@mantine/core';
import {Notifications} from "@mantine/notifications";
import {ModalsProvider} from "@mantine/modals";
import useProfile from "../lib/middleware/useProfile";
import {useRouter} from "next/router";
import {NextShield} from "next-shield";

export default function App(props: AppProps) {
    const {Component, pageProps} = props;
    const profile = useProfile()
    const router = useRouter()
    console.log(profile)
    const shieldConfig = {
        router: router,
        // @ts-ignore
        isAuth: (profile.user && !profile.isError && !profile.isLoading && !profile.user["statusCode"]),
        isLoading: profile.isLoading,
        LoadingComponent: <LoadingOverlay visible={true}/>,
        privateRoutes: ['/',
            '/prizes',
            "/reports",
            "/admin",
            "/prizeDrawing",
            "/prizeFulfillment"
        ],
        publicRoutes: ['/auth/login'],
        loginRoute: '/auth/login',
        RBAC: {
            admin: {
                grantedRoutes: ["", '/', '/prizes', "/reports", "/admin", "/prizeDrawing"],
                accessRoute: '/admin',
            },
            student: {
                grantedRoutes: ["", '/', '/prizes', "/prizeRedemptions"],
                accessRoute: '/',
            },
        },
        userRole: (profile.user?.roles != undefined ? profile.user.roles : undefined),
    }
    return (
        <>
            <Head>
                <title>Rapid Attend</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width"/>
            </Head>
            <NextShield {...shieldConfig}>
                <MantineProvider
                    withGlobalStyles
                    withNormalizeCSS
                    theme={{
                        colorScheme: 'dark',
                    }}
                >
                    <ModalsProvider>
                        <Notifications/>
                        <Component {...pageProps} />
                    </ModalsProvider>
                </MantineProvider>
            </NextShield>
        </>
    );
}