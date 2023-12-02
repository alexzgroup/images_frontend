import React from 'react';
import Countdown from 'react-countdown';
import {Div, Title} from "@vkontakte/vkui";

type countDownType = {
    days: number,
    hours: number,
    minutes: number,
    seconds: number,
}

export const CounterDown = ({date}: {date: string}) => {
    const renderer = ({ days, hours, minutes, seconds }: countDownType) => {
        return (
            <Div className="counterDown">
                <div className="counterCol">
                    <span><Title level="1" weight="2">{days}</Title> дн.</span>
                    <span className="delimiter"></span>
                    <span><Title level="1" weight="2">{hours}</Title>ч.</span>
                    <span className="delimiter"></span>
                    <span><Title level="1" weight="2">{minutes}</Title>мин.</span>
                    <span className="delimiter"></span>
                    <span><Title level="1" weight="2">{seconds}</Title>сек.</span>
                </div>
            </Div>
        );
    };

    return (
        <Countdown
            date={new Date(date)}
            renderer={renderer}
        />
    );
}
