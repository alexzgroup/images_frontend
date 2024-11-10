import React, {FC, useContext} from "react";
import {GeneratedImageType} from "../../types/ApiTypes";
import {AppContext, TAppContext} from "../../context/AppContext";
import {Card, CardGrid, Div, Image} from "@vkontakte/vkui";
import {setGenerateImageId} from "../../redux/slice/ImageSlice";
import {ModalTypes} from "../../modals/ModalRoot";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {useDispatch} from "react-redux";

const HistoryGenerateImages:FC<{history_generate: GeneratedImageType[]}> = ({history_generate}) => {
    const routeNavigator = useRouteNavigator();
    const dispatch = useDispatch();

    const showGeneratedImage = (generateImageId: number) => {
        dispatch(setGenerateImageId(generateImageId))
        routeNavigator.showModal(ModalTypes.MODAL_SHOW_GENERATED_IMAGE)
    }

    return (
        <React.Fragment>
            {

                    <CardGrid size="s">
                        {
                            history_generate.map((item, key) => (
                                <Card key={key} onClick={() => showGeneratedImage(item.id)}>
                                    <div>
                                        <Image
                                            size={96}
                                            src={item.url}
                                            borderRadius="m"
                                        />
                                    </div>
                                </Card>
                            ))
                        }
                    </CardGrid>
            }
        </React.Fragment>
    )
}

export default HistoryGenerateImages;
