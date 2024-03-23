import {Caption, IconButton, Image, Link, Spacing, Subhead} from "@vkontakte/vkui";
import {Icon28AddOutline} from "@vkontakte/icons";
import {UrlConstants} from "../../constants/UrlConstants";
import React, {FC} from "react";
import {userImage} from "../../types/UserTypes";

type data = {
    generateImage: userImage|null,
    getUserToken: () => void,
}

const SelectImageSection:FC<data> = ({generateImage, getUserToken}) => (
    <React.Fragment>
        <Subhead style={{textAlign: 'center'}}>Выберите свою фотографию с аватарок VK</Subhead>
        <Spacing />
        {
            generateImage
                ?
                <Image withBorder={false} size={128} src={generateImage.sizes[generateImage.sizes.length - 1].url}/>
                :
                <IconButton onClick={getUserToken} style={{height: 128}}>
                    <Image withBorder={false} size={128}>
                        <Icon28AddOutline fill='var(--vkui--color_accent_blue)'/>
                    </Image>
                </IconButton>
        }
        <Spacing />
        <Caption>Нажимая продолжить, вы соглашаетесь с {" "}
            <Link target='_blank' href={UrlConstants.URL_POLITIC}>политикой конфиденциальности</Link>{" "}
            и{" "}
            <Link target='_blank' href={UrlConstants.URL_RULE_APP}>правилами пользования приложением</Link>.
        </Caption>
        <Spacing />
    </React.Fragment>
)
export default React.memo(SelectImageSection);
