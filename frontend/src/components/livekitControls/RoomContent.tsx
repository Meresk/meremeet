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
    const [isSpeaking, setIsSpeaking] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

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
                    isSpeaking={isSpeaking}
                    setIsSpeaking={setIsSpeaking}
                />
            )}

            {/* Fullscreen overlay button */}
            {isFullscreen && !overlayVisible && (
                <AnimatePresence>
                    {!overlayVisible && isFullscreen && (
                        <motion.button
                        key="showOverlayBtn"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setOverlayVisible(true)}
                        style={{
                            position: "fixed",
                            bottom: 15,
                            right: 15,
                            zIndex: 2000,
                            width: isMobile ? 30 : 50,
                            height: isMobile ? 30 : 50,
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
                            backdropFilter: "blur(4px)",
                        }}
                        >
                        ↑
                        </motion.button>
                    )}
                    </AnimatePresence>
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
                            background: "rgba(0, 0, 0, 0.05)",
                            backdropFilter: "blur(4px)",
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
                                isSpeaking={isSpeaking}
                                setIsSpeaking={setIsSpeaking}
                            />

                            {/* кнопка скрытия панели поверх барa */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                                style={{
                                    position: 'fixed',
                                    bottom: 'calc(100% + 8px)',
                                    right: 15,
                                    zIndex: 2600,
                                }}
                            >
                                <button onClick={() => setOverlayVisible(false)}
                                    style={{
                                        width: isMobile ? 40 : 50,
                                        height: isMobile ? 40 : 50,
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
        [
            { source: Track.Source.ScreenShare, withPlaceholder: false },
            { source: Track.Source.Camera, withPlaceholder: false}
        ],
        { onlySubscribed: false }
    );
    
    // Оставляем только треки с реально включённым видео
    const videoTracks = tracks.filter(
        t => t.publication?.isSubscribed && !t.publication?.isMuted
    );
    
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    //<---------------------------- РАБОЧИЙ КОСТЫЛЬ ---------------------------->
    useEffect(() => {
    // Найти все иконки скриншара и убрать их
        const icons = document.querySelectorAll('.lk-participant-metadata-item svg');
        icons.forEach(icon => {
            if (icon.closest('.lk-participant-metadata-item')?.textContent?.includes("'s screen")) {
                icon.remove();
            }
        });
        
        // Убрать текст "'s screen"
        const names = document.querySelectorAll('.lk-participant-name');
        names.forEach(name => {
            if (name.textContent?.endsWith("'s screen")) {
                name.textContent = name.textContent.replace("'s screen", "");
            }
        });
    }, [tracks]);
    //<---------------------------- РАБОЧИЙ КОСТЫЛЬ ---------------------------->

    return videoTracks.length > 0 ? (
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
    ) : null;
}