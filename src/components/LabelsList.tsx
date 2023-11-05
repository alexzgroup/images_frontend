import {ColorsList, TypeColors} from "../types/ColorTypes";
import React, {FC} from "react";
import {Div, Group, Header} from "@vkontakte/vkui";
import ColorLabel from "./ColorLabel";

type LabelsListType = {
    type: TypeColors,
    labels: string[],
    header: string,
}

const LabelsList:FC<LabelsListType> = ({type, labels, header}) => (
    <Group header={<Header><div style={{color: ColorsList[type]}}>{header}</div></Header>}>
        <Div>
            <div style={{
                display: 'flex',
                gap: 10,
                rowGap: 10,
                flexWrap: 'wrap',
            }}>
                {
                    labels.map((value, key) => <ColorLabel key={key} type={type} text={value} />)
                }
            </div>
        </Div>
    </Group>
)

export default LabelsList;
