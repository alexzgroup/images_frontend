import LabelsList from "../LabelsList";
import {TypeColors} from "../../types/ColorTypes";
import {Footer} from "@vkontakte/vkui";
import React, {useContext} from "react";
import {AdaptiveContext, AdaptiveContextType} from "../../context/AdaptiveContext";

const RecommendedLabels = () => {
    const {lang} = useContext<AdaptiveContextType>(AdaptiveContext);
    return (
        <React.Fragment>
            <LabelsList type={TypeColors.success} labels={lang.RECOMMENDED_IMAGE_LABELS} header={lang.DESCRIPTIONS.RECOMMENDED_PHOTOS} />
            <LabelsList type={TypeColors.error} labels={lang.NO_RECOMMENDED_IMAGE_LABELS} header={lang.DESCRIPTIONS.NO_RECOMMENDED_PHOTOS} />
            <Footer>
                {lang.DESCRIPTIONS.RECOMMENDED}
            </Footer>
        </React.Fragment>
    )
}

export default RecommendedLabels;
