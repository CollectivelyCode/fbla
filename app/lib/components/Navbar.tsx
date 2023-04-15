import React from "react";
import {Center, createStyles, LoadingOverlay, Navbar, rem, Stack, Tooltip, UnstyledButton} from "@mantine/core";
import {
    IconCubeSend,
    IconGift,
    IconHome2,
    IconLogout,
    IconReportAnalytics,
    IconTool,
    IconTrophy,
    TablerIcon,
} from "@tabler/icons";
import useProfile from "../middleware/useProfile";
import {useRouter} from "next/router";
import axios from "axios";
import {mutate} from "swr";

const useStyles = createStyles((theme) => ({
    link: {
        width: rem(50),
        height: rem(50),
        borderRadius: theme.radius.md,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[7],

        "&:hover": {
            backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[0],
        },
    },

    active: {
        "&, &:hover": {
            backgroundColor: theme.fn.variant({variant: "light", color: theme.primaryColor}).background,
            color: theme.fn.variant({variant: "light", color: theme.primaryColor}).color,
        },
    },
}));

interface NavbarLinkProps {
    icon: React.FC<any>;
    label: string;
    active?: boolean;

    onClick?(): void;
}

function NavbarLink({icon: Icon, label, active, onClick}: NavbarLinkProps) {
    const {classes, cx} = useStyles();
    return (
        <Tooltip label={label} position="right">
            <UnstyledButton onClick={onClick} className={cx(classes.link, {[classes.active]: active})}>
                <Icon size="1.2rem" stroke={1.5}/>
            </UnstyledButton>
        </Tooltip>
    );
}

interface NavItem {
    icon: TablerIcon
    label: string
    path: string
    role?: string
}

const navData: NavItem[] = [
    {icon: IconHome2, label: "Home", path: "/"},
    {icon: IconGift, label: "Prizes", path: "/prizes", role: "student"},
    {icon: IconReportAnalytics, label: "Reporting", path: "/reports", role: "admin"},
    {icon: IconTrophy, label: "Prize Drawing", path: "/prizeDrawing", role: "admin"},
    {icon: IconCubeSend, label: "My Prize Redemptions", path: "/prizeRedemptions", role: "student"},
    {icon: IconTool, label: "Admin", path: "/admin", role: "admin"},
];

export function NavbarMinimal() {
    const {isLoading, isError, user} = useProfile()
    const router = useRouter()
    if (isLoading) {
        return <LoadingOverlay visible={isLoading}/>
    }
    const links = navData.map((item, index) => {
        if (item.role && user.roles != item.role) {
            return
        }
        return (<NavbarLink
            icon={item.icon}
            label={item.label}
            key={index}
            active={
                router.pathname == item.path
            }
            onClick={() => {
                router.push(item.path)
            }}
        />)
    });

    return (
        <Navbar height={750} width={{base: 80}} p="md">
            <Center>

            </Center>
            <Navbar.Section grow mt={50}>
                <Stack justify="center" spacing={0}>
                    {links}
                </Stack>
            </Navbar.Section>
            <Navbar.Section>
                <Stack justify="center" spacing={0}>
                    <NavbarLink icon={IconLogout} onClick={async () => {
                        await axios.post("/api/logout")
                        await mutate(`${process.env.NEXT_PUBLIC_API_PATH}/auth/profile`)
                        router.push("/auth/login")
                    }} label="Logout"/>
                </Stack>
            </Navbar.Section>
        </Navbar>
    );
}