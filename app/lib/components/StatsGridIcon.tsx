import {createStyles, Group, Paper, SimpleGrid, Text, ThemeIcon} from '@mantine/core';
import {IconArrowDownRight, IconArrowUpRight, IconArrowWaveRightUp} from '@tabler/icons';

const useStyles = createStyles((theme) => ({
    root: {
        padding: `calc(${theme.spacing.xl} * 1.5)`,
    },

    label: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    },
}));

interface StatsGridIconsProps {
    data: { title: string; value: string; difference: number }[];
    period: string
}

export function StatsGridIcons({data, period}: StatsGridIconsProps) {
    const {classes} = useStyles();
    const stats = data.map((stat) => {
        const DiffIcon = stat.difference == 0 ? IconArrowWaveRightUp : (stat.difference > 0 ? IconArrowUpRight : IconArrowDownRight);

        return (
            <Paper withBorder p="md" radius="md" key={stat.title}>
                <Group position="apart">
                    <div>
                        <Text c="dimmed" tt="uppercase" fw={700} fz="xs" className={classes.label}>
                            {stat.title}
                        </Text>
                        <Text fw={700} fz="xl">
                            {stat.value}
                        </Text>
                    </div>
                    <ThemeIcon
                        color="gray"
                        variant="light"
                        sx={(theme) => ({color: stat.difference == 0 ? theme.colors.gray[6] : (stat.difference > 0 ? theme.colors.teal[6] : theme.colors.red[6])})}
                        size={38}
                        radius="md"
                    >
                        <DiffIcon size="1.8rem" stroke={1.5}/>
                    </ThemeIcon>
                </Group>
                <Text c="dimmed" fz="sm" mt="md">
                    <Text component="span" c={stat.difference == 0 ? "white" : (stat.difference > 0 ? 'teal' : 'red')}
                          fw={700}>
                        {Math.abs(stat.difference)}%
                    </Text>{' '}
                    {stat.difference == 0 ? ", no difference" : (stat.difference > 0 ? 'increase' : 'decrease')} compared
                    to last {period}
                </Text>
            </Paper>
        );
    });

    return (
        <div className={classes.root}>
            <SimpleGrid cols={3} breakpoints={[{maxWidth: 'sm', cols: 1}]}>
                {stats}
            </SimpleGrid>
        </div>
    );
}