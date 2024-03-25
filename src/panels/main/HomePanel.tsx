import React, {ReactElement} from 'react';

import {Banner, Button, Div, Group, Image, Panel, Placeholder, Separator, SimpleCell, Snackbar} from '@vkontakte/vkui';
import girl_image from '../../assets/images/icons/girl_icon.png';
import {
    Icon28CancelCircleFillRed,
    Icon28CheckCircleOutline,
    Icon28DiamondOutline,
    Icon28Users3
} from "@vkontakte/icons";
import DivCard from "../../components/DivCard";
import {imageType} from "../../types/ApiTypes";
import {IconImageTypeGenerator} from "../../components/IconImageTypeGenerator";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {useSelector} from "react-redux";
import {RootStateType} from "../../redux/store/ConfigureStore";
import {ReduxSliceUserInterface} from "../../redux/slice/UserSlice";
import {ModalTypes} from "../../modals/ModalRoot";
import bridge from "@vkontakte/vk-bridge";
import {apiAddAppToGroup} from "../../api/AxiosApi";
import {ColorsList} from "../../types/ColorTypes";

interface Props {
    id: string;
    popularImageTypes: imageType[]|[],
}

const HomePanel: React.FC<Props> = ({id, popularImageTypes}) => {
    const routeNavigator = useRouteNavigator();
    const {userDbData} = useSelector<RootStateType, ReduxSliceUserInterface>(state => state.user)
    const [snackbar, setSnackbar] = React.useState<ReactElement | null>(null);

    const openImageType = (imageTypeItem: imageType) => {
        if (imageTypeItem.vip && !userDbData?.is_vip) {
            routeNavigator.showModal(ModalTypes.MODAL_GET_VIP_PROFILE)
        } else {
            routeNavigator.push('/generate/select-image/' + imageTypeItem.id)
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
                    marginBottom: 0,
                }}
                actions={<Button onClick={addAppToGroup}
                                 size='l'
                                 before={<Icon28Users3 />}
                                 mode="outline"
                                 appearance="overlay">Подключить сообщество</Button>}
            />
            {snackbar}
        </Panel>
    )
}


export default HomePanel;
