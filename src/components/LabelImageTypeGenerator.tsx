import React from "react";
import {FiberNew, Paid} from "@mui/icons-material";
import {Typography} from "@mui/material";

export const LabelImageTypeGenerator = (labels: string[]|[]): JSX.Element => {

    const getLabelJSX = (label: string) => {
        switch (label) {
            case 'popular':
                return <Typography sx={(theme) => ({
                    color: theme.palette.common.white,
                    bgcolor: theme.palette.primary.dark,
                    display: 'inline-block',
                    px: 0.5,
                    borderRadius: 1,
                })}
                    variant="caption"
                    component="div">Top</Typography>
            case 'new':
                return <FiberNew color="secondary" />
            case 'vip':
                return <Paid color="warning" />
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
