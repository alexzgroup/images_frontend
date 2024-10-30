import {Caption, File, Image, Link, Spacing, Subhead} from "@vkontakte/vkui";
import {Icon24Camera} from "@vkontakte/icons";
import {UrlConstants} from "../../constants/UrlConstants";
import React, {FC, useContext, useState} from "react";
import {useDispatch} from "react-redux";
import {setSelectImageFile} from "../../redux/slice/ImageSlice";
import {AdaptiveContext, AdaptiveContextType} from "../../context/AdaptiveContext";

const SelectImageSection:FC = () => {
    const [selectImage, setSelectImage] = useState<string>('');
    const dispatch = useDispatch();
    const {lang} = useContext<AdaptiveContextType>(AdaptiveContext);
    const loadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) {
            return;
        }

        const file = e.target.files[0]
        if (file) {
            setSelectImage(URL.createObjectURL(file))
            dispatch(setSelectImageFile(file))
        }
    }

    return (
        <React.Fragment>
            <Subhead style={{textAlign: 'center'}}>{lang.DESCRIPTIONS.SELECT_IMAGE}</Subhead>
            <Spacing />
            <Image withBorder={false}
                   size={128}
                   src={selectImage}/>
            <Spacing />
            <File accept="image/*"
                  onChange={loadImage}
                  before={<Icon24Camera role="presentation" />}
                  size="s">
                {lang.BUTTONS.OPEN_GALLERY}
            </File>
            <Spacing />
            <Caption>{lang.DESCRIPTIONS.CLICK_BEFORE_POLITIC} {" "}
                <Link target='_blank' href={UrlConstants.URL_POLITIC}>{lang.DESCRIPTIONS.ABOUT_PANEL_POLITIC}</Link>{" "}
                {lang.DESCRIPTIONS.AND}{" "}
                <Link target='_blank' href={UrlConstants.URL_RULE_APP}>{lang.DESCRIPTIONS.ABOUT_PANEL_RULES}</Link>.
            </Caption>
            <Spacing />
        </React.Fragment>
    )
}

export default React.memo(SelectImageSection);
