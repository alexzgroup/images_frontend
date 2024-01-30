import React, {useEffect, useState} from 'react';
import bridge, {UserInfo} from '@vkontakte/vk-bridge';
import {
	AdaptivityProps,
	Epic,
	Platform,
	ScreenSpinner,
	SplitCol,
	SplitLayout,
	useAdaptivityWithJSMediaQueries,
	usePlatform,
	View,
	ViewWidth
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import HomePanel from './panels/main/HomePanel';
import {useActiveVkuiLocation, useGetPanelForView, usePopout, useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import TabBarWrapper from "./components/TabBarWrapper";
import {PANEL_CONSTANTS, VIEW_CONSTANTS} from "./constants/RouterConstants";
import {DEV_USER_VK_IDS} from "./constants/UserConstants";
import SelectProfilePanel from "./panels/generate_images/SelectProfilePanel";
import ModalRootComponent, {ModalTypes} from "./modals/ModalRoot";
import './assets/css/style.scss';
import SelectImagePanel from "./panels/generate_images/SelectImagePanel";
import {AdaptiveContext} from "./context/AdaptiveContext";
import AboutPanel from "./panels/about/AboutPanel";
import WelcomePanel from "./panels/monetization/WelcomePanel";
import ProfilePanel from "./panels/monetization/ProfilePanel";
import {useDispatch, useSelector} from "react-redux";
import {RootStateType} from "./redux/store/ConfigureStore";
import {hideAppLoading, ReduxSliceStatusesInterface} from "./redux/slice/AppStatusesSlice";
import {apiInitUser} from "./api/AxiosApi";
import {imageType, socketDonutType, socketImageType} from "./types/ApiTypes";
import {setUserDbData, setUserDonut} from "./redux/slice/UserSlice";
import GroupListPanel from "./panels/monetization/GroupListPanel";
import PreloaderPanel from "./panels/generate_images/PreloaderPanel";
import {setGenerateImageId} from "./redux/slice/ImageSlice";
import ShareWallImagePanel from "./panels/show_generate_image/ShareWallImagePanel";
import ShareStoreImagePanel from "./panels/show_generate_image/ShareStoreImagePanel";
import ShowGeneratedImagePanel from "./panels/show_generate_image/ShowGeneratedImagePanel";

const App = () => {
	const [vkUserInfo, setUser] = useState<UserInfo | undefined>();
	const routerPopout = usePopout();
	const routeNavigator = useRouteNavigator();
	const [popularImageTypes, setPopularImageTypes] = useState<imageType[] | []>([]);

	const { view: activeView } = useActiveVkuiLocation();
	const activePanel = useGetPanelForView();
	const platform = usePlatform();
	const isVkComPlatform = platform === Platform.VKCOM;
	const view:AdaptivityProps = useAdaptivityWithJSMediaQueries();
	const isMobileSize:boolean = (view.viewWidth || 99) < ViewWidth.SMALL_TABLET;
	const {appIsLoading} = useSelector<RootStateType, ReduxSliceStatusesInterface>(state => state.appStatuses)
	const dispatch = useDispatch();

	const initSocket = (vkUserId: number) => {
		const options = {
			broadcaster: 'pusher',
			key: process.env.REACT_APP_PUSHER_APP_KEY,
			app_key: process.env.REACT_APP_PUSHER_APP_KEY,
			cluster: process.env.REACT_APP_PUSHER_CLUSTER,
			// httpHost: process.env.REACT_APP_PUSHER_HOST,
			// httpsPort: 6001,
			wsHost: process.env.REACT_APP_PUSHER_HOST,
			// wssPort: 6001,
			forceTLS: false,
			disableStats: true,
			authEndpoint: process.env.REACT_APP_URL_API + "pusher/auth",
			auth: {
				headers: {
					'X-Referer': window.location.href,
				},
			},
		}

		const pusher = new Pusher(options.key, options);
		const echo = new Echo({
			...options,
			client: pusher
		});

		echo.private(`users.${vkUserId}`)
			.listen('.donut.success', (e: socketDonutType) => {
				if (e.data.status) {
					dispatch(setUserDonut(e.data.date_vip_ended));
					routeNavigator.showModal(ModalTypes.MODAL_DONUT);
				}
			})
			.listen('.image_generate.success', (e: socketImageType) => {
				if (e.data.status) {
					dispatch(setGenerateImageId(e.data.id))
					routeNavigator.showModal(ModalTypes.MODAL_GENERATED_IMAGE);
				}
			})
			.error((error: any) => {
				// This is run if there's a problem joining the channel.
				console.error(error);
			});

		//pusher.send_event()
	}

	useEffect(() => {
		async function fetchData() {
			const userInfo = await bridge.send('VKWebAppGetUserInfo');

			if (DEV_USER_VK_IDS.includes(userInfo.id) && !isVkComPlatform) {
				import("./eruda").then(({ default: eruda }) => {});
			}

			setUser(userInfo);
			const {popular_image_types, user} = await apiInitUser();

			dispatch(setUserDbData(user));
			dispatch(hideAppLoading());
			routeNavigator.showPopout(<ScreenSpinner state='done'  size='large' />);

			setPopularImageTypes(popular_image_types);
			setTimeout(() => routeNavigator.hidePopout(), 1000);
			initSocket(userInfo.id);
		}
		fetchData();
	}, []);

	return (
		<AdaptiveContext.Provider value={
			{
				isMobileSize,
				vkUserInfo,
			}
		}>
		<SplitLayout
			popout={appIsLoading ? <ScreenSpinner style={{backgroundColor: 'var(--vkui--color_background)'}} size='large' /> : routerPopout}
			modal={<ModalRootComponent />}
		>
			{
				(activeView && activePanel) &&
				<SplitCol>
					<Epic
						activeStory={activeView}
						tabbar={<TabBarWrapper />}
					>
						<View id={VIEW_CONSTANTS.VIEW_MAIN} activePanel={activePanel} onSwipeBack={() => routeNavigator.back()}>
							<HomePanel popularImageTypes={popularImageTypes} id={PANEL_CONSTANTS.PANEL_MAIN_HOME} />
						</View>
						<View id={VIEW_CONSTANTS.VIEW_GENERATE_IMAGE} activePanel={activePanel} onSwipeBack={() => routeNavigator.back()}>
							<SelectProfilePanel id={PANEL_CONSTANTS.PANEL_GENERATE_IMAGE_SELECT_PROFILE} />
							<SelectImagePanel id={PANEL_CONSTANTS.PANEL_GENERATE_IMAGE_SELECT_IMAGE} />
							<PreloaderPanel id={PANEL_CONSTANTS.PANEL_GENERATE_IMAGE_PRELOADER} />
						</View>
						<View id={VIEW_CONSTANTS.VIEW_ABOUT} activePanel={activePanel} onSwipeBack={() => routeNavigator.back()}>
							<AboutPanel id={PANEL_CONSTANTS.PANEL_ABOUT_MAIN} />
						</View>
						<View id={VIEW_CONSTANTS.VIEW_MONETIZATION} activePanel={activePanel} onSwipeBack={() => routeNavigator.back()}>
							<WelcomePanel id={PANEL_CONSTANTS.PANEL_MONETIZATION_WELCOME} />
							<ProfilePanel id={PANEL_CONSTANTS.PANEL_MONETIZATION_PROFILE} />
							<GroupListPanel id={PANEL_CONSTANTS.PANEL_MONETIZATION_GROUP_LIST} />
						</View>
						<View id={VIEW_CONSTANTS.VIEW_SHOW_IMAGE} activePanel={activePanel} onSwipeBack={() => routeNavigator.back()}>
							<ShareWallImagePanel id={PANEL_CONSTANTS.PANEL_SHOW_IMAGE_SHARE_WALL} />
							<ShareStoreImagePanel id={PANEL_CONSTANTS.PANEL_SHOW_IMAGE_STORY_WALL} />
							<ShowGeneratedImagePanel id={PANEL_CONSTANTS.PANEL_SHOW_IMAGE_VIEW_RESULT} />
						</View>
					</Epic>
				</SplitCol>
			}
		</SplitLayout>
		</AdaptiveContext.Provider>
	);
}

export default App;
