import React from "react";
import { useParticipants } from "@livekit/components-react";
import { Person } from "@mui/icons-material";

interface ParticipantListProps {
    visible: boolean;
}

export const ParticipantList: React.FC<ParticipantListProps> = ({ visible }) => {
    const participants = useParticipants();

    return (
        <div
            style={{
                position: "absolute",
                right: 0,
                top: 8,
                bottom: "calc(var(--lk-control-bar-height) + 8px)",
                width: "170px",
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
                }}
            >
                Участники — {participants.length}
            </div>

            <div
                style={{
                    flex: 1,
                    overflowY: "auto",
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

                            // мягкие карточки в стиле FaceTime / macOS
                            background: "rgba(255, 255, 255, 0.05)",
                            backdropFilter: "blur(4px)",

                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                        }}
                    >
                        <Person style={{ color: "#38d474", opacity: 0.9 }} />
                        <span>{p.identity}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
