import React, {useContext} from 'react';

import {Div, Group, Panel, PanelHeader} from '@vkontakte/vkui';
import ModalGetVipContent from "../../components/RenestraVip/ModalGetVipContent";
import {AppContext, TAppContext} from "../../context/AppContext";

interface Props {
    id: string;
}

const ShareGetVipImagePanel: React.FC<Props> = ({id}) => {
    const {lang} = useContext<TAppContext>(AppContext);
    return (
        <Panel id={id}>
            <PanelHeader>{lang.HEADERS.SHOW_GET_VIP_IMAGE_PANEL}</PanelHeader>
            <Group>
                <Div>
                    <ModalGetVipContent pageContent={true} />
                </Div>
            </Group>
        </Panel>
    )
}

export default ShareGetVipImagePanel;
