import React, {FC, memo, useContext, useState} from 'react';
import {Avatar, Button, Div, Header, HorizontalCell, HorizontalScroll, IconButton, Title} from "@vkontakte/vkui";
import {GeneratedImageType} from "../types/ApiTypes";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {Icon56UserSquareOutline} from "@vkontakte/icons";
import {AppContext, TAppContext} from "../context/AppContext";


const GeneratedImages:FC<{images: GeneratedImageType[]}> = ({images}) => {
    const routeNavigator = useRouteNavigator();
    const [showAll, setShowAll] = useState<boolean>(false)

    const openAllImages = () => {
        setShowAll(!showAll)
    }

    return (
        <Div>
            <Header multiline style={{paddingLeft: 0}} mode="secondary">История генерации за последние 24 часа</Header>
            {!!images.length ?
                <div>
                    {
                        showAll
                        ?
                            <div style={{
                                display: 'flex',
                                flexGrow: 1,
                                flexWrap: 'wrap',
                                gap: 5,
                                justifyContent: 'space-between',
                            }}>
                                {
                                    images.map((item, key) => (
                                        <div
                                            style={{height: 72}}
                                            key={key}
                                        >
                                            <IconButton  onClick={() => routeNavigator.push(`/show-generate-image/${item.id}/share-wall`)}>
                                                <Avatar
                                                    key={key}
                                                    fallbackIcon={<Icon56UserSquareOutline />}
                                                    size={72}
                                                    src={item.url}
                                                />
                                            </IconButton>
                                        </div>
                                    ))
                                }
                            </div>
                            :
                            <React.Fragment>
                                <HorizontalScroll>
                                    <div style={{ display: 'flex' }}>
                                        {
                                            ((images.length > 4) ? images.slice(0, -(images.length - 4)) : images).map((item, key) => (
                                                <HorizontalCell
                                                    onClick={() => routeNavigator.push(`/show-generate-image/${item.id}/share-wall`)}
                                                    key={key}
                                                    size="l"
                                                >
                                                    <Avatar
                                                        fallbackIcon={<Icon56UserSquareOutline />}
                                                        size={72}
                                                        src={item.url}
                                                    />
                                                </HorizontalCell>
                                            ))
                                        }
                                    </div>
                                </HorizontalScroll>
                                {
                                    (images.length > 4) && <Button onClick={openAllImages} style={{margin: '10px 0 10px 0'}} mode="outline" size="s">Показать ещё</Button>
                                }
                            </React.Fragment>
                    }
                </div>
                :
                <Title level="3">Пока нет генераций</Title>
            }
        </Div>
    );
}

export default memo(GeneratedImages);
