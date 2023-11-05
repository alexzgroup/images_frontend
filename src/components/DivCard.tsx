import {FC, PropsWithChildren} from "react";

const DivCard:FC = ({ children }: PropsWithChildren<{}>) => (
    <div style={{
        background: 'var(--vkui--color_background_content)',
        borderRadius: 'var(--vkui--size_border_radius_paper--regular)',
    }}>
        {children}
    </div>
)

export default DivCard;
