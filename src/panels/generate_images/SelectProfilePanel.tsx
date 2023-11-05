import React, {FC, Suspense, useEffect, useState} from 'react';

import {Banner, Button, Group, Header, Panel, PanelHeader, PanelSpinner, Separator, SimpleCell} from '@vkontakte/vkui';

import {Icon24Arrow2SquarepathOutline} from "@vkontakte/icons";
import banner_image from "../../assets/images/select_image_profile.png";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import PromiseWrapper from "../../api/PromiseWrapper";
import {imageType} from "../../types/ApiTypes";
import {IconImageTypeGenerator} from "../../components/IconImageTypeGenerator";
import {LabelImageTypeGenerator} from "../../components/LabelImageTypeGenerator";
import {apiGetImageTypes} from "../../api/AxiosApi";

interface Props {
    id: string;
}

export const LoadingImageTypes:FC = () => {
    const routeNavigator = useRouteNavigator();

    const [imageTypes, setImageTypes] = useState<imageType[]|[]>([]);

    useEffect(() => {
        setImageTypes(PromiseWrapper(apiGetImageTypes()));
    }, []);

    return (
        <>
            {
                !!imageTypes.length &&
                <React.Fragment>
                    <Group>
                        <Banner
                            mode="image"
                            header="Случайный стильный образ"
                            subheader="Ежедневное обновление. Примерь на себе стильный наряд."
                            background={
                                <div
                                    style={{
                                        background: 'url("' + banner_image + '") center center/cover no-repeat',
                                    }}
                                />
                            }
                            actions={<Button before={<Icon24Arrow2SquarepathOutline/>}
                                             onClick={() => routeNavigator.push('/generate/select-image/' + (imageTypes[Math.floor(Math.random() * (imageTypes.length - 1))].id))}
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
                                    onClick={() => routeNavigator.push('/generate/select-image/' + value.id)}
                                    after={LabelImageTypeGenerator(value.labels)}
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
