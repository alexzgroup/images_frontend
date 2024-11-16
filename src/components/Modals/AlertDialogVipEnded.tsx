import React, {useContext, useEffect} from "react";
import {AppContext, TAppContext} from "../../context/AppContext";
import {useModalPage} from "../../context/ModalProvider";
import {useDispatch} from "react-redux";
import VipFullPageModal from "./VipFullPageModal";
import {setUserVip} from "../../redux/slice/UserSlice";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {TransitionBottom} from "../../helpers/Transitions";

export default function AlertDialogVipEnded() {
    const {lang} = useContext<TAppContext>(AppContext);
    const [open, setOpen] = React.useState(true);
    const {setModal} = useModalPage();
    const dispatch = useDispatch();

    const handleBy = () => {
        setModal(<VipFullPageModal />);
        setOpen(false);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (!open) {
            dispatch(setUserVip({is_vip: false}));
        }
    }, [open]);

    return (
        <React.Fragment>
            <Dialog
                open={open}
                TransitionComponent={TransitionBottom}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{lang.ALERT.WARNING}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {lang.ALERT.VIP_ENDED}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{lang.MODALS.CLOSE}</Button>
                    <Button onClick={handleBy}>{lang.MODALS.BY}</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
