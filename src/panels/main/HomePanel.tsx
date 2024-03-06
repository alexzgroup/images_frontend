import React from 'react';

import {Button, Div, Group, Image, Panel, Placeholder, Separator, SimpleCell} from '@vkontakte/vkui';
import girl_image from '../../assets/images/icons/girl_icon.png';
import {Icon28DiamondOutline} from "@vkontakte/icons";
import DivCard from "../../components/DivCard";
import {imageType} from "../../types/ApiTypes";
import {IconImageTypeGenerator} from "../../components/IconImageTypeGenerator";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {useSelector} from "react-redux";
import {RootStateType} from "../../redux/store/ConfigureStore";
import {ReduxSliceUserInterface} from "../../redux/slice/UserSlice";
import {ModalTypes} from "../../modals/ModalRoot";

interface Props {
    id: string;
    popularImageTypes: imageType[]|[],
}

const HomePanel: React.FC<Props> = ({id, popularImageTypes}) => {
    const routeNavigator = useRouteNavigator();
    const {userDbData} = useSelector<RootStateType, ReduxSliceUserInterface>(state => state.user)

    const openImageType = (imageTypeItem: imageType) => {
        if (imageTypeItem.vip && !userDbData?.is_vip) {
            routeNavigator.showModal(ModalTypes.MODAL_GET_VIP_PROFILE)
        } else {
            routeNavigator.push('/generate/select-image/' + imageTypeItem.id)
        }
    }

    return (<Panel id={id}>
            <Group mode='plain' separator='hide'>
                <DivCard>
                    <Placeholder
                        icon={<Image src={girl_image} size={56}/>}
                        header="Ренестра - генератор изображений"
                        action={<Button onClick={() => routeNavigator.push('/generate')} size="l">Поехали</Button>}
                    >
                        Примерь на себя стильный образ, стань воином или фэнтези персонажем с помощью ИИ.
                    </Placeholder>
                </DivCard>
            </Group>
            <Group mode='plain'>
                <DivCard>
                    <Div>
                        <Button
                            mode='secondary'
                            hasActive={false}
                            hasHover={false}
                            before={<Icon28DiamondOutline fill='var(--vkui--color_accent_red)'/>}>Популярные образы</Button>
                    </Div>
                    <Separator/>
                    {
                        !!popularImageTypes.length && popularImageTypes.map((value, key) => <SimpleCell
                            key={key}
                            onClick={() => openImageType(value)}
                            before={IconImageTypeGenerator(value.id)}>{value.name}
                        </SimpleCell>)
                    }
                </DivCard>
            </Group>
        </Panel>
    )
}


export default HomePanel;
