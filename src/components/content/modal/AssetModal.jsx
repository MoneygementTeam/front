import {usePlayersStore} from "../../../store/PlayersStore.js";
import React, {useEffect} from "react";
import {Box, Modal, Paper, Popover} from "@mui/material";

export const AssetModal = () => {
    const {asset, isModalOpen} = usePlayersStore();


    return (
        <>
            {isModalOpen && (
                <Box
                    sx={{
                        position: 'fixed',
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
                    자산 : <span style={{ color: 'red' }}> {asset.toLocaleString()} </span>
                </Box>
            )}

            {/*<Popover*/}
            {/*    open={isModalOpen}*/}

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

