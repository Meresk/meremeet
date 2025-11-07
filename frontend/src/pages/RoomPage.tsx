import React, { useState } from "react";
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
import styles from '../styles/RoomPage.module.css';

const RoomPage: React.FC = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const navigate = useNavigate();

    const [token, setToken] = useState<string | null>(null);
    const [userName, setUserName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);

    // Управление видимостью чата
    type ActivePanel = 'chat' | 'participants' | null;
    const [activePanel, setActivePanel] = useState<ActivePanel>(null);

    const handleJoinRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!userName.trim()) {
            setHasError(true);
            return;
        }

        if (!roomId) {
            setHasError(true);
            return;
        }

        setIsLoading(true);
        setHasError(false);

        try {
            const response = await fetch('http://127.0.0.1:3000/api/room/join', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    roomname: roomId,
                    nickname: userName.trim()
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Ошибка сервера: ${response.status}`);
            }

            const data = await response.json();
            setToken(data.token);
            
        } catch (error) {
            console.error('Failed to get token:', error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOnLeave = () => {
        navigate(-1);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserName(e.target.value);
        if (hasError) {
            setHasError(false);
        }
    };

    // Если токен получен, показываем видео-комнату
    if (token) {
        return (
            <LiveKitRoom
                video={false}
                audio={false}
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
                <MyVideoConference panelVisible={activePanel} />
                <RoomAudioRenderer />

                <div style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    zIndex: 10,
                    backgroundColor: "rgba(0,0,0,0.7)"
                }}>
                    <CustomControlBar
                        activePanel={activePanel}
                        setActivePanel={setActivePanel}
                    />
                </div>

                <CustomChat visible={activePanel === 'chat'} />
                <ParticipantList visible={activePanel === 'participants'} />
            </LiveKitRoom>
        );
    }

    // Иначе показываем экран входа
    return (
        <div className={styles.container}>
            <div className={styles.modal}>
                <form onSubmit={handleJoinRoom} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            value={userName}
                            onChange={handleInputChange}
                            placeholder="nick"
                            disabled={isLoading}
                            className={`${styles.input} ${hasError ? styles.inputError : ''}`}
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
}

function MyVideoConference({ panelVisible }: MyVideoConferenceProps) {
    const tracks = useTracks(
        [{ source: Track.Source.ScreenShare, withPlaceholder: false }],
        { onlySubscribed: false }
    );

    return (
        <GridLayout
            tracks={tracks}
            style={{
                height: "calc(100vh - var(--lk-control-bar-height))",
                width: panelVisible != null ? "calc(100vw - 300px)" : "100vw",
                marginRight: panelVisible != null ? "300px" : "0",
                transition: "width 0.3s ease-in-out",
            }}
        >
            <ParticipantTile />
        </GridLayout>
    );
}

export default RoomPage;