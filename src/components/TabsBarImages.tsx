import * as React from 'react';
import {useContext} from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import {TabContext, TabPanel} from '@mui/lab';
import {exclusiveImageTypesType} from "../types/ApiTypes";
import {Button, CardActions, CardContent, CardMedia, Typography} from "@mui/material";
import {AppContext, TAppContext} from "../context/AppContext";
import {useNavigate} from "react-router-dom";

type TImageType = exclusiveImageTypesType & {
     description?: string
}

export default function TabsBarImages({images}: {images: TImageType[]}) {
    const [value, setValue] = React.useState(0);
    const {lang} = useContext<TAppContext>(AppContext);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    const navigate = useNavigate();

    return (
        <Box sx={{ bgcolor: 'background.paper' }}>
            <TabContext value={value}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons={false}
                    aria-label="scrollable force tabs example"
                >
                    {
                        images.map((image) => (
                            <Tab label={image.name} />
                        ))
                    }
                </Tabs>
                {
                    images.map((item, index) => (
                        <TabPanel sx={{px: 0}} value={index}>
                            <Box  sx={{ minWidth: 280 }}>
                                <CardMedia
                                    sx={{ height: 140 }}
                                    image={item.url}
                                    title={item.name}
                                />
                                {
                                    item.description &&
                                        <CardContent>
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                {item.description}
                                            </Typography>
                                        </CardContent>
                                }
                                <CardActions>
                                    <Button onClick={() => navigate(`/select-image/${item.id}`)} variant="contained">
                                        {lang.BUTTONS.OPEN}
                                    </Button>
                                </CardActions>
                            </Box>
                        </TabPanel>
                    ))
                }
            </TabContext>
        </Box>
    );
}
