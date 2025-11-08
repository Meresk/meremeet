import React, { useState, useEffect } from "react";
import {
    GridLayout,
    LiveKitRoom,
    ParticipantTile,
    RoomAudioRenderer,
    useTracks,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { useParams, useNavigate } from "react-router-dom";
import { Track } from "livekit-client";
import { CustomControlBar } from "../components/livekitControls/CustomControlBar.tsx";
import { CustomChat } from "../components/livekitControls/CustomChat.tsx";
import { ParticipantList } from "../components/livekitControls/ParticipantList.tsx";
import { LIVEKIT_SERVER_URL } from "../config/constants.ts"
import { roomService } from "../services/room/roomService.ts";
import styles from '../styles/RoomPage.module.css';

const RoomPage: React.FC = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const navigate = useNavigate();

    const [token, setToken] = useState<string | null>(null);
    const [userName, setUserName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [inputError, setInputError] = useState(false);

    type ActivePanel = 'chat' | 'participants' | null;
    const [activePanel, setActivePanel] = useState<ActivePanel>(null);
    
    const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    const handleJoinRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        
        setValidationError(null);
        setInputError(false);

        if (!userName.trim()) {
            setInputError(true);
            setValidationError("who are you?");
            return;
        }

        if (!roomId) {
            setValidationError("Room ID is missing");
            return;
        }

        setIsLoading(true);
        
        try {
            const data = await roomService.joinRoom({
                roomname: roomId,
                nickname: userName.trim()
            });
            setToken(data.token);
            
        } catch (error: any) {
            console.error('Failed to join room:', error);
            
            if (error.response?.status === 400) {
                setValidationError("not this room...");
            } else {
                setValidationError("not this room...");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleOnLeave = () => {
        setToken(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserName(e.target.value);
        if (inputError) {
            setInputError(false);
        }
        if (validationError) {
            setValidationError(null);
        }
    };

    if (token) {
        return (
            <LiveKitRoom
                video={true}
                audio={true}
                token={token}
                serverUrl={LIVEKIT_SERVER_URL}
                data-lk-theme="default"
                style={{
                    height: "100vh",
                    display: "flex",
                    flexDirection: "row",
                    overflow: "hidden",
                    position: "relative",
                }}
                onDisconnected={handleOnLeave}
            >
                <MyVideoConference 
                    panelVisible={activePanel} 
                    isFullscreen={isFullscreen}
                />
                <RoomAudioRenderer />

                {!isFullscreen && (
                    <CustomControlBar
                        activePanel={activePanel}
                        setActivePanel={setActivePanel}
                        isFullscreen={isFullscreen}
                        onFullscreenToggle={setIsFullscreen}
                    />
                )}

                <CustomChat visible={activePanel === 'chat'} />
                <ParticipantList visible={activePanel === 'participants'} />
            </LiveKitRoom>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.modal}>
                <form onSubmit={handleJoinRoom} className={styles.form}>
                    {validationError && (
                        <div className={styles.validationError}>
                            {validationError}
                        </div>
                    )}
                    
                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            value={userName}
                            onChange={handleInputChange}
                            placeholder="nick"
                            disabled={isLoading}
                            className={`${styles.input} ${inputError ? styles.inputError : ''}`}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className={styles.submitButton}
                    >
                        {isLoading ? "processing..." : "saltation"}
                    </button>

                    <button 
                        type="button"
                        onClick={() => navigate(-1)}
                        className={styles.backButton}
                    >
                        aster
                    </button>
                </form>
            </div>
        </div>
    );
};

interface MyVideoConferenceProps {
    panelVisible: string | null;
    isFullscreen: boolean;
}

function MyVideoConference({ panelVisible, isFullscreen }: MyVideoConferenceProps) {
    const tracks = useTracks(
        [{ source: Track.Source.ScreenShare, withPlaceholder: false }],
        { onlySubscribed: false }
    );

    return (
        <GridLayout
            tracks={tracks}
            style={{
                height: isFullscreen ? "100vh" : "calc(100vh - var(--lk-control-bar-height))",
                width: panelVisible != null ? "calc(100vw - 300px)" : "100vw",
                marginRight: panelVisible != null ? "300px" : "0",
                transition: "width 0.3s ease-in-out, height 0.3s ease-in-out",
            }}
        >
            <ParticipantTile />
        </GridLayout>
    );
}

export default RoomPage;