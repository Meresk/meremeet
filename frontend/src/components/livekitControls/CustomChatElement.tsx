// components/CustomChat.tsx
import React, { useEffect, useRef, useState } from "react";
import { useRoomContext } from "@livekit/components-react";
import SendIcon from '@mui/icons-material/Send';

interface ChatMessage {
    sender: string;
    message: string;
    timestamp: string;
    isLocal: boolean;
}


interface CustomChatProps {
    visible: boolean;
}

export const CustomChat: React.FC<CustomChatProps> = ({ visible }) => {
    const room = useRoomContext();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const messageSoundRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const handleDataReceived = (payload: Uint8Array, ) => {
            const text = new TextDecoder().decode(payload);
            const parsed = JSON.parse(text);
            const isLocal =
                parsed.from === room.localParticipant.identity;
            
            if (parsed.type === "chat-message") {
                setMessages((prev) => [
                    ...prev,
                    {
                        sender: parsed.from ?? "unknown",
                        message: parsed.message,
                        timestamp: new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        }),
                        isLocal,
                    },
                ]);

                if (!isLocal) {
                    messageSoundRef.current
                        ?.play()
                        .catch(() => {});
                }
            }
        };

        room.on("dataReceived", handleDataReceived);
        return () => {
            room.off("dataReceived", handleDataReceived);
        };
    }, [room]);

    const sendMessage = async () => {
        if (input.trim() === "") return;

        const data = JSON.stringify({
            type: "chat-message",
            message: input,
            from: room.localParticipant.identity,
        });

        await room.localParticipant.publishData(
            new TextEncoder().encode(data),
            { reliable: true }
        );

        setMessages((prev) => [
            ...prev,
            {
                sender: room.localParticipant.identity,
                message: input,
                timestamp: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
                isLocal: true,
            },
        ]);

        setInput("");
        inputRef.current?.focus();
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (!visible) return;

        const isMobile = window.matchMedia("(max-width: 1100px)").matches;

        if (!isMobile) {
            const id = setTimeout(() => {
                inputRef.current?.focus();
            }, 100);

            return () => clearTimeout(id);
        }
    }, [visible]);

    useEffect(() => {
        messageSoundRef.current = new Audio("/sounds/chat.mp3");
        messageSoundRef.current.volume = 0.4;
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div
            style={{
                position: "fixed",
                right: 8,
                top: 8,
                bottom: "calc(var(--lk-control-bar-height) + 8px)",
                width: "320px",
                padding: 0,
                backdropFilter: "blur(14px)",
                background: "rgba(20, 20, 20, 0.45)",
                borderRadius: "14px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
                border: "1px solid rgba(255, 255, 255, 0.08)",

                display: "flex",
                flexDirection: "column",
                color: "white",

                transform: visible ? "translateX(0)" : "translateX(110%)",
                opacity: visible ? 1 : 0,
                transition: "transform 0.28s ease, opacity 0.28s ease",

                pointerEvents: visible ? "auto" : "none",
                userSelect: visible ? "auto" : "none",
                zIndex: 9999, 
            }}
        >
            <div
                style={{
                    padding: "12px 16px",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    flexShrink: 0,
                    backdropFilter: "blur(4px)",
                    background: "rgba(0, 0, 0, 0.2)",
                    borderTopLeftRadius: "14px",
                    borderTopRightRadius: "14px",
                }}
            >
                Chat — {messages.length}
            </div>

            <div
                style={{
                    flex: 1,
                    overflowY: "auto",
                    overflowX: "hidden",
                    padding: "12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                }}
            >
                {messages.length === 0 ? (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%",
                            color: "rgba(255, 255, 255, 0.5)",
                            fontSize: "0.9rem",
                        }}
                    >
                        nothing there
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <div
                            key={idx}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                maxWidth: "100%",
                                wordBreak: "break-word",
                                overflowWrap: "break-word",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: "0.8rem",
                                    color: msg.isLocal ? "#38d4b7" : "rgba(255, 255, 255, 0.7)",
                                    marginBottom: "2px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <span
                                    style={{
                                        fontWeight: 400,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        flex: 1,
                                    }}
                                    title={msg.sender}
                                >
                                    {msg.sender}
                                </span>
                                <span style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.5)" }}>
                                    {msg.timestamp}
                                </span>
                            </div>
                            <div
                                style={{
                                    backgroundColor: msg.isLocal
                                        ? "rgba(56, 212, 183, 0.15)"
                                        : "rgba(255, 255, 255, 0.08)",
                                    backdropFilter: "blur(4px)",
                                    padding: "8px 12px",
                                    borderRadius: "10px",
                                    fontSize: "0.9rem",
                                    lineHeight: "1.4",
                                    border: msg.isLocal
                                        ? "1px solid rgba(56, 212, 183, 0.2)"
                                        : "1px solid rgba(255, 255, 255, 0.05)",
                                }}
                            >
                                {msg.message}
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            <div
                style={{
                    padding: "12px",
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                    background: "rgba(0, 0, 0, 0.25)",
                    backdropFilter: "blur(8px)",
                    borderBottomLeftRadius: "14px",
                    borderBottomRightRadius: "14px",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                    }}
                >
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        style={{
                            flex: 1,
                            padding: "10px 14px",
                            border: "none",
                            borderRadius: "10px",
                            background: "rgba(255, 255, 255, 0.07)",
                            backdropFilter: "blur(4px)",
                            color: "#fff",
                            fontSize: "0.9rem",
                            outline: "none",
                            minWidth: 0,
                        }}
                        disabled={!visible}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={input.trim() === ""}
                        style={{
                            width: "40px",
                            height: "40px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: input.trim() 
                                ? "rgba(56, 212, 183, 0.2)" 
                                : "rgba(255, 255, 255, 0.07)",
                            backdropFilter: "blur(4px)",
                            border: input.trim() 
                                ? "1px solid rgba(56, 212, 183, 0.3)" 
                                : "1px solid rgba(255, 255, 255, 0.1)",
                            borderRadius: "10px",
                            color: input.trim() ? "#38d4b7" : "rgba(255, 255, 255, 0.4)",
                            cursor: input.trim() ? "pointer" : "not-allowed",
                            transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                            if (input.trim()) {
                                e.currentTarget.style.background = "rgba(56, 212, 183, 0.3)";
                                e.currentTarget.style.border = "1px solid rgba(56, 212, 183, 0.4)";
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (input.trim()) {
                                e.currentTarget.style.background = "rgba(56, 212, 183, 0.2)";
                                e.currentTarget.style.border = "1px solid rgba(56, 212, 183, 0.3)";
                            }
                        }}
                        aria-label="Send message"
                    >
                        <SendIcon style={{ fontSize: "1.2rem" }} />
                    </button>
                </div>
            </div>
        </div>
    );
};