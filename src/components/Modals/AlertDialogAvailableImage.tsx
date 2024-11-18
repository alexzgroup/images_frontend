import React, {useContext} from "react";
import {AppContext, TAppContext} from "../../context/AppContext";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {TAvailableImageLimit} from "../../types/ApiTypes";
import {useSelector} from "react-redux";
import {RootStateType} from "../../redux/store/ConfigureStore";
import {ReduxSliceUserInterface} from "../../redux/slice/UserSlice";
import VipFullPageModal from "./VipFullPageModal";
import {useModalPage} from "../../context/ModalProvider";
import {useNavigate} from "react-router-dom";
import {AdsGramController} from "../../libs/AdsGram";

export default function AlertDialogAvailableImage({available_image_limit}: {available_image_limit: TAvailableImageLimit}) {
    const {lang} = useContext<TAppContext>(AppContext);
    const {userDbData} = useSelector<RootStateType, ReduxSliceUserInterface>(state => state.user)
    const {setModal} = useModalPage();
    const navigate = useNavigate();

    const handleClose = () => {
        return null;
    };

    const handleAds = () => {
        AdsGramController().show().then((result) => {
            // user watch ad till the end
            // your code to reward user
            console.log('ADS success', result);
            navigate('select-image-type');
        }).catch((result) => {
            // user get error during playing ad or skip ad
            // do nothing or whatever you want
            console.log('ADS error', result);
        })
    }

    return (
        <React.Fragment>
            <Dialog
                open={true}
                onClose={handleClose}
                disableEscapeKeyDown={true}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {lang.ALERT.WARNING}
                </DialogTitle>
                <DialogContent>
                    {
                        available_image_limit.available_images === 0 &&
                            <>
                                <DialogContentText id="alert-dialog-description">
                                    {lang.DESCRIPTIONS.SELECT_IMAGE_PANEL_AVAILABLE_IMAGES} 0
                                </DialogContentText>
                                <DialogContentText id="alert-dialog-description">
                                    {lang.DESCRIPTIONS.SELECT_IMAGE_NAME_PANEL_RETURN_TOMORROW}
                                </DialogContentText>
                            </>
                    }
                    {
                        (available_image_limit.available_images > 0 && !available_image_limit.nex_free_image_available && !userDbData?.is_vip) &&
                        <>
                            <DialogContentText id="alert-dialog-description">
                                {lang.DESCRIPTIONS.GO_VIEW_ADS}
                            </DialogContentText>
                        </>
                    }
                </DialogContent>
                <DialogActions>
                    {
                        (available_image_limit.available_images === 0 && !userDbData?.is_vip) &&
                            <Button onClick={() => setModal(<VipFullPageModal />)}>
                                {lang.BUTTONS.VIP_MODAL_GET}
                            </Button>
                    }
                    {
                        (available_image_limit.available_images === 0 && !!userDbData?.is_vip) &&
                            <Button onClick={() => navigate('profile')}>
                                {lang.MODALS.CLOSE}
                            </Button>
                    }
                    {
                        (!available_image_limit.nex_free_image_available && !userDbData?.is_vip) &&
                            <Button onClick={handleAds}>
                                {lang.BUTTONS.VIEW_ADVERT}
                            </Button>
                    }
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
