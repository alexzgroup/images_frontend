import React, {FC, Suspense, useContext, useEffect, useState} from 'react';

import {Banner, Button, Group, Header, Panel, PanelHeader, PanelSpinner, Separator, SimpleCell} from '@vkontakte/vkui';

import {Icon24Arrow2SquarepathOutline} from "@vkontakte/icons";
import banner_man_image from "../../assets/images/select_image_profile_man.jpg";
import banner_girl_image from "../../assets/images/select_image_profile_girl.jpg";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import PromiseWrapper from "../../api/PromiseWrapper";
import {AdvertisementEnum, imageType} from "../../types/ApiTypes";
import {IconImageTypeGenerator} from "../../components/IconImageTypeGenerator";
import {LabelImageTypeGenerator} from "../../components/LabelImageTypeGenerator";
import {addAdvertisement, apiGetImageTypes} from "../../api/AxiosApi";
import bridge, { BannerAdLocation } from "@vkontakte/vk-bridge";
import {useSelector} from "react-redux";
import {RootStateType} from "../../redux/store/ConfigureStore";
import {ReduxSliceUserInterface} from "../../redux/slice/UserSlice";
import {ModalTypes} from "../../modals/ModalRoot";
import {AdaptiveContext, AdaptiveContextType} from "../../context/AdaptiveContext";

interface Props {
    id: string;
}

export const LoadingImageTypes:FC = () => {
    const routeNavigator = useRouteNavigator();
    const {userDbData} = useSelector<RootStateType, ReduxSliceUserInterface>(state => state.user)
    const {vkUserInfo} = useContext<AdaptiveContextType>(AdaptiveContext);

    const [imageTypes, setImageTypes] = useState<imageType[]|[]>([]);

    const openImageType = (imageTypeItem: imageType) => {
        if (imageTypeItem.vip && !userDbData?.is_vip) {
            routeNavigator.showModal(ModalTypes.MODAL_GET_VIP_PROFILE)
        } else {
            routeNavigator.push('/generate/select-image/' + imageTypeItem.id)
        }
    }

    const openRandomImage = () => {
        let imageTypesFiltered = imageTypes;
        if (!userDbData?.is_vip) {
            imageTypesFiltered = imageTypes.filter((item) => !item.vip)
        }
        routeNavigator.push('/generate/select-image/' + (imageTypesFiltered[Math.floor(Math.random() * (imageTypesFiltered.length - 1))].id))
    }

    useEffect(() => {
        setImageTypes(PromiseWrapper(apiGetImageTypes()));

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
    }, []);

    return (
        <>
            {
                !!imageTypes.length &&
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
                    <Group
                        header={<Header mode='secondary'>Другие образы</Header>}
                    >
                        <Separator/>
                        {
                            imageTypes.map((value, key) => (
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
