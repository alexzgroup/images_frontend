import React, {FC, Suspense, useContext, useEffect, useState} from 'react';

import {
    Banner,
    Button,
    Div,
    Group,
    Header, HorizontalCell, HorizontalScroll,
    Panel,
    PanelHeader,
    PanelSpinner,
    Separator,
    SimpleCell,
    Spacing,
    Subhead
} from '@vkontakte/vkui';

import {Icon24Arrow2SquarepathOutline} from "@vkontakte/icons";
import banner_man_image from "../../assets/images/select_image_profile_man.jpg";
import banner_girl_image from "../../assets/images/select_image_profile_girl.jpg";
import {RouterLink, useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import PromiseWrapper from "../../api/PromiseWrapper";
import {AdvertisementEnum, exclusiveImageTypesType, imageType} from "../../types/ApiTypes";
import {IconImageTypeGenerator} from "../../components/IconImageTypeGenerator";
import {LabelImageTypeGenerator} from "../../components/LabelImageTypeGenerator";
import {addAdvertisement, apiGetImageTypes} from "../../api/AxiosApi";
import bridge, {BannerAdLocation} from "@vkontakte/vk-bridge";
import {useSelector} from "react-redux";
import {RootStateType} from "../../redux/store/ConfigureStore";
import {ReduxSliceUserInterface} from "../../redux/slice/UserSlice";
import {ModalTypes} from "../../modals/ModalRoot";
import {AdaptiveContext, AdaptiveContextType} from "../../context/AdaptiveContext";

interface Props {
    id: string;
}

type  ImageTypeFromRequest = {
    exclusive_image_types: exclusiveImageTypesType[],
    favorite_image_types: (exclusiveImageTypesType & {description: string})[] ,
    items: imageType[],
}

export const LoadingImageTypes:FC = () => {
    const routeNavigator = useRouteNavigator();
    const {userDbData} = useSelector<RootStateType, ReduxSliceUserInterface>(state => state.user)
    const {vkUserInfo} = useContext<AdaptiveContextType>(AdaptiveContext);

    const [imageTypes, setImageTypes] = useState<ImageTypeFromRequest|null>(null);

    const openImageType = (imageTypeItem: imageType) => {
        if (imageTypeItem.vip && !userDbData?.is_vip) {
            routeNavigator.showModal(ModalTypes.MODAL_PAY_VOICE)
        } else {
            routeNavigator.push('/generate/select-default-image/' + imageTypeItem.id)
        }
    }

    const openRandomImage = () => {
        let imageTypesFiltered = imageTypes?.items;
        if (!userDbData?.is_vip && imageTypesFiltered) {
            imageTypesFiltered = imageTypesFiltered.filter((item) => !item.vip)
        }

        if (imageTypesFiltered) {
            routeNavigator.push('/generate/select-default-image/' + (imageTypesFiltered[Math.floor(Math.random() * (imageTypesFiltered.length - 1))].id))
        }
    }

    useEffect(() => {
        setImageTypes(PromiseWrapper(apiGetImageTypes()));

        if (!userDbData?.is_vip) {
            bridge.send('VKWebAppShowBannerAd', {
                banner_location: BannerAdLocation.BOTTOM
            })
                .then((data: any) => {
                    if (data.result) {
                        addAdvertisement({type: AdvertisementEnum.banner}).then();
                    }
                })
                .catch((error) => {
                    // Ошибка
                    console.log(error);
                });
        }
    }, []);

    return (
        <>
            {
                !!imageTypes?.items.length &&
                <React.Fragment>
                    <Group>
                        <Banner
                            mode="image"
                            header="Случайный образ"
                            subheader="Ежедневное обновление. Примерь на себя стильный наряд."
                            background={
                                <div
                                    style={{
                                        background: 'url("' + (vkUserInfo?.sex === 2 ? banner_man_image : banner_girl_image) + '") center center/cover no-repeat',
                                    }}
                                />
                            }
                            actions={<Button before={<Icon24Arrow2SquarepathOutline/>}
                                             onClick={() => openRandomImage()}
                                             appearance="overlay">Сгенерировать</Button>}
                        />
                    </Group>
                    {
                        !!imageTypes.exclusive_image_types.length &&
                        <Group header={<Header mode='secondary'>Дополнительные функции</Header>}>
                            <Div style={{
                                display: 'grid',
                                gridTemplate: '1fr/1fr 1fr 1fr',
                                gap: 15
                            }}>
                                {
                                    imageTypes.exclusive_image_types.map((item, key) => (
                                        <div key={item.id + '_' + key}>
                                            <RouterLink to={`/generate/select-${item.type}-image/${item.id}`}>
                                                <div
                                                    style={{
                                                        paddingTop: '90%',
                                                        backgroundImage: `url(${item.url})`,
                                                        borderRadius: 'var(--vkui--size_border_radius_paper--regular)',
                                                        backgroundSize: 'contain',
                                                    }}/>
                                            </RouterLink>
                                            <Spacing/>
                                            <Subhead weight='1'>{item.name}</Subhead>
                                        </div>
                                    ))
                                }
                            </Div>
                        </Group>
                    }
                    {
                        !!imageTypes.favorite_image_types.length &&
                        <Group header={<Header mode='secondary'>Избранные образы</Header>}>
                            <HorizontalScroll>
                                <div style={{ display: 'flex' }}>
                                    {
                                        imageTypes.favorite_image_types.map((item, key) => (
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
                    <Group
                        header={<Header mode='secondary'>Другие образы</Header>}
                    >
                        <Separator/>
                        {
                            imageTypes.items.map((value, key) => (
                                <SimpleCell
                                    key={'image_type' + key}
                                    onClick={() => openImageType(value)}
                                    after={LabelImageTypeGenerator(value.labels as never)}
                                    before={IconImageTypeGenerator(value.id)}>{value.name}</SimpleCell>
                            ))
                        }
                    </Group>
                </React.Fragment>
            }
        </>
    )
}

const SelectProfilePanel: React.FC<Props> = ({id}) => {
    return (
        <Panel id={id}>
            <PanelHeader>Выберите себе образ</PanelHeader>
            <Suspense fallback={<PanelSpinner size="medium" />}>
                <LoadingImageTypes />
            </Suspense>
        </Panel>
    )
}

export default SelectProfilePanel;
