import React, {Suspense, useEffect, useState} from "react";
import {Div, Group, Image, Panel, PanelHeader, PanelSpinner, Placeholder} from "@vkontakte/vkui";
import {GeneratedImageType} from "../../types/ApiTypes";
import {getGeneratedImages} from "../../api/AxiosApi";
import PromiseWrapper from "../../api/PromiseWrapper";
import ButtonHeaderBack from "../../components/ButtonHeaderBack";
import {setGenerateImageId} from "../../redux/slice/ImageSlice";
import {useDispatch} from "react-redux";
import {useParams, useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {ModalTypes} from "../../modals/ModalRoot";
import {Icon56ErrorTriangleOutline} from "@vkontakte/icons";
import {ColorsList} from "../../types/ColorTypes";


const PanelContent: React.FC = () => {
    const [generatedImages, setGeneratedImages] = useState<GeneratedImageType[]>([]);
    const dispatch = useDispatch();
    const routeNavigator = useRouteNavigator();
    const params = useParams<'userId'>();

    const init = () => {
        return new Promise(async (resolve) => {
            const generatedImages = await getGeneratedImages(Number(params?.userId));
            resolve(generatedImages);
        })
    }

    const showGeneratedImage = (generateImageId: number) => {
        dispatch(setGenerateImageId(generateImageId))
        routeNavigator.showModal(ModalTypes.MODAL_SHOW_GENERATED_IMAGE)
    }

    useEffect(() => {
        setGeneratedImages(PromiseWrapper(init()))
    }, []);

    return (
        <Group>
            {
                (!!generatedImages.length)
                    ?
                        <Div style={{display: 'flex', gap: 5, flexGrow: 1, flexWrap: 'wrap', justifyContent: 'flex-start'}}>
                            {
                                generatedImages.map((item, key) => (
                                    <div key={key} onClick={() => showGeneratedImage(item.id)}>
                                        <Image
                                            size={96}
                                            src={item.url}
                                            borderRadius="m"
                                        />
                                    </div>
                                ))
                            }
                        </Div>
                    :
                        <Placeholder
                            icon={<Icon56ErrorTriangleOutline fill={ColorsList.error} />}
                            header="У пользователя пока нет генераций!"
                        />
            }
        </Group>
    )
}

const ProfileHistoryGeneratePanel: React.FC<{id: string}> = ({id}) => {
    return (
        <Panel id={id}>
            <PanelHeader before={<ButtonHeaderBack />}>История генераций</PanelHeader>
            <Suspense fallback={<PanelSpinner size="medium" />}>
                <PanelContent />
            </Suspense>
        </Panel>
    )
}

export default ProfileHistoryGeneratePanel;
