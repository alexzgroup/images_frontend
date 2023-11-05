import {FC, PropsWithChildren} from "react";
import {ColorsList, TypeColors} from "../types/ColorTypes";
import {Text} from "@vkontakte/vkui";


type ColorLabelType =  {
    children?: PropsWithChildren<{}>,
    type: TypeColors,
    text?: string,
}

const ColorLabel:FC<ColorLabelType> = ({ children, type, text }) => (
    <div style={{
        display: 'flex',
        background: ColorsList[type],
        color: 'var(--vkui--color_text_contrast_themed)',
        borderRadius: 'var(--vkui--size_border_radius--regular)',
        padding: '3px var(--vkui--size_button_base_small_padding_horizontal--regular)'
    }}>
        {children}
        {
            text && <Text>{text}</Text>
        }
    </div>
)

export default ColorLabel;
