import React from "react";
import {Paid} from "@mui/icons-material";
import {Typography} from "@mui/material";

export const LabelImageTypeGenerator = (labels: string[]|[]): JSX.Element => {

    const getLabelJSX = (label: string) => {
        switch (label) {
            case 'popular':
                return <Typography key={1} sx={(theme) => ({
                    color: theme.palette.common.white,
                    bgcolor: theme.palette.primary.dark,
                    display: 'inline-block',
                    px: 0.5,
                    borderRadius: 1,
                })}
                    variant="caption"
                    component="div">Top</Typography>
            case 'new':
                return <Typography key={2} sx={(theme) => ({
                    color: theme.palette.common.white,
                    bgcolor: theme.palette.secondary.dark,
                    display: 'inline-block',
                    px: 0.5,
                    borderRadius: 1,
                })}
                   variant="caption"
                   component="div">New</Typography>
            case 'vip':
                return <Paid key={3} color="warning" />
            default:
                return <React.Fragment />
        }
    }

    return (
        <React.Fragment>
            {
                !!labels?.length && labels.map((item, key) => getLabelJSX(item))
            }
        </React.Fragment>
    )
}
