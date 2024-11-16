import React, {useContext} from 'react';
import Countdown from 'react-countdown';
import {AppContext, TAppContext} from "../context/AppContext";
import {Alert, Box, Container, Divider, Grid2, ListItem, ListItemIcon, Stack, Typography} from "@mui/material";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import {AutoFixHigh, Diversity3, Palette, PanTool} from "@mui/icons-material";
import ListItemText from "@mui/material/ListItemText";
import {common} from "@mui/material/colors";
import AlertDialogVipEnded from "./Modals/AlertDialogVipEnded";

type countDownType = {
    days: number,
    hours: number,
    minutes: number,
    seconds: number,
}

export const CounterDownTimer = ({date}: {date: string}) => {
    const [modal, setModal] = React.useState<React.ReactNode | null>(null);
    const {lang} = useContext<TAppContext>(AppContext);

    const stopTimer = () => {
        setModal(<AlertDialogVipEnded />)
    }

    const renderer = ({ days, hours, minutes, seconds }: countDownType) => {
        return (<Box className="pulseLine" sx={{background: 'var(--black_gradient)', py: 2}}>
                {modal}
                <Box>
                    <Container>
                        <Typography sx={{color: common.white, mb: 2}} textAlign="center" variant="h5" component="h2">
                            {lang.DESCRIPTIONS.VIP_BANNER_ACTIVE}
                        </Typography>
                    </Container>
                    <Container sx={{display: 'flex', justifyContent: 'center', mb: 2}}>
                        <Alert variant="outlined" severity="warning" icon={false}>
                            <Stack
                                direction="row"
                                divider={<Divider orientation="vertical" flexItem>:</Divider>}
                                spacing={0}
                                className="golden_text"
                            >
                                <Typography textAlign="center" variant="h6" component="div">{days}<br/>{lang.DESCRIPTIONS.TIME.DAYS}</Typography>
                                <Typography textAlign="center" variant="h6" component="div">{hours}<br/>{lang.DESCRIPTIONS.TIME.HOURS}</Typography>
                                <Typography textAlign="center" variant="h6" component="div">{minutes}<br/>{lang.DESCRIPTIONS.TIME.MINUTE}</Typography>
                                <Typography textAlign="center" variant="h6" component="div">{seconds}<br/>{lang.DESCRIPTIONS.TIME.SECONDS}</Typography>
                            </Stack>
                        </Alert>
                    </Container>
                    <Grid2 container>
                        <Grid2 size={12} display="flex" justifyContent="center">
                            <List dense disablePadding>
                                <ListItem>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <Palette color="warning"/>
                                        </ListItemIcon>
                                        <ListItemText sx={{color: common.white}}>{lang.DESCRIPTIONS.VIP_BLOCK_1}</ListItemText>
                                    </ListItemButton>
                                </ListItem>
                                <ListItem>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <Diversity3 color="warning"/>
                                        </ListItemIcon>
                                        <ListItemText sx={{color: common.white}}>{lang.DESCRIPTIONS.VIP_MODAL_VIP_TEXT_1}</ListItemText>
                                    </ListItemButton>
                                </ListItem>
                                <ListItem>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <AutoFixHigh color="warning"/>
                                        </ListItemIcon>
                                        <ListItemText sx={{color: common.white}}>{lang.DESCRIPTIONS.VIP_BLOCK_2}</ListItemText>
                                    </ListItemButton>
                                </ListItem>
                                <ListItem>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <PanTool color="warning"/>
                                        </ListItemIcon>
                                        <ListItemText sx={{color: common.white}}>{lang.DESCRIPTIONS.VIP_MODAL_VIP_TEXT_2}</ListItemText>
                                    </ListItemButton>
                                </ListItem>
                            </List>
                        </Grid2>
                    </Grid2>
                </Box>
            </Box>
        );
    };

    return (
        <Countdown
            onComplete={stopTimer}
            date={new Date(date)}
            renderer={renderer}
        />
    );
}
