import React from "react";
import {TypeColors} from "../types/ColorTypes";
import ColorLabel from "./ColorLabel";

export const LabelImageTypeGenerator = (labels: string[]|[]): JSX.Element => {

    const getLabelJSX = (label: string) => {
        switch (label) {
            case 'popular':
                return <ColorLabel type={TypeColors.success} text='Популярно'/>
            case 'new':
                return <ColorLabel type={TypeColors.error} text='Новое'/>
            case 'vip':
                return <ColorLabel type={TypeColors.warning} text='Vip'/>
            default:
                return <React.Fragment />
        }
    }

    return (
        <React.Fragment>
            {
                !!labels.length && labels.map((item, key) => getLabelJSX(item))
            }
        </React.Fragment>
    )
}
