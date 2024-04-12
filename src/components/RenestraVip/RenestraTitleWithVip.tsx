import {Title} from "@vkontakte/vkui";
import {useContext} from "react";
import {AdaptiveContext, AdaptiveContextType} from "../../context/AdaptiveContext";

export const RenestraTitleWithVip = () =>
{
    const {isMobileSize} = useContext<AdaptiveContextType>(AdaptiveContext);
    return (
        <div style={{display: 'flex', gap: 5, alignItems: 'center'}} className="renestra-vip-title">
            <Title level={isMobileSize ? '2' : '1'}>Renestra</Title>
            <div className="gold_button" style={{fontSize: 14, padding: '2px 10px', fontWeight: 'normal', borderRadius: 7, alignSelf: 'flex-end'}}>
                VIP
            </div>
        </div>
    )
}

export default RenestraTitleWithVip;
