import React, {useContext} from "react";
import {AppContext, TAppContext} from "../../context/AppContext";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {TransitionBottom} from "../../helpers/Transitions";
import {Box} from "@mui/material";
import {common} from "@mui/material/colors";

export default function AlertDialogVipBy() {
    const {lang} = useContext<TAppContext>(AppContext);
    const [open, setOpen] = React.useState(true);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Dialog
                open={open}
                TransitionComponent={TransitionBottom}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <Box sx={{background: 'var(--black_gradient)'}}>
                    <DialogTitle className="golden_text">{lang.MODALS.CONGRATULATE}</DialogTitle>
                    <DialogContent dividers className="golden_text">
                        <DialogContentText marginBottom={1} id="alert-dialog-slide-description">
                            {lang.MODALS.CONGRATULATE_VIP}
                        </DialogContentText>
                        <DialogContentText id="alert-dialog-slide-description">
                            {lang.DESCRIPTIONS.VIP_MODAL_MOTIVATION}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button sx={{color: common.white}} onClick={handleClose}>{lang.MODALS.CLOSE}</Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </React.Fragment>
    );
}
