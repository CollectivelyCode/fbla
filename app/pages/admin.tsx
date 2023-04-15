import Shell from "../lib/components/Shell";
import {ActionIcon, Card, Grid, Group, Title} from "@mantine/core";
import {EventTable} from "../lib/components/EventTable";
import {IconPlus} from "@tabler/icons";
import {StudentTable} from "../lib/components/StudentTable";
import {modals} from "@mantine/modals";
import CreateEventForm from "../lib/components/CreateEventForm";
import {PrizeTable} from "../lib/components/PrizeTable";
import CreatePrizeForm from "../lib/components/CreatePrizeForm";
import PrizeFulfillmentTable from "../lib/components/PrizeFulfillmentTable";

export default function Admin() {
    return (
        <Shell>
            <Grid>
                <Grid.Col span={"auto"}>
                    <Card shadow={"sm"} withBorder>
                        <Group>
                            <Title order={1}>
                                Events
                            </Title>
                            <ActionIcon onClick={() => {
                                modals.open({
                                    title: "Create Event",
                                    children: (
                                        <CreateEventForm/>
                                    )
                                })
                            }} variant={"filled"}>
                                <IconPlus/>
                            </ActionIcon>
                        </Group>
                        <EventTable/>
                    </Card>
                </Grid.Col>
                <Grid.Col span={"auto"}>
                    <Card shadow={"sm"} withBorder>
                        <Group>
                            <Title order={1}>
                                Students
                            </Title>
                        </Group>
                        <StudentTable/>
                    </Card>
                </Grid.Col>
                <Grid.Col span={"auto"}>
                    <Card shadow={"sm"} withBorder>
                        <Group>
                            <Title order={1}>
                                Prizes
                            </Title>
                            <ActionIcon onClick={() => {
                                modals.open({
                                    title: "Create Prize",
                                    children: (
                                        <CreatePrizeForm/>
                                    )
                                })
                            }} variant={"filled"}>
                                <IconPlus/>
                            </ActionIcon>
                        </Group>
                        <PrizeTable/>
                    </Card>
                </Grid.Col>
                <Grid.Col span={"auto"}>
                    <Card shadow={"sm"} withBorder>
                        <Group>
                            <Title order={1}>
                                Prize Redemption
                            </Title>
                        </Group>
                        <PrizeFulfillmentTable/>
                    </Card>
                </Grid.Col>
            </Grid>
        </Shell>
    )
}