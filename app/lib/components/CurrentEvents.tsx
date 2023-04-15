import useCurrentEvents from "../middleware/useCurrentEvents";
import EventCard from "./EventCard";
import {Grid} from "@mantine/core";

export default function CurrentEvents() {
    const {isLoading, isError, events} = useCurrentEvents()
    if (isLoading) {
        return <h1>Loading</h1>
    }
    return (
        <>
            <Grid>
                {
                    // @ts-ignore
                    events.map((event) => {
                        return <Grid.Col key={event.id}>
                            <EventCard id={event.id}/>
                        </Grid.Col>
                    })}
            </Grid>
        </>
    )
}