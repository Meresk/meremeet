import React, { useState } from "react";
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
import { ParticipantList } from "./ParticipantList.tsx";
import { CustomChat } from "./CustomChat.tsx";

interface RoomContentProps {
    isFullscreen: boolean;
    onFullscreenToggle: (isFullscreen: boolean) => void;
}

export const RoomContent: React.FC<RoomContentProps> = ({ 
    isFullscreen, 
    onFullscreenToggle 
}) => {
    const room = useRoomContext();
    const [activePanel, setActivePanel] = useState<'chat' | 'participants' | null>(null);
    const [confirmLeaveRoomModalOpen, setConfirmLeaveRoomModalOpen] = useState(false);

    return (
        <>
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
                    onFullscreenToggle={onFullscreenToggle}
                    onLeaveRoom={() => setConfirmLeaveRoomModalOpen(true)}
                />
            )}

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