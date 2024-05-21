import React from "react";
import {Avatar, MiniInfoCell, RichCell, Title} from "@vkontakte/vkui";
import {Icon20ClockOutline, Icon20Like, Icon20PalleteOutline} from "@vkontakte/icons";
import {UserWithGeneratedInfoType} from "../../types/ApiTypes";
import {ColorsList} from "../../types/ColorTypes";

const UserGenerateInfo: React.FC<{user: UserWithGeneratedInfoType}> = ({user}) => (
    <RichCell
        before={<Avatar size={72} src={user?.photo_200} />}
        text={
            <React.Fragment>
                <MiniInfoCell style={{paddingLeft: 0}} before={<Icon20Like fill={ColorsList.primary} />}>
                    Любимый образ: <span style={{color: 'black'}}>{user.popular_image_type_name}</span>
                </MiniInfoCell>
                <MiniInfoCell style={{paddingLeft: 0, paddingTop: 0, paddingBottom: 0}} before={<Icon20ClockOutline fill={ColorsList.primary} />}>
                    Последняя генерация: <span style={{color: 'black'}}>{user.last_date_generate}</span>
                </MiniInfoCell>
                <MiniInfoCell style={{paddingLeft: 0}} before={<Icon20PalleteOutline fill={ColorsList.primary} />}>
                    Всего генераций: <span style={{color: 'black'}}>{user.total_generate}</span>
                </MiniInfoCell>
            </React.Fragment>
        }
        multiline
        disabled
    >
        <Title level="3">{user?.first_name} {user?.last_name}</Title>
    </RichCell>
)

export default UserGenerateInfo;
