import React from 'react';

import {Banner, Button, Div, Group, Image, Panel, Placeholder, Separator, SimpleCell, Spacing} from '@vkontakte/vkui';
import girl_image from '../../assets/images/icons/girl_icon.png';
import rub_circle_image from '../../assets/images/icons/ruble_cirle.svg';
import {Icon24RoubleBadgeOutline, Icon24ThumbsUpOutline, Icon28DiamondOutline} from "@vkontakte/icons";
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
            <Group mode='plain'>
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
                    <Spacing><Separator/></Spacing>
                    {
                        !!popularImageTypes.length && popularImageTypes.map((value, key) => <SimpleCell
                            key={key}
                            onClick={() => openImageType(value)}
                            before={IconImageTypeGenerator(value.id)}>{value.name}
                        </SimpleCell>)
                    }
                </DivCard>
            </Group>
            <Banner
                mode="image"
                header="Монетизация сообществ"
                subheader="Получай 30% дохода с оформления VIP подписчиками ваших сообществ"
                background={
                    <div
                        style={{
                            background: 'url("' + rub_circle_image + '") right bottom/150px no-repeat, linear-gradient(45deg, #00A700 0%, #A0B500 100%)',
                        }}
                    />
                }
                actions={userDbData?.is_monetization
                    ? <Button onClick={() => routeNavigator.push('/monetization/profile')} before={<Icon24ThumbsUpOutline/>} mode="outline" appearance="overlay">Перейти в кабинет</Button>
                    : <Button onClick={() => routeNavigator.push('/monetization')} before={<Icon24RoubleBadgeOutline/>} appearance="overlay">Подключиться</Button>}
            />
        </Panel>
    )
}


export default HomePanel;
