import {AdController} from "../declarations/adsgram";

/**
 * Класс рекламы
 */
class AdsGram {
    private static AdController?: AdController;
    public static init(): AdController {
        if (!!AdsGram.AdController) {
            return AdsGram.AdController;
        } else {
            const AdsController = (window as any).Adsgram.init({ blockId: process.env.REACT_APP_TG_ADSGRAM_BLOCK_ID });
            AdsGram.AdController = AdsController;
            return AdsController;
        }
    }
}

export function AdsGramController(){
    return AdsGram.init();
}

export default AdsGram;
