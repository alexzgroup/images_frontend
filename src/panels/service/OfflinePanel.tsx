import React from 'react';

import {Button, Panel, Placeholder} from '@vkontakte/vkui';
import {Icon56DoNotDisturbOutline} from "@vkontakte/icons";

interface Props {
    id: string;
}

const OfflinePanel: React.FC<Props> = ({id}) => {

    return (<Panel id={id}>
                <Placeholder
                    stretched
                    icon={<Icon56DoNotDisturbOutline/>}
                    header="Произошла ошибка!"
                    action={<Button size="l">Повторить</Button>}
                >
                    Проверьте Ваше соединение с интернетом.
                </Placeholder>
        </Panel>
    )
}


export default OfflinePanel;
