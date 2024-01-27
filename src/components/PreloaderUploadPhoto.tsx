import React, {FC, useEffect, useState} from "react";
import {MiniInfoCell, Spinner} from "@vkontakte/vkui";
import {Icon20CheckCircleFillGreen} from "@vkontakte/icons";
import {ColorsList} from "../types/ColorTypes";

export const PreloaderUploadPhoto:FC = () => {
    const [step, setStep] = useState<number>(1)

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
                Выставляем высокое разрешение
            </MiniInfoCell>
            {
                step > 1 &&
                <MiniInfoCell
                    textWrap="short"
                    before={step === 2 ? <Spinner size="regular" style={{color: ColorsList.primary}} /> : <Icon20CheckCircleFillGreen />}
                    expandable={false}
                >
                    Сохраняем изображение ВКонтакте
                </MiniInfoCell>
            }
            {
                step > 2 &&
                <MiniInfoCell
                    textWrap="short"
                    before={step === 3 ? <Spinner size="regular" style={{color: ColorsList.primary}} /> : <Icon20CheckCircleFillGreen />}
                    expandable={false}
                >
                    Создаём запись на вашей стене
                </MiniInfoCell>
            }
            {
                step > 3 &&
                <MiniInfoCell
                    textWrap="short"
                    before={<Spinner size="regular" style={{color: ColorsList.primary}} />}
                    expandable={false}
                >
                    Ещё немного...
                </MiniInfoCell>
            }
        </React.Fragment>
    )
}
