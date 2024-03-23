import LabelsList from "../LabelsList";
import {TypeColors} from "../../types/ColorTypes";
import {Footer} from "@vkontakte/vkui";
import React from "react";
import {RecommendedImageLabels, NoRecommendedImageLabels} from "../../constants/AppConstants";

const RecommendedLabels = () => (
    <React.Fragment>
        <LabelsList type={TypeColors.success} labels={RecommendedImageLabels} header='Рекомендации к фотографиям:' />
        <LabelsList type={TypeColors.error} labels={NoRecommendedImageLabels} header='Не рекомендуем использовать:' />
        <Footer>
            При генерации изображения вам может показываться реклама. Она позволяет бесплатно генерировать изображения.
        </Footer>
    </React.Fragment>
)

export default RecommendedLabels;
