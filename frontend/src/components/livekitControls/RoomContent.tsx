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
import { ParticipantList } from "./ParticipantListElement.tsx";
import { CustomChat } from "./CustomChatElement.tsx";

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

function MyVideoConference({ isFullscreen }: MyVideoConferenceProps) {
    const tracks = useTracks(
        [{ source: Track.Source.ScreenShare, withPlaceholder: false }],
        { onlySubscribed: false }
    );

    return (
        <GridLayout
            tracks={tracks}
            style={{
                height: isFullscreen
                    ? "100vh"
                    : "calc(100vh - var(--lk-control-bar-height))",
                width: "100vw",
                transition: "height 0.3s ease-in-out",
                position: "relative",
            }}
        >
            <ParticipantTile />
        </GridLayout>
    );
}