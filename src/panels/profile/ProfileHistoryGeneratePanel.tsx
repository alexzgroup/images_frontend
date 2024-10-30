import React, {Suspense, useContext, useEffect, useState} from "react";
import {Group, Panel, PanelHeader, PanelSpinner, Placeholder} from "@vkontakte/vkui";
import {GeneratedImageType} from "../../types/ApiTypes";
import {getGeneratedImages} from "../../api/AxiosApi";
import PromiseWrapper from "../../api/PromiseWrapper";
import ButtonHeaderBack from "../../components/ButtonHeaderBack";
import {useParams} from "@vkontakte/vk-mini-apps-router";
import {Icon56ErrorTriangleOutline} from "@vkontakte/icons";
import {ColorsList} from "../../types/ColorTypes";
import HistoryGenerateImages from "../../components/GenerateImage/HistoryGenerateImages";
import {AdaptiveContext, AdaptiveContextType} from "../../context/AdaptiveContext";


const PanelContent: React.FC = () => {
    const [generatedImages, setGeneratedImages] = useState<GeneratedImageType[]>([]);
    const params = useParams<'userId'>();
    const {lang} = useContext<AdaptiveContextType>(AdaptiveContext);

    const init = () => {
        return new Promise(async (resolve) => {
            const generatedImages = await getGeneratedImages(Number(params?.userId));
            resolve(generatedImages);
        })
    }

    useEffect(() => {
        setGeneratedImages(PromiseWrapper(init()))
    }, []);

    return (
        <Group>
            {
                (!!generatedImages.length)
                    ?
                        <HistoryGenerateImages history_generate={generatedImages} />
                    :
                        <Placeholder
                            icon={<Icon56ErrorTriangleOutline fill={ColorsList.error} />}
                            header={lang.TITLES.HISTORY_PANEL_NOT_AVAILABLE}
                        />
            }
        </Group>
    )
}

const ProfileHistoryGeneratePanel: React.FC<{id: string}> = ({id}) => {
    const {lang} = useContext<AdaptiveContextType>(AdaptiveContext);
    return (
        <Panel id={id}>
            <PanelHeader before={<ButtonHeaderBack />}>{lang.HEADERS.HISTORY_PANEL}</PanelHeader>
            <Suspense fallback={<PanelSpinner size="medium" />}>
                <PanelContent />
            </Suspense>
        </Panel>
    )
}

export default ProfileHistoryGeneratePanel;
