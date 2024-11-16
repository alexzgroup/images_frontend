import {AdController} from "../declarations/adsgram";

/**
 * Класс рекламы
 */
class AdsGram {
    private static AdController?: AdController;
    public static init(): AdController {
        if (AdsGram.AdController) {
            return AdsGram.AdController;
        } else {
            const AdController = (window as any).Adsgram.init({ blockId: process.env.REACT_APP_TG_ADSGRAM_BLOCK_ID });
            AdsGram.AdController = AdController;
            return AdController;
        }
    }
}

export function AdController(){
    return AdsGram.init();
}

export default AdsGram;
