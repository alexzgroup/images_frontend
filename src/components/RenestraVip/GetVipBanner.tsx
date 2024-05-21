import React from "react";
import RenestraTitleWithVip from "./RenestraTitleWithVip";
import {Button, Spacing, Title} from "@vkontakte/vkui";
import vipLogo from "../../assets/images/vip_logo.png";
import {useSelector} from "react-redux";
import {RootStateType} from "../../redux/store/ConfigureStore";
import {ReduxSliceUserInterface} from "../../redux/slice/UserSlice";

const GetVipBanner:React.FC<{actionSubscription: () => void}> = ({actionSubscription}) => {
    const {userDbData} = useSelector<RootStateType, ReduxSliceUserInterface>(state => state.user)

    return (
        <div className="vip-block">
            <div style={{
                display: "flex",
                justifyContent: 'space-between',
                flexFlow: 'row wrap',
            }}
            >
                <div style={{
                    flexGrow: 1,
                    flexBasis: '100%',
                }}>
                    <RenestraTitleWithVip/>
                    <Spacing/>
                    <Title className="golden_text" level="1">У Вас активен VIP статус!</Title>
                </div>
                <div style={{
                    display: "flex",
                    flexGrow: 1,
                    flexBasis: '100%',
                }}>
                    <div style={{
                        flexGrow: 1,
                        flexBasis: '50%',
                        alignSelf: 'center'
                    }}>
                        <Title style={{color: 'white'}} level="3">Вы получили:</Title>
                        <Spacing/>
                        <p>20 генераций в день</p>
                        <p>Эксклюзивные образы</p>
                        <p>и другие преимущества!</p>
                    </div>
                    <div style={{
                        alignSelf: 'start',
                        flexGrow: 1,
                        flexBasis: '50%',
                        textAlign: 'right'
                    }}>
                        <img style={{
                            maxWidth: '100%',
                            maxHeight: '120px',
                        }} src={vipLogo} alt="vip logo"/>
                    </div>
                </div>
            </div>
            <Spacing/>
            <Button style={{color: 'black'}} className="gold_button" onClick={actionSubscription}
                    stretched>
                {
                    !!userDbData?.voice_subscribe?.pending_cancel ? 'Возобновить подписку' : 'Отменить подписку'
                }
            </Button>
        </div>
    )
}

export default GetVipBanner;
