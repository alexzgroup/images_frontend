import React from "react";
import {TypeColors} from "../types/ColorTypes";
import ColorLabel from "./ColorLabel";

export const LabelImageTypeGenerator = (labels: string[]|[]): JSX.Element => {

    const getLabelJSX = (label: string) => {
        switch (label) {
            case 'popular':
                return <ColorLabel key={1} type={TypeColors.success} text='Популярно'/>
            case 'new':
                return <ColorLabel key={2} type={TypeColors.error} text='Новое'/>
            case 'vip':
                return <ColorLabel key={3} type={TypeColors.warning} text='Vip'/>
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
