import React, {useEffect} from "react";
import {Box, Modal, Paper, Popover} from "@mui/material";
import { useModalStore } from "../../../store/ModalStore.js";
import { useTranslation } from "react-i18next";
import { usePlayersStore } from "../../../store/PlayersStore.js";

export const AssetModal = () => {
    const {asset } = useModalStore();
    const {characterSelectFinished} = usePlayersStore();
    const {t} = useTranslation();


    return (
        <>
            {characterSelectFinished && (
                <Box
                    sx={{
                        position: 'absolute',
                        left: '3%',
                        top: '3%',
                        zIndex: 1300,
                        width: '200px',
                        height: '100px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 1)',
                        boxShadow: 24,
                        padding: 2,
                        borderRadius: 2,
                    }}
                >
                    {t('ui.asset')} : <span style={{ color: 'red' }}> {asset.toLocaleString()} </span>
                </Box>
            )}

            {/*<Popover*/}
            {/*    open={isQuizModalOpen}*/}

            {/*    sx={{*/}
            {/*        display: "fixed",*/}
            {/*        width: "300px",*/}
            {/*        height: "200px",*/}
            {/*        alignItems: "center",*/}
            {/*        justifyContent: "center",*/}
            {/*    }}*/}
            {/*>*/}
            {/*    <Paper sx={{ padding: "16px", textAlign: "center" }}>*/}
            {/*        현재 내 자산 : <span style={{ color: 'red' }}>{asset.toLocaleString()}</span>*/}
            {/*    </Paper>*/}
            {/*</Popover>*/}
        </>
    )
}

