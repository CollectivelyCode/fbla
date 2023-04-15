import {Card, Divider, Grid, Group, LoadingOverlay, Title} from "@mantine/core";
import Shell from "../lib/components/Shell";
import CurrentEvents from "../lib/components/CurrentEvents";
import useProfile from "../lib/middleware/useProfile";

export default function Index() {
    const profile = useProfile()
    if (profile.isLoading || !profile.user) {
        return <LoadingOverlay visible={true}/>
    }
    return (
        <Shell>
            <Grid>
                <Grid.Col span={"auto"}>
                    <Card shadow={"sm"} withBorder>
                        <Group>
                            <Title order={1}>
                                Current Events
                            </Title>
                        </Group>
                        <Divider my={"sm"}/>
                        <CurrentEvents/>
                    </Card>
                </Grid.Col>
                {profile.user.roles == "student" ? <Grid.Col span={"auto"}>
                    <Card shadow={"sm"} withBorder>
                        <Group>
                            <Title order={1}>
                                My Stats
                            </Title>
                        </Group>
                        <Divider my={"sm"}/>
                        <ul>
                            <li>
                                Points: {profile.user.student.points}
                            </li>
                        </ul>
                    </Card>
                </Grid.Col> : <></>}

            </Grid>
        </Shell>
    )
}