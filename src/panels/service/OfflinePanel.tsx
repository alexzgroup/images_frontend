import React, {useContext} from 'react';

import {Button, Panel, Placeholder} from '@vkontakte/vkui';
import {Icon56DoNotDisturbOutline} from "@vkontakte/icons";
import {AppContext, TAppContext} from "../../context/AppContext";

interface Props {
    id: string;
}

const OfflinePanel: React.FC<Props> = ({id}) => {
    const {lang} = useContext<TAppContext>(AppContext);

    return (<Panel id={id}>
                <Placeholder
                    stretched
                    icon={<Icon56DoNotDisturbOutline/>}
                    header={lang.HEADERS.OFFLINE_PANEL}
                    action={<Button size="l">{lang.BUTTONS.OFFLINE_PANEL_REPEAT}</Button>}
                >
                    {lang.DESCRIPTIONS.OFFLINE_PANEL}
                </Placeholder>
        </Panel>
    )
}


export default OfflinePanel;
