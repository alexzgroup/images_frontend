import {Backdrop, CircularProgress} from "@mui/material";
import React from "react";

export default function PagePreloader() {
    return (
        <Backdrop
            sx={(theme) => ({
                color: '#fff',
                zIndex: theme.zIndex.drawer + 1,
                bgcolor: theme.palette.grey[900],
            })}
            open={true}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    )
}
