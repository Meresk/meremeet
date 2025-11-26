import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    GridLayout,
    ParticipantTile,
    RoomAudioRenderer,
    useRoomContext,
    useTracks,
} from "@livekit/components-react";
import { Track } from "livekit-client";

import { LeaveRoomModal } from "../Modals/LeaveRoomModal";
import { CustomControlBar } from "./CustomControlBar.tsx";
import { ParticipantList } from "./ParticipantListElement.tsx";
import { CustomChat } from "./CustomChatElement.tsx";
import { useMediaQuery, useTheme } from "@mui/material";

interface RoomContentProps {
    isFullscreen: boolean;
    onFullscreenToggle: (isFullscreen: boolean) => void;
}

export const RoomContent: React.FC<RoomContentProps> = ({
    isFullscreen,
    onFullscreenToggle,
}) => {
    const room = useRoomContext();
    const [activePanel, setActivePanel] = useState<'chat' | 'participants' | null>(null);
    const [confirmLeaveRoomModalOpen, setConfirmLeaveRoomModalOpen] = useState(false);
    const [overlayVisible, setOverlayVisible] = useState(false);

    // Таймер на уровне RoomContent
    const [timer, setTimer] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => setTimer(prev => prev + 1), 1000);
        return () => clearInterval(interval);
    }, []);


    return (
        <>
            <MyVideoConference panelVisible={activePanel} isFullscreen={isFullscreen} />
            <RoomAudioRenderer />

            {/* ControlBar вне fullscreen */}
            {!isFullscreen && (
                <CustomControlBar 
                    activePanel={activePanel}
                    setActivePanel={setActivePanel}
                    isFullscreen={isFullscreen}
                    onFullscreenToggle={onFullscreenToggle}
                    onLeaveRoom={() => setConfirmLeaveRoomModalOpen(true)}
                    timer={timer}
                />
            )}

            {/* Fullscreen overlay button */}
            {isFullscreen && !overlayVisible && (
                <button
                    onClick={() => setOverlayVisible(true)}
                    style={{
                        position: "fixed",
                        bottom: 20,
                        right: 20,
                        zIndex: 2000,
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        border: "none",
                        background: "rgba(255, 255, 255, 0.07)",
                        color: "white",
                        fontSize: "20px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backdropFilter: "blur(4px)",
                    }}
                >
                    ↑
                </button>
            )}

            {/* Fullscreen overlay panel*/}
            <AnimatePresence>
                {isFullscreen && overlayVisible && (
                    <motion.div
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "100%", opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            position: "fixed",
                            bottom: 0,
                            left: 0,
                            width: "100%",
                            background: "rgba(0, 0, 0, 0.09)",
                            backdropFilter: "blur(6px)",
                            zIndex: 2500,
                        }}
                    >
                        <div style={{ position: "relative" }}>
                            <CustomControlBar
                                activePanel={activePanel}
                                setActivePanel={setActivePanel}
                                isFullscreen={isFullscreen}
                                onFullscreenToggle={onFullscreenToggle}
                                onLeaveRoom={() => setConfirmLeaveRoomModalOpen(true)}
                                isOverlay={true}
                                timer={timer}
                            />

                            {/* кнопка скрытия панели поверх барa */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    position: 'fixed',
                                    bottom: 'calc(100% + 8px)',
                                    right: 20,
                                    zIndex: 2600,
                                }}
                                >
                                <button onClick={() => setOverlayVisible(false)}
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: "50%",
                                        border: "none",
                                        background: "rgba(0, 0, 0, 0.27)",
                                        color: "white",
                                        fontSize: "20px",
                                        fontWeight: "bold",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backdropFilter: "blur(6px)",
                                    }}
                                >
                                    ↓
                                </button>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <CustomChat visible={activePanel === 'chat'} />
            <ParticipantList visible={activePanel === 'participants'} />

            <LeaveRoomModal
                open={confirmLeaveRoomModalOpen}
                onClose={() => setConfirmLeaveRoomModalOpen(false)}
                onConfirm={() => {
                    room.disconnect();
                    setConfirmLeaveRoomModalOpen(false);
                }}
            />
        </>
    );
};

interface MyVideoConferenceProps {
    panelVisible: string | null;
    isFullscreen: boolean;
}

function MyVideoConference({ isFullscreen }: MyVideoConferenceProps) {
    const tracks = useTracks(
        [{ source: Track.Source.ScreenShare, withPlaceholder: false }],
        { onlySubscribed: false }
    );
    
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <GridLayout
            tracks={tracks}
            style={{
                height: isFullscreen
                    ? "100vh"
                    : `calc(100vh - ${isMobile ? '40px' : '60px'})`,
                width: "100vw",
                transition: "height 0.3s ease-in-out",
                position: "relative",
            }}
        >
            <ParticipantTile />
        </GridLayout>
    );
}