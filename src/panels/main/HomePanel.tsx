import React, {useContext} from 'react';

import {
    Button,
    Div,
    Group,
    Header,
    HorizontalCell,
    HorizontalScroll,
    Image,
    Panel,
    Placeholder,
    Separator,
    SimpleCell
} from '@vkontakte/vkui';
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
import VipBlock from "../../components/RenestraVip/VipBlock";
import {ReduxSliceImageInterface} from "../../redux/slice/ImageSlice";
import {AdaptiveContext, AdaptiveContextType} from "../../context/AdaptiveContext";

interface Props {
    id: string;
}

const HomePanel: React.FC<Props> = ({id}) => {
    const routeNavigator = useRouteNavigator();
    const {userDbData} = useSelector<RootStateType, ReduxSliceUserInterface>(state => state.user)
    const {popularImageTypes, favoriteImageTypes} = useSelector<RootStateType, ReduxSliceImageInterface>(state => state.image)
    const {lang} = useContext<AdaptiveContextType>(AdaptiveContext);

    const openImageType = (imageTypeItem: imageType) => {
        if (imageTypeItem.vip && !userDbData?.is_vip) {
            routeNavigator.showModal(ModalTypes.MODAL_PAY_VOICE)
        } else {
            routeNavigator.push('/generate/select-default-image/' + imageTypeItem.id)
        }
    }

    return (<Panel id={id}>
            <Group mode='plain'>
                <DivCard>
                    <Placeholder
                        icon={<Image src={girl_image} size={56}/>}
                        header={lang.HEADERS.HOME_PANEL}
                        action={<Button onClick={() => routeNavigator.push('/generate')} size="m">{lang.BUTTONS.HOME_PANEL_GO}</Button>}
                    >
                        {lang.DESCRIPTIONS.HOME_PANEL_TOP}
                    </Placeholder>
                </DivCard>
            </Group>
            {
                !!favoriteImageTypes.length &&
                <Group header={<Header mode='secondary'>{lang.TITLES.HOME_PANEL_FAVORITE}</Header>}>
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
                            before={<Icon28DiamondOutline fill='var(--vkui--color_accent_red)'/>}>{lang.TITLES.HOME_PANEL_POPULAR}</Button>
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
        </Panel>
    )
}


export default HomePanel;
