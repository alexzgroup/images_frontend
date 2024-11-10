import React from "react";
import {ModalTypes} from "../../modals/ModalRoot";
import {Button, ButtonProps} from "@mui/material";
import {useNavigate} from "react-router-dom";


export const ButtonGold = (props: ButtonProps) => {
    const navigate = useNavigate();
    return <Button {...props} onClick={() => navigate(ModalTypes.MODAL_PAY_VOICE)} className="gold_button">
        {props.children}
    </Button>
}
