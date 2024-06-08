import React, {ReactElement} from 'react';

import {
    Banner,
    Button,
    Div,
    Group,
    Header, HorizontalCell, HorizontalScroll,
    Image,
    Panel,
    Placeholder,
    Separator,
    SimpleCell,
    Snackbar
} from '@vkontakte/vkui';
import girl_image from '../../assets/images/icons/girl_icon.png';
import {
    Icon28CancelCircleFillRed,
    Icon28CheckCircleOutline,
    Icon28DiamondOutline,
    Icon28Users3
} from "@vkontakte/icons";
import DivCard from "../../components/DivCard";
import {favoriteImageType, imageType} from "../../types/ApiTypes";
import {IconImageTypeGenerator} from "../../components/IconImageTypeGenerator";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {useSelector} from "react-redux";
import {RootStateType} from "../../redux/store/ConfigureStore";
import {ReduxSliceUserInterface} from "../../redux/slice/UserSlice";
import {ModalTypes} from "../../modals/ModalRoot";
import bridge from "@vkontakte/vk-bridge";
import {apiAddAppToGroup} from "../../api/AxiosApi";
import {ColorsList} from "../../types/ColorTypes";
import VipBlock from "../../components/RenestraVip/VipBlock";

interface Props {
    id: string;
    popularImageTypes: imageType[],
    favoriteImageTypes: favoriteImageType[],
}

const HomePanel: React.FC<Props> = ({id, popularImageTypes, favoriteImageTypes}) => {
    const routeNavigator = useRouteNavigator();
    const {userDbData} = useSelector<RootStateType, ReduxSliceUserInterface>(state => state.user)
    const [snackbar, setSnackbar] = React.useState<ReactElement | null>(null);

    const openImageType = (imageTypeItem: imageType) => {
        if (imageTypeItem.vip && !userDbData?.is_vip) {
            routeNavigator.showModal(ModalTypes.MODAL_PAY_VOICE)
        } else {
            routeNavigator.push('/generate/select-default-image/' + imageTypeItem.id)
        }
    }

    const addAppToGroup = () => {
        bridge.send('VKWebAppAddToCommunity')
            .then((data) => {
                if (data.group_id) {
                    apiAddAppToGroup(data.group_id)
                        .then((r) => {
                            if (r.result) {
                                openSnackBar(<Icon28CheckCircleOutline fill={ColorsList.success} />, 'Приложение подключено.')
                            }
                        })
                        .catch((error) => {
                            openSnackBar(<Icon28CancelCircleFillRed />, 'Произошла ошибка');
                            console.error(error.message);
                        })
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const openSnackBar = (icon: JSX.Element, text: string): void => {
        if (snackbar) return;
        setSnackbar(
            <Snackbar
                onClose={() => setSnackbar(null)}
                before={icon}
            >
                {text}
            </Snackbar>,
        );
    };


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
            {
                !!favoriteImageTypes.length &&
                <Group header={<Header mode='secondary'>Избранные образы</Header>}>
                    <HorizontalScroll>
                        <div style={{ display: 'flex' }}>
                            {
                                favoriteImageTypes.map((item, key) => (
                                    <HorizontalCell
                                        onClick={() => routeNavigator.push(`/generate/select-${item.type}-image/${item.id}`)}
                                        key={item.id} size="l" header={item.name} subtitle={item.description}>
                                        <img style={{
                                            width: 220,
                                            height: 124,
                                            borderRadius: 10,
                                            boxSizing: 'border-box',
                                            border: 'var(--vkui--size_border--regular) solid var(--vkui--color_image_border_alpha)',
                                            objectFit: 'cover',
                                        }} src={item.url}  alt='Ренестра' />
                                    </HorizontalCell>
                                ))
                            }
                        </div>
                    </HorizontalScroll>
                </Group>
            }
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
            {
                !userDbData?.is_vip &&
                    <Group mode='plain'>
                        <Div>
                            <VipBlock />
                        </Div>
                    </Group>
            }
            <Div>
                <Banner
                    mode="image"
                    header="Подключить приложение в сообщество"
                    subheader="Позволь своим подписчикам генерировать аватарки прямо с вашей группы. Подключайте приложение в свою группу!"
                    background={
                        <div
                            style={{
                                background: 'linear-gradient(45deg, #00A700 0%, #A0B500 100%)',
                            }}
                        />
                    }
                    style={{
                        padding: 0,
                        margin: 0,
                        marginBottom: 10,
                    }}
                    actions={<Button onClick={addAppToGroup}
                                     size='l'
                                     before={<Icon28Users3 />}
                                     mode="outline"
                                     appearance="overlay">Подключить сообщество</Button>}
                />
            </Div>
            {snackbar}
        </Panel>
    )
}


export default HomePanel;
