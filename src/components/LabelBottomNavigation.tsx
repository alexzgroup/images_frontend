import * as React from 'react';
import {useContext, useEffect} from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import {AccountCircleRounded, Apps, Home, Palette} from "@mui/icons-material";
import {AppContext, TAppContext} from "../context/AppContext";
import {useLocation, useNavigate} from 'react-router-dom';

const LabelBottomNavigation = () => {
    const [value, setValue] = React.useState('');
    const {lang} = useContext<TAppContext>(AppContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        if (newValue !== value) {
            navigate(newValue);
        }
    };

    useEffect(() => {
        const path = location.pathname.split("/")[1];
        let value = "";
        switch(path) {
            case "select-sex":
            case "profile":
            case "history":
                value = "profile";
                break;
            case "generate-image":
            case "select-image":
            case "select-image-type":
                value = "select-image-type";
                break;
            case "about":
                value = "about";
                break;
            default:
                value = "";
        }
        setValue(value);
    }, [location]);

    return (
        <BottomNavigation value={value} onChange={handleChange}>
            <BottomNavigationAction
                label={lang.HEADERS.MAIN_PANEL}
                value=""
                icon={<Home/>}
            />
            <BottomNavigationAction
                label={lang.HEADERS.VIEW_GENERATE}
                value="select-image-type"
                icon={<Palette />}
            />
            <BottomNavigationAction
                label={lang.HEADERS.PROFILE_PANEL}
                value="profile"
                icon={<AccountCircleRounded />}
            />
            <BottomNavigationAction
                label={lang.DESCRIPTIONS.ABOUT_AS}
                value="about"
                icon={<Apps />} />
        </BottomNavigation>
    );
}

export default React.memo(LabelBottomNavigation);
