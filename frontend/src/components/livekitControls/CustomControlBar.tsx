import {
    useRoomContext,
} from "@livekit/components-react";
import {
    Mic,
    MicOff,
    ExitToApp,
    StopScreenShare,
    ScreenShare,
    Chat,
    Fullscreen,
    FullscreenExit, 
    SpeakerNotesOff,
    Group, 
    GroupOff,
    Videocam,
    VideocamOff
} from "@mui/icons-material";
import { IconButton, Tooltip, useTheme, useMediaQuery, Typography } from "@mui/material";
import { startVoiceDetection, stopVoiceDetection } from "../../helpers/voiceDetection";

interface CustomControlBarProps {
    activePanel: 'chat' | 'participants' | null;
    setActivePanel: (panel: 'chat' | 'participants'| null) => void;
    isFullscreen: boolean;
    onFullscreenToggle: (isFullscreen: boolean) => void;
    onLeaveRoom: () => void;
    isOverlay?: boolean;
    timer: number;
    isSpeaking: boolean;
    setIsSpeaking: (v:boolean)=>void;
}

export function CustomControlBar({ 
    activePanel, 
    setActivePanel, 
    isFullscreen, 
    onFullscreenToggle,
    onLeaveRoom,
    isOverlay,
    timer,
    isSpeaking,
    setIsSpeaking,
}: CustomControlBarProps) {
    const room = useRoomContext();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Форматирование времени в HH:MM:SS
    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };


    const togglePanel = (panel: 'chat' | 'participants') => {
        setActivePanel(activePanel === panel ? null : panel);
    };


    // микрофон
    const toggleMic = async () => {
        const micEnabled = room.localParticipant.isMicrophoneEnabled;
        
        try {
            // LiveKit 
            await room.localParticipant.setMicrophoneEnabled(!micEnabled);
            
            // детектор речи
            if (!micEnabled) {
                startVoiceDetection(setIsSpeaking);
            } else {
                stopVoiceDetection(setIsSpeaking);
            }
        } catch (err) {
            console.error("Failed to toggle microphone:", err);
        }
    };


    // трансляция
    const toggleScreen = async () => {
        try {
            const screenShareEnabled = room.localParticipant.isScreenShareEnabled;

            await room.localParticipant.setScreenShareEnabled(!screenShareEnabled, {
                audio: true,
            });

        } catch (err) {
            console.error("Failed to toggle screen share:", err);
        }
    };

    const toggleVideoCam = async () => {
        try {
            const videoCamEnabled = room.localParticipant.isCameraEnabled;

            await room.localParticipant.setCameraEnabled(!videoCamEnabled);

        } catch (err) {
            console.error("Failed to toggle videocam:", err);
        }
    };


    // стрим на полный экран
    const toggleFullscreen = () => {
        const elem = document.documentElement;
        if (!document.fullscreenElement) {
            elem.requestFullscreen().catch((err) => {
                console.error(`Ошибка перехода в полноэкранный режим: ${err.message}`);
            });
            onFullscreenToggle(true);
        } else {
            document.exitFullscreen();
            onFullscreenToggle(false);
        }
    };



    return (
        <div
            style={{
                position: isOverlay ? "static" : "fixed",
                bottom: isOverlay ? undefined : 0,
                left: isOverlay ? undefined : 0,
                width: "100%",
                backgroundColor:"rgba(0, 0, 0, 0.3)",
                padding: isMobile ? '0.5rem' : '1rem',
                zIndex: isOverlay ? 1 : 1000,
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: isMobile ? '0.7rem' : '2rem',
                }}
            >
                {/* Таймер*/}
                <Typography
                    sx={{
                        color: 'white',
                        fontSize: isMobile ? '8px' : '16px',
                        fontWeight: '500',
                        minWidth: isMobile ? '50px' : '60px',
                        textAlign: 'center',
                        fontFamily: 'monospace',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        padding: '4px',
                        borderRadius: '4px',
                    }}
                >
                    {formatTime(timer)}
                </Typography>

                {/* Кнопки управления */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: isMobile ? '0.6rem' : '2rem',
                        alignItems: 'center',
                        flex: 1,
                    }}
                >
                    
                    <div style={{ position: "relative" }}>
                        <Tooltip title={room.localParticipant.isMicrophoneEnabled ? "turn off mic" : "turn on mic"}>
                            <IconButton
                                onClick={toggleMic}
                                color="primary"
                                size={isMobile ? "small" : "medium"}
                            >
                                {room.localParticipant.isMicrophoneEnabled ? <Mic /> : <MicOff />}
                            </IconButton>
                        </Tooltip>

                        {/* Индикатор активности */}
                        {room.localParticipant.isMicrophoneEnabled && (
                            <span
                                style={{
                                    position: "absolute",
                                    bottom: -1,
                                    left: "40%",
                                    width: "20%",
                                    height: 3,
                                    borderRadius: 3,
                                    backgroundColor: isSpeaking ? "rgba(0, 255, 174, 0.69)" : "rgba(255,255,255,0.2)",
                                    transition: "background-color 0.15s",
                                }}
                            />
                        )}
                    </div>

                    <Tooltip title={room.localParticipant.isScreenShareEnabled ? "stop stream" : "start stream"}>
                        <IconButton 
                            onClick={toggleScreen} 
                            color="primary"
                            size={isMobile ? "small" : "medium"}
                        >
                            {room.localParticipant.isScreenShareEnabled ? <ScreenShare /> :  <StopScreenShare />}
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={room.localParticipant.isCameraEnabled ? "stop webcam" : "start webcam"}>
                        <IconButton 
                            onClick={toggleVideoCam} 
                            color="primary"
                            size={isMobile ? "small" : "medium"}
                        >
                            {room.localParticipant.isCameraEnabled ? <Videocam /> :  <VideocamOff />}
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={activePanel === 'chat' ? "hide chat" : "reveal chat"}>
                        <IconButton 
                            onClick={() => togglePanel('chat')} 
                            color="primary"
                            size={isMobile ? "small" : "medium"}
                        >
                            {activePanel === 'chat' ? <Chat /> : <SpeakerNotesOff />}
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={activePanel === 'participants' ? "hide partakers" : "reveal partakers"}>
                        <IconButton 
                            onClick={() => togglePanel('participants')} 
                            color="primary"
                            size={isMobile ? "small" : "medium"}
                        >
                            {activePanel === 'participants' ? <Group /> : <GroupOff />}
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={isFullscreen ? "exit full sceen" : "full sceen"}>
                        <IconButton 
                            onClick={toggleFullscreen} 
                            color="primary"
                            size={isMobile ? "small" : "medium"}
                        >
                            {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                        </IconButton>
                    </Tooltip>
                </div>

                {/* Кнопка выхода справа */}
                <Tooltip title="egress">
                    <IconButton 
                        onClick={onLeaveRoom} 
                        color="error"
                        size={isMobile ? "small" : "medium"}
                        sx={{ minWidth: 'auto' }}
                    >
                        <ExitToApp />
                    </IconButton>
                </Tooltip>
            </div>
        </div>
    );
}