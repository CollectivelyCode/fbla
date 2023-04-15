import {AppShell} from "@mantine/core";
import React from "react";
import {NavbarMinimal} from "./Navbar";

export default function Shell(props: {
    children: React.ReactElement[] | React.ReactElement
}) {
    return (
        <AppShell
            padding={"md"}
            navbar={<NavbarMinimal/>}
        >
            {props.children}
        </AppShell>
    )
}