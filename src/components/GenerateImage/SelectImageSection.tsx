import {Caption, File, Image, Link, Spacing, Subhead} from "@vkontakte/vkui";
import {Icon24Camera} from "@vkontakte/icons";
import {UrlConstants} from "../../constants/UrlConstants";
import React, {FC, useState} from "react";
import {useDispatch} from "react-redux";
import {setSelectImageFile} from "../../redux/slice/ImageSlice";

const SelectImageSection:FC = () => {
    const [selectImage, setSelectImage] = useState<string>('');
    const dispatch = useDispatch();

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
            <Subhead style={{textAlign: 'center'}}>Выберите свою фотографию с аватарок VK</Subhead>
            <Spacing />
            <Image withBorder={false}
                   size={128}
                   src={selectImage}/>
            <Spacing />
            <File accept="image/*"
                  onChange={loadImage}
                  before={<Icon24Camera role="presentation" />}
                  size="s">
                Открыть галерею
            </File>
            <Spacing />
            <Caption>Нажимая продолжить, вы соглашаетесь с {" "}
                <Link target='_blank' href={UrlConstants.URL_POLITIC}>политикой конфиденциальности</Link>{" "}
                и{" "}
                <Link target='_blank' href={UrlConstants.URL_RULE_APP}>правилами пользования приложением</Link>.
            </Caption>
            <Spacing />
        </React.Fragment>
    )
}

export default React.memo(SelectImageSection);
