import React from 'react';
import {AppBar, Box, IconButton, Toolbar, Typography} from "@mui/material";
import {ArrowBackIosNew} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";

export default function PageWrapper({ children, title, back, after }: {
    title: string,
    children: React.ReactNode,
    back?: boolean,
    after?: React.ReactNode,
}) {
    const navigate = useNavigate();

    return (
        <React.Fragment>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar variant="dense">
                            {
                                back &&
                                <IconButton
                                    size="large"
                                    edge="start"
                                    color="inherit"
                                    aria-label="open drawer"
                                    sx={{ mr: 2 }}
                                    onClick={() => navigate(-1)}
                                >
                                    <ArrowBackIosNew />
                                </IconButton>
                            }
                            <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1 }}>
                                {title}
                            </Typography>
                            {after}
                    </Toolbar>
                </AppBar>
            </Box>
            {children}
        </React.Fragment>
    )
}
