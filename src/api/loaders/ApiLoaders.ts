import {
    apiGetImageTypes,
    apiGetImageTypeWithStatistic,
    apiInitUser,
    getGeneratedImages,
    getUserProfileGenerateInfo
} from "../AxiosApi";
import {AppConfigureStore} from "../../redux/store/ConfigureStore";
import {showAppLoading} from "../../redux/slice/AppStatusesSlice";

export const loaderInit = async () => {
    return await apiInitUser();
};

export const loaderProfileInfo = async () => {
    AppConfigureStore.dispatch(showAppLoading())
    const userTg = (window as any).Telegram?.WebApp.initDataUnsafe.user
    const generateInfo = await getUserProfileGenerateInfo(userTg.id);
    return {...userTg, ...generateInfo};
}

export const loaderImageTypes = async () => {
    AppConfigureStore.dispatch(showAppLoading())
    return await apiGetImageTypes();
};

export const loaderImageType = async ({ params }: {params: {imageTypeId?: number}}) => {
    AppConfigureStore.dispatch(showAppLoading())
    return await apiGetImageTypeWithStatistic(params.imageTypeId as number);
};

export const loaderHistoryImages = async ({ params }: {params: {userId?: number}}) => {
    AppConfigureStore.dispatch(showAppLoading())
    return await getGeneratedImages(params.userId as number);
}
