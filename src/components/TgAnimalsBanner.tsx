import * as React from "react";
import {LangEnum} from "../enum/LangEnum";
import {useTelegram} from "../context/TelegramProvider";

export const TgAnimalsBanner = () => {
    const [imageSrc, setImageSrc] = React.useState<string | null>(null);
    const { userTg} = useTelegram();

    React.useEffect(() => {
        const loadImage = async () => {

            if (userTg) {
                const lang =  LangEnum[userTg.language_code] || LangEnum.en;
                try {
                    const module = await import(`../assets/images/invate_tg_animals/invite_animals_${lang || LangEnum.en}.png`);
                    setImageSrc(module.default);
                } catch (error) {
                    console.error('Failed to load image:', error);
                }
            }
        };

        loadImage();
    }, [userTg]);

    if (!imageSrc) {
        return <div>Loading...</div>; // или спиннер
    }

    return (
        <div>
            <a style={{textAlign: 'center',
                marginTop: 10,
                display: 'flex',
                borderRadius: 20,
                boxShadow: 'rgba(0, 0, 0, 0.2) 0px 8px 10px -5px, rgba(0, 0, 0, 0.14) 0px 16px 24px 2px, rgba(0, 0, 0, 0.12) 0px 6px 30px 5px'}}
               href={process.env.REACT_APP_ANIMALS_BOT_URL}>
                <img style={{maxWidth: '100%'}} src={imageSrc} alt="banner"/>
            </a>
        </div>
    );
};