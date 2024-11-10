import React, {useContext} from "react";
import RenestraTitleWithVip from "./RenestraTitleWithVip";
import {Button, Spacing, Title} from "@vkontakte/vkui";
import vipLogo from "../../assets/images/vip_logo.png";
import {useSelector} from "react-redux";
import {RootStateType} from "../../redux/store/ConfigureStore";
import {ReduxSliceUserInterface} from "../../redux/slice/UserSlice";
import {AppContext, TAppContext} from "../../context/AppContext";

const GetVipBanner:React.FC<{actionSubscription: () => void}> = ({actionSubscription}) => {
    const {userDbData} = useSelector<RootStateType, ReduxSliceUserInterface>(state => state.user)
    const {lang} = useContext<TAppContext>(AppContext);

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
                    <Title className="golden_text" level="1">{lang.DESCRIPTIONS.VIP_BANNER_ACTIVE}</Title>
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
                        <Title style={{color: 'white'}} level="3">{lang.DESCRIPTIONS.VIP_BANNER_GET}</Title>
                        <Spacing/>
                        <p>{lang.DESCRIPTIONS.VIP_BLOCK_1}</p>
                        <p>{lang.DESCRIPTIONS.VIP_BLOCK_2}</p>
                        <p>{lang.DESCRIPTIONS.VIP_BLOCK_3}</p>
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
                    !!userDbData?.voice_subscribe?.pending_cancel ? lang.DESCRIPTIONS.VIP_RESUME : lang.DESCRIPTIONS.VIP_CANCEL
                }
            </Button>
        </div>
    )
}

export default GetVipBanner;
