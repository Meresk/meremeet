import React, { useEffect, useRef } from "react";
import { useParticipants, useRoomContext } from "@livekit/components-react";
import { Person } from "@mui/icons-material";

interface ParticipantListProps {
    visible: boolean;
}

export const ParticipantList: React.FC<ParticipantListProps> = ({ visible }) => {
    const participants = useParticipants();
    const room = useRoomContext();

    const joinSoundRef = useRef<HTMLAudioElement | null>(null);
    const leaveSoundRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        joinSoundRef.current = new Audio("/sounds/user-join.mp3");
        joinSoundRef.current.volume = 0.4;
        joinSoundRef.current.load();

        leaveSoundRef.current = new Audio("/sounds/user-leave.mp3");
        leaveSoundRef.current.volume = 0.3;
        leaveSoundRef.current.load();
    }, []);

    // Звук входа участника
    useEffect(() => {
        const handleParticipantConnected = () => {
            joinSoundRef.current
                ?.play()
                .catch(() => {});
        };

        room.on("participantConnected", handleParticipantConnected);

        return () => {
            room.off("participantConnected", handleParticipantConnected);
        };
    }, [room]);

    // Звук выхода участника
    useEffect(() => {
        const handleParticipantDisconnected = () => {
            leaveSoundRef.current?.play().catch(() => {});
        };

        room.on("participantDisconnected", handleParticipantDisconnected);

        return () => {
            room.off("participantDisconnected", handleParticipantDisconnected);
        };
    }, [room]);

    return (
        <div
            style={{
                position: "absolute",
                right: 0,
                top: 8,
                bottom: "calc(var(--lk-control-bar-height) + 8px)",
                width: "200px",
                padding: "0",
                backdropFilter: "blur(14px)",
                background: "rgba(20, 20, 20, 0.45)",
                borderRadius: "14px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.35)",

                display: "flex",
                flexDirection: "column",
                color: "white",

                transform: visible ? "translateX(0)" : "translateX(110%)",
                opacity: visible ? 1 : 0,
                transition: "transform 0.28s ease, opacity 0.28s ease",

                pointerEvents: visible ? "auto" : "none",
                zIndex: 10,
            }}
        >
            <div
                style={{
                    padding: "12px 16px",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    flexShrink: 0,
                }}
            >
                Partakers — {participants.length}
            </div>

            <div
                style={{
                    flex: 1,
                    overflowY: "auto",
                    overflowX: "hidden",
                    padding: "10px 0",
                }}
            >
                {participants.map((p) => (
                    <div
                        key={p.sid}
                        style={{
                            padding: "10px 14px",
                            margin: "4px 10px",
                            borderRadius: "10px",

                            background: "rgba(255, 255, 255, 0.05)",
                            backdropFilter: "blur(4px)",

                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            minWidth: 0,
                        }}
                    >
                        <Person style={{ color: "#38d4b7ff", opacity: 0.9 }} />
                        <span
                            style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                minWidth: 0, 
                                flex: 1, 
                            }}
                            title={p.identity} 
                        >
                            {p.identity}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
