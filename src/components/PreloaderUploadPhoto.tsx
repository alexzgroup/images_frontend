import React, {FC, useContext, useEffect, useState} from "react";
import {MiniInfoCell, Spinner} from "@vkontakte/vkui";
import {Icon20CheckCircleFillGreen} from "@vkontakte/icons";
import {ColorsList} from "../types/ColorTypes";
import {AppContext, TAppContext} from "../context/AppContext";

export const PreloaderUploadPhoto:FC = () => {
    const [step, setStep] = useState<number>(1)
    const {lang} = useContext<TAppContext>(AppContext);

    useEffect(() => {
        let stepLocal = 1;
        let timerId = setInterval(() => {
            if (stepLocal > 4) {
                clearInterval(timerId);
            }
            setStep((value) => value + 1);
            stepLocal++;
        },2000);

        return () => {
            clearInterval(timerId)
        }
    }, []);

    return (
        <React.Fragment>
            <MiniInfoCell
                textWrap="short"
                before={step === 1 ? <Spinner size="regular" style={{color: ColorsList.primary}} /> : <Icon20CheckCircleFillGreen />}
                expandable={false}
            >
                {lang.MODALS.UPLOAD_PHOTO_1}
            </MiniInfoCell>
            {
                step > 1 &&
                <MiniInfoCell
                    textWrap="short"
                    before={step === 2 ? <Spinner size="regular" style={{color: ColorsList.primary}} /> : <Icon20CheckCircleFillGreen />}
                    expandable={false}
                >
                    {lang.MODALS.UPLOAD_PHOTO_2}
                </MiniInfoCell>
            }
            {
                step > 2 &&
                <MiniInfoCell
                    textWrap="short"
                    before={step === 3 ? <Spinner size="regular" style={{color: ColorsList.primary}} /> : <Icon20CheckCircleFillGreen />}
                    expandable={false}
                >
                    {lang.MODALS.UPLOAD_PHOTO_3}
                </MiniInfoCell>
            }
            {
                step > 3 &&
                <MiniInfoCell
                    textWrap="short"
                    before={<Spinner size="regular" style={{color: ColorsList.primary}} />}
                    expandable={false}
                >
                    {lang.DESCRIPTIONS.PRELOADER_PANEL_STEP_5}
                </MiniInfoCell>
            }
        </React.Fragment>
    )
}
