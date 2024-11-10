import React, {createContext, useContext, useState} from "react";

export interface IModalContext {
    modal?: React.ReactNode;
    setModal: (arg0: React.ReactNode) => void;
}

export const ModalContext = createContext<IModalContext>({
    setModal: (arg0: React.ReactNode) => null,
});

export const ModalProvider = ({children,}: { children: React.ReactNode}) => {
    const [modal, setModal] = useState<React.ReactNode | null>(null);

    return (
        <ModalContext.Provider value={{
            modal,
            setModal,
        }}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModalPage = () => useContext(ModalContext);
