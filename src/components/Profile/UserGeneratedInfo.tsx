import React, {useContext} from "react";
import {Avatar, Caption, MiniInfoCell, RichCell, Title} from "@vkontakte/vkui";
import {Icon20ClockOutline, Icon20Like, Icon20PalleteOutline} from "@vkontakte/icons";
import {UserWithGeneratedInfoType} from "../../types/ApiTypes";
import {ColorsList} from "../../types/ColorTypes";
import {AppContext, TAppContext} from "../../context/AppContext";

const UserGenerateInfo: React.FC<{user: UserWithGeneratedInfoType}> = ({user}) => {
    const {lang} = useContext<TAppContext>(AppContext);
    return (
        <RichCell
            before={<Avatar size={72} initials={Array.from(user?.first_name)[0] + '' + (user?.last_name ? Array.from(user?.last_name)[0] : '')} gradientColor="blue" />}
            text={
                <React.Fragment>
                    <MiniInfoCell style={{paddingLeft: 0}} before={<Icon20Like fill={ColorsList.primary} />}>
                        <Caption level="1">
                            {lang.DESCRIPTIONS.GENERATE_INFO_LIKE_IMAGE} <b>{user.popular_image_type_name}</b>
                        </Caption>
                    </MiniInfoCell>
                    <MiniInfoCell style={{paddingLeft: 0, paddingTop: 0, paddingBottom: 0}} before={<Icon20ClockOutline fill={ColorsList.primary} />}>
                        <Caption level="1">
                            {lang.DESCRIPTIONS.GENERATE_INFO_LAST_IMAGE} <b>{user.last_date_generate}</b>
                        </Caption>
                    </MiniInfoCell>
                    <MiniInfoCell style={{paddingLeft: 0}} before={<Icon20PalleteOutline fill={ColorsList.primary} />}>
                        <Caption level="1">
                            {lang.DESCRIPTIONS.GENERATE_INFO_TOTAL_IMAGE} <b>{user.total_generate}</b>
                        </Caption>
                    </MiniInfoCell>
                </React.Fragment>
            }
            multiline
            disabled
        >
            <Title level="3">{user?.first_name} {user?.last_name}</Title>
        </RichCell>
    )
}

export default UserGenerateInfo;
