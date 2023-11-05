import {Avatar, Card, Header, SimpleCell, Spacing, Title} from "@vkontakte/vkui";
import React, {FC} from "react";
import {groupType} from "../types/ApiTypes";

export const GroupItem:FC<groupType> = ({name, photo_100, users_count, pays_count, pays_sum_amount}) => (
    <Card mode='shadow'>
        <SimpleCell
            before={<Avatar size={48} src={photo_100} />}
        >
            {name}
        </SimpleCell>
        <Header style={{height: 'auto'}} mode='secondary'>
            Всего заработано с сообщества:
        </Header>
        <Title style={{
            paddingLeft: 'var(--vkui--size_base_padding_horizontal--regular)',
            paddingRight: 'var(--vkui--size_base_padding_horizontal--regular)'
        }} level='3'>{pays_sum_amount || 0} руб.</Title>
        <Spacing />
        <Header style={{height: 'auto'}} mode='secondary' aside={users_count}>
            Подписчики в приложении:
        </Header>
        <Spacing />
        <Header style={{height: 'auto'}} mode='secondary' aside={pays_count}>
            Оформленно VIP всего:
        </Header>
        <Spacing />
    </Card>
)
