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
    GroupOff
} from "@mui/icons-material";
import { IconButton, Tooltip, useTheme, useMediaQuery, Box } from "@mui/material";
import { useState, useEffect } from "react";

interface CustomControlBarProps {
    activePanel: 'chat' | 'participants' | null;
    setActivePanel: (panel: 'chat' | 'participants'| null) => void;
    isFullscreen: boolean;
    onFullscreenToggle: (isFullscreen: boolean) => void;
    onLeaveRoom: () => void;
}

export function CustomControlBar({ 
    activePanel, 
    setActivePanel, 
    isFullscreen, 
    onFullscreenToggle,
    onLeaveRoom
}: CustomControlBarProps) {
    const room = useRoomContext();
    const [micEnabled, setMicEnabled] = useState(false);
    const [screenEnabled, setScreenEnabled] = useState(false);
    const [timer, setTimer] = useState(0);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Таймер
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(prev => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

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

    const toggleMic = () => {
        room.localParticipant.setMicrophoneEnabled(!micEnabled);
        setMicEnabled(!micEnabled);
    };

    const toggleScreen = async () => {
        await room.localParticipant.setScreenShareEnabled(!screenEnabled);
        setScreenEnabled(!screenEnabled);
    };

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
                position: 'fixed',
                bottom: 0,
                left: 0,
                width: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0)',
                padding: isMobile ? '0.5rem' : '1rem',
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: isMobile ? '0.75rem' : '2rem',
                }}
            >
                {/* Таймер*/}
                <Box
                    sx={{
                        color: 'white',
                        fontSize: isMobile ? '14px' : '16px',
                        fontWeight: '500',
                        minWidth: isMobile ? '50px' : '60px',
                        textAlign: 'center',
                        fontFamily: 'monospace',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        padding: '4px 8px',
                        borderRadius: '4px',
                    }}
                >
                    {formatTime(timer)}
                </Box>

                {/* Кнопки управления */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: isMobile ? '0.75rem' : '2rem',
                        alignItems: 'center',
                        flex: 1,
                    }}
                >
                    <Tooltip title={micEnabled ? "Выключить микрофон" : "Включить микрофон"}>
                        <IconButton 
                            onClick={toggleMic} 
                            color="primary"
                            size={isMobile ? "small" : "medium"}
                        >
                            {micEnabled ? <Mic /> : <MicOff />}
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={screenEnabled ? "Остановить демонстрацию экрана" : "Поделиться экраном"}>
                        <IconButton 
                            onClick={toggleScreen} 
                            color="primary"
                            size={isMobile ? "small" : "medium"}
                        >
                            {screenEnabled ? <ScreenShare /> :  <StopScreenShare />}
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={activePanel === 'chat' ? "Скрыть чат" : "Показать чат"}>
                        <IconButton 
                            onClick={() => togglePanel('chat')} 
                            color="primary"
                            size={isMobile ? "small" : "medium"}
                        >
                            {activePanel === 'chat' ? <Chat /> : <SpeakerNotesOff />}
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={activePanel === 'participants' ? "Скрыть участников" : "Показать участников"}>
                        <IconButton 
                            onClick={() => togglePanel('participants')} 
                            color="primary"
                            size={isMobile ? "small" : "medium"}
                        >
                            {activePanel === 'participants' ? <Group /> : <GroupOff />}
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={isFullscreen ? "Выход из полного экрана" : "Полный экран"}>
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
                <Tooltip title="Покинуть комнату">
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