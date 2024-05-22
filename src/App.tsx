import React, {useEffect, useState} from 'react';
import bridge, {GetLaunchParamsResponse, UserInfo} from '@vkontakte/vk-bridge';
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
import {imageType, socketImageType, socketSubscribeType} from "./types/ApiTypes";
import {setUserDbData, setUserSubscribeStatus, setVkHasProfileButton} from "./redux/slice/UserSlice";
import GroupListPanel from "./panels/monetization/GroupListPanel";
import PreloaderPanel from "./panels/generate_images/PreloaderPanel";
import {setGenerateImageId} from "./redux/slice/ImageSlice";
import ShareWallImagePanel from "./panels/show_generate_image/ShareWallImagePanel";
import ShareStoreImagePanel from "./panels/show_generate_image/ShareStoreImagePanel";
import ShowGeneratedImagePanel from "./panels/show_generate_image/ShowGeneratedImagePanel";
import {publish} from "./Events/CustomEvents";
import OfflinePanel from "./panels/service/OfflinePanel";
import SelectImageNamePanel from "./panels/generate_images/SelectImageNamePanel";
import SelectImageZodiacPanel from "./panels/generate_images/SelectImageZodiacPanel";
import FriendsPanel from "./panels/friends/FriendsPanel";
import ProfileInfoPanel from "./panels/profile/ProfileInfoPanel";
import ProfileHistoryGeneratePanel from "./panels/profile/ProfileHistoryGeneratePanel";
import FriendPanel from "./panels/friends/FriendPanel";

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
			.listen('.image_generate.success', (e: socketImageType) => {
				if (e.data.status) {
					dispatch(setGenerateImageId(e.data.id))
					routeNavigator.showModal(ModalTypes.MODAL_GENERATED_IMAGE);
				}
			})
			.listen('.subscribe_group', (e: socketSubscribeType) => {
				dispatch(setUserSubscribeStatus(e.data.subscribe))
				if (e.data.subscribe) {
					publish('USER_SUBSCRIBE', {total: 1});
					routeNavigator.showModal(ModalTypes.MODAL_SUBSCRIBE_GROUP);
				} else {
					publish('USER_UNSUBSCRIBE', {total: -1});
					routeNavigator.showModal(ModalTypes.MODAL_UNSUBSCRIBE_GROUP);
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

			const launchParams: GetLaunchParamsResponse & {
				vk_has_profile_button?: number,
				vk_profile_id?: number,
			} = await bridge.send('VKWebAppGetLaunchParams');

			if (launchParams.vk_ref === 'third_party_profile_buttons' && launchParams.vk_profile_id) {
				routeNavigator.replace('/friend/' + launchParams.vk_profile_id)
			}

			dispatch(setUserDbData(user));
			dispatch(hideAppLoading());
			dispatch(setVkHasProfileButton(Number(launchParams.vk_has_profile_button)))

			routeNavigator.showPopout(<ScreenSpinner state='done'  size='large' />);

			setPopularImageTypes(popular_image_types);
			setTimeout(() => routeNavigator.hidePopout(), 1000);
			initSocket(userInfo.id);
		}
		fetchData();

		window.addEventListener("offline", function () {
			routeNavigator.push('/offline');
		});

		window.addEventListener("online", function () {
			routeNavigator.back();
		});
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
						tabbar={activePanel !== PANEL_CONSTANTS.PANEL_SERVICE_OFFLINE && <TabBarWrapper />}
					>
						<View id={VIEW_CONSTANTS.VIEW_MAIN} activePanel={activePanel} onSwipeBack={() => routeNavigator.back()}>
							<HomePanel popularImageTypes={popularImageTypes} id={PANEL_CONSTANTS.PANEL_MAIN_HOME} />
						</View>
						<View id={VIEW_CONSTANTS.VIEW_GENERATE_IMAGE} activePanel={activePanel} onSwipeBack={() => routeNavigator.back()}>
							<SelectProfilePanel id={PANEL_CONSTANTS.PANEL_GENERATE_IMAGE_SELECT_PROFILE} />
							<SelectImagePanel id={PANEL_CONSTANTS.PANEL_GENERATE_IMAGE_SELECT_IMAGE} />
							<SelectImageNamePanel id={PANEL_CONSTANTS.PANEL_GENERATE_IMAGE_NAME_SELECT_IMAGE} />
							<SelectImageZodiacPanel id={PANEL_CONSTANTS.PANEL_GENERATE_IMAGE_ZODIAC_SELECT_IMAGE} />
							<PreloaderPanel id={PANEL_CONSTANTS.PANEL_GENERATE_IMAGE_PRELOADER} />
						</View>
						<View id={VIEW_CONSTANTS.VIEW_FRIENDS} activePanel={activePanel} onSwipeBack={() => routeNavigator.back()}>
							<FriendsPanel id={PANEL_CONSTANTS.PANEL_FRIENDS} />
							<FriendPanel id={PANEL_CONSTANTS.PANEL_FRIEND} />
						</View>
						<View id={VIEW_CONSTANTS.VIEW_PROFILE} activePanel={activePanel} onSwipeBack={() => routeNavigator.back()}>
							<ProfileInfoPanel id={PANEL_CONSTANTS.PANEL_PROFILE_INFO} />
							<ProfileHistoryGeneratePanel id={PANEL_CONSTANTS.PANEL_PROFILE_HISTORY_GENERATE} />
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
						<View id={VIEW_CONSTANTS.VIEW_SERVICE} activePanel={activePanel}>
							<OfflinePanel id={PANEL_CONSTANTS.PANEL_SERVICE_OFFLINE} />
						</View>
					</Epic>
				</SplitCol>
			}
		</SplitLayout>
		</AdaptiveContext.Provider>
	);
}

export default App;
