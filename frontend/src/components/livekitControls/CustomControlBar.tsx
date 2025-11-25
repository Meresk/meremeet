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
import { IconButton, Tooltip, useTheme, useMediaQuery, Typography } from "@mui/material";
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
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
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


    // микрофон
    const toggleMic = () => {
        room.localParticipant.setMicrophoneEnabled(!micEnabled);
        setMicEnabled(!micEnabled);

        if (!micEnabled) {
            startVoiceDetection();
        } else {
            stopVoiceDetection();
        }
    };


    // трансляция
    const toggleScreen = async () => {
        try {
            await room.localParticipant.setScreenShareEnabled(!screenEnabled, {
                audio: true,
            });

            setScreenEnabled(!screenEnabled);
        } catch (err) {
            console.error("Failed to toggle screen share:", err);
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


    // индикатор голоса
    const startVoiceDetection = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setAudioStream(stream);

            const audioContext = new AudioContext();
            const source = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 512;

            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            source.connect(analyser);

            const checkVolume = () => {
                analyser.getByteFrequencyData(dataArray);

                // Средний уровень громкости
                const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

                const speaking = avg > 20;

                setIsSpeaking(speaking);

                requestAnimationFrame(checkVolume);
            };

            checkVolume();
        } catch (err) {
            console.error("Ошибка доступа к микрофону:", err);
        }
    };
    const stopVoiceDetection = () => {
        if (audioStream) {
            audioStream.getTracks().forEach(t => t.stop());
            setAudioStream(null);
            setIsSpeaking(false);
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
                    gap: isMobile ? '0.7rem' : '2rem',
                }}
            >
                {/* Таймер*/}
                <Typography
                    sx={{
                        color: 'white',
                        fontSize: isMobile ? '11px' : '16px',
                        fontWeight: '500',
                        minWidth: isMobile ? '60px' : '60px',
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
                        gap: isMobile ? '0.9rem' : '2rem',
                        alignItems: 'center',
                        flex: 1,
                    }}
                >
                    
                    <div style={{ position: "relative" }}>
                        <Tooltip title={micEnabled ? "turn off mic" : "turn on mic"}>
                            <IconButton
                                onClick={toggleMic}
                                color="primary"
                                size={isMobile ? "small" : "medium"}
                            >
                                {micEnabled ? <Mic /> : <MicOff />}
                            </IconButton>
                        </Tooltip>

                        {/* Индикатор активности */}
                        {micEnabled && (
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

                    <Tooltip title={screenEnabled ? "stop stream" : "start stream"}>
                        <IconButton 
                            onClick={toggleScreen} 
                            color="primary"
                            size={isMobile ? "small" : "medium"}
                        >
                            {screenEnabled ? <ScreenShare /> :  <StopScreenShare />}
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