import React, {Suspense, useContext, useEffect, useState} from 'react';

import {
    Alert,
    Banner,
    Button,
    CustomSelect,
    Div,
    FormItem,
    Group,
    Panel,
    PanelHeader,
    PanelSpinner,
    Text
} from '@vkontakte/vkui';
import {ColorsList} from "../../types/ColorTypes";
import {useParams, useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {useDispatch, useSelector} from "react-redux";
import {ReduxSliceUserInterface} from "../../redux/slice/UserSlice";
import {RootStateType} from "../../redux/store/ConfigureStore";
import {clearSelectImageFile, ReduxSliceImageInterface} from "../../redux/slice/ImageSlice";
import {apiGetImageTypeWithStatistic} from "../../api/AxiosApi";
import {imageTypeStatisticType} from "../../types/ApiTypes";
import PromiseWrapper from "../../api/PromiseWrapper";
import RecommendedLabels from "../../components/GenerateImage/RecommendedLabels";
import SelectImageSection from "../../components/GenerateImage/SelectImageSection";
import ButtonHeaderBack from "../../components/ButtonHeaderBack";
import {AppContext, TAppContext} from "../../context/AppContext";
import {ModalTypes} from "../../modals/ModalRoot";
import {ShowPromiseResult} from "../../declarations/adsgram";
import {useTelegram} from "../../context/TelegramProvider";

interface Props {
    id: string;
}

const PanelData = () => {
    const params = useParams<'imageTypeId'>();
    const routeNavigator = useRouteNavigator();
    const {selectImageFile} = useSelector<RootStateType, ReduxSliceImageInterface>(state => state.image)
    const {userDbData} = useSelector<RootStateType, ReduxSliceUserInterface>(state => state.user)

    const [imageType, setImageType] = useState<imageTypeStatisticType>({
        generate_statistic: {
            available_count_generate: 0,
            generate_in_process: false,
            available_day_limit: 0,
        },
        img_type_to_variant_groups: [],
        type_variant_to_img_group_variants: [],
        item: {
            id: 0,
            name: '',
            vip: 0,
            url: '',
            type: "default",
        }
    });
    const [zodiac, setZodiac] = React.useState<string>('');
    const [zodiacSelectError, setZodiacSelectError] = React.useState<string>('');
    const {lang} = useContext<TAppContext>(AppContext);
    const {AdController} = useTelegram();

    const openPreloaderGenerate = () => {
        setZodiacSelectError('');
        if (imageType?.generate_statistic.generate_in_process) {
            routeNavigator.showPopout(
                <Alert
                    actions={[
                        {
                            title: lang.ALERT.ACCEPT,
                            autoClose: true,
                            mode: 'destructive',
                        },
                    ]}
                    onClose={() => routeNavigator.hidePopout()}
                    header={lang.ALERT.WARNING}
                    text={lang.ALERT.HAS_ACTIVE_GENERATE}
                />
            );
        } else if (selectImageFile && params?.imageTypeId) {
            if (!zodiac) {
                setZodiacSelectError(lang.DESCRIPTIONS.SELECT_IMAGE_ZODIAC_PANEL_ERROR_OPTIONS);
            } else {
                routeNavigator.push('/generate/preloader', {state: {formData: {zodiac}, imageTypeId: params?.imageTypeId}})
            }
        }
    }

    useEffect(() => {
        setImageType(PromiseWrapper(apiGetImageTypeWithStatistic(Number(params?.imageTypeId))))
        if (!userDbData?.is_vip) {
            // routeNavigator.showModal(ModalTypes.MODAL_TG_TADS)
            AdController?.show().then((result: ShowPromiseResult) => {
                console.log('AD S:::', result);
            }).catch((result: ShowPromiseResult) => {
                console.log('AD E:::', result);
            })
        }
    }, []);

    useEffect(() => {
        if (zodiac) {
            setZodiacSelectError('');
        }
    }, [zodiac]);

    return (
        <React.Fragment>
            <Group>
                <Div style={{textAlign: 'center', display: "flex", flexFlow: 'column', alignItems: 'center', margin: 'auto'}}>
                    <SelectImageSection />
                    {
                        imageType.zodiac &&
                            <FormItem
                                status={zodiac ? 'valid' : (zodiacSelectError ? 'error' : 'default')}
                                top={lang.DESCRIPTIONS.SELECT_IMAGE_ZODIAC_PANEL_ZODIAC}
                                bottom={zodiacSelectError || ''}
                                htmlFor="zodiac"
                                style={{width: '100%'}}
                            >
                                <CustomSelect
                                    onChange={(e) => setZodiac(e.target.value)}
                                    id="zodiac"
                                    placeholder={lang.DESCRIPTIONS.SELECT_IMAGE_ZODIAC_PANEL_NOT_SELECTED}
                                    options={imageType.zodiac}
                                />
                            </FormItem>
                    }
                    {
                        (imageType.generate_statistic.available_count_generate < 1)
                            ?
                            <React.Fragment>
                                <Button
                                    stretched
                                    disabled
                                    appearance='negative'
                                    mode='secondary'
                                    size="l"
                                >
                                    {lang.BUTTONS.SELECT_IMAGE_NAME_PANEL_TOMORROW}
                                </Button>
                                <Banner
                                    size="m"
                                    noPadding
                                    mode="image"
                                    header={lang.TITLES.SELECT_IMAGE_ZODIAC_PANEL_NOT_AVAILABLE}
                                    subheader={lang.DESCRIPTIONS.SELECT_IMAGE_NAME_PANEL_RETURN_TOMORROW}
                                    background={<div style={{background: ColorsList.error}}/>}
                                    style={{width: '100%', margin: '10px 0 5px 0'}}
                                />
                            </React.Fragment>
                            :
                            <Button disabled={!selectImageFile} stretched size='l' onClick={openPreloaderGenerate}>
                                {lang.BUTTONS.SELECT_IMAGE_PANEL_CONTINUE}
                            </Button>
                    }
                </Div>
            </Group>
            <Group>
                <Banner
                    size="m"
                    header={lang.DESCRIPTIONS.SELECT_IMAGE_PANEL_AVAILABLE_IMAGES + ' ' + imageType.generate_statistic.available_count_generate}
                    subheader={<Text>{lang.DESCRIPTIONS.SELECT_IMAGE_ZODIAC_PANEL_EVERY_DAY_AVAILABLE_IMAGES}</Text>}
                />
            </Group>
            <RecommendedLabels />
        </React.Fragment>
    )
}

const SelectImageZodiacPanel: React.FC<Props> = ({id}) => {
    const dispatch = useDispatch()
    const {lang} = useContext<TAppContext>(AppContext);

    useEffect(() => {
        dispatch(clearSelectImageFile())
    }, []);

    return (
        <Panel id={id}>
            <PanelHeader before={<ButtonHeaderBack />}>{lang.HEADERS.SELECT_IMAGE_PANEL}</PanelHeader>
            <Suspense fallback={<PanelSpinner size="medium" />} >
                <PanelData />
            </Suspense>
        </Panel>
    )
}

export default SelectImageZodiacPanel;
