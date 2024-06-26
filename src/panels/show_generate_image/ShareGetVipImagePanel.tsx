import React from 'react';

import {Div, Group, Panel, PanelHeader} from '@vkontakte/vkui';
import ModalGetVipContent from "../../components/RenestraVip/ModalGetVipContent";

interface Props {
    id: string;
}

const ShareGetVipImagePanel: React.FC<Props> = ({id}) => {
    return (
        <Panel id={id}>
            <PanelHeader>Результат</PanelHeader>
            <Group>
                <Div>
                    <ModalGetVipContent pageContent={true} />
                </Div>
            </Group>
        </Panel>
    )
}

export default ShareGetVipImagePanel;
