import {createHashRouter} from "@vkontakte/vk-mini-apps-router";
import {PANEL_CONSTANTS, VIEW_CONSTANTS} from "../constants/RouterConstants";

const AppRouter = createHashRouter([
    {
        path: '/',
        panel: PANEL_CONSTANTS.PANEL_MAIN_HOME,
        view: VIEW_CONSTANTS.VIEW_MAIN,
    },
    {
        path: '/generate',
        panel: PANEL_CONSTANTS.PANEL_GENERATE_IMAGE_SELECT_PROFILE,
        view: VIEW_CONSTANTS.VIEW_GENERATE_IMAGE,
    },
    {
        path: '/generate/select-image/:imageTypeId',
        panel: PANEL_CONSTANTS.PANEL_GENERATE_IMAGE_SELECT_IMAGE,
        view: VIEW_CONSTANTS.VIEW_GENERATE_IMAGE,
    },
    {
        path: '/generate/show-image',
        panel: PANEL_CONSTANTS.PANEL_GENERATE_IMAGE_SHOW_GENERATED_IMAGE,
        view: VIEW_CONSTANTS.VIEW_GENERATE_IMAGE,
    },
    {
        path: '/about',
        panel: PANEL_CONSTANTS.PANEL_ABOUT_MAIN,
        view: VIEW_CONSTANTS.VIEW_ABOUT,
    },
    {
        path: '/monetization',
        panel: PANEL_CONSTANTS.PANEL_MONETIZATION_WELCOME,
        view: VIEW_CONSTANTS.VIEW_MONETIZATION,
    },
    {
        path: '/monetization/profile',
        panel: PANEL_CONSTANTS.PANEL_MONETIZATION_PROFILE,
        view: VIEW_CONSTANTS.VIEW_MONETIZATION,
    },
]);

export default AppRouter;
