import React from 'react';
import Countdown from 'react-countdown';
import {useDispatch} from "react-redux";
import {setUserVip} from "../redux/slice/UserSlice";

type countDownType = {
    days: number,
    hours: number,
    minutes: number,
    seconds: number,
}

export const CounterDown = ({date}: {date: string}) => {
    const dispatch = useDispatch();

    const stopTimer = () => {
        dispatch(setUserVip({is_vip: false}));
        // routeNavigator.showPopout(
        //     <Alert
        //         actions={[
        //             {
        //                 title: 'Понятно',
        //                 autoClose: true,
        //                 mode: 'destructive',
        //             },
        //         ]}
        //         onClose={() => routeNavigator.hidePopout()}
        //         header="Внимание!"
        //         text="У Вас закончился VIP статус, для возобновления подписки, продлите или переоформите ее."
        //     />
        // );
    }

    const renderer = ({ days, hours, minutes, seconds }: countDownType) => {
        return (<></>
            // <Div className="counterDown">
            //     <div className="counterCol">
            //         <span><Title level="1" weight="1">{days}</Title>дней</span>
            //         <div className="delimiter">:</div>
            //         <span><Title level="1" weight="1">{hours}</Title>часов</span>
            //         <div className="delimiter">:</div>
            //         <span><Title level="1" weight="1">{minutes}</Title>минут</span>
            //         <div className="delimiter">:</div>
            //         <span><Title level="1" weight="1">{seconds}</Title>секунд</span>
            //     </div>
            // </Div>
        );
    };

    return (
        <Countdown
            onComplete={stopTimer}
            date={new Date(date)}
            renderer={renderer}
        />
    );
}
