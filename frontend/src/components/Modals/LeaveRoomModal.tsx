import { Dialog, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useRef } from "react";

const DarkDialog = styled(Dialog)({
    '& .MuiDialog-paper': {
        backgroundColor: '#1a1a1a',
        color: '#fff',
        borderRadius: '16px',
        padding: '0',
        width: '320px',
        overflow: 'hidden',
    },
    '& .MuiBackdrop-root': {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
});

const DialogHeader = styled('div')({
    textAlign: 'center',
    padding: '32px 24px 24px 24px',
    fontSize: '20px',
    fontWeight: '600',
    color: '#fff',
    borderBottom: '1px solid #333',
});

const DialogFooter = styled('div')({
    display: 'flex',
    height: '60px',
});

const StayButton = styled(Button)({
    flex: 1,
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: '0',
    fontSize: '18px',
    fontWeight: '500',
    textTransform: 'none',
    '&:hover': {
        backgroundColor: '#444',
    },
});

const LeaveButton = styled(Button)({
    flex: 1,
    backgroundColor: '#ff4444',
    color: '#fff',
    borderRadius: '0',
    fontSize: '18px',
    fontWeight: '500',
    textTransform: 'none',
    '&:hover': {
        backgroundColor: '#ff5555',
    },
});

interface LeaveRoomModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function LeaveRoomModal({ open, onClose, onConfirm }: LeaveRoomModalProps) {
    const leaveButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (open && leaveButtonRef.current) {
            // Даем небольшую задержку для корректного фокуса
            const timer = setTimeout(() => {
                leaveButtonRef.current?.focus();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [open]);

    const handleStay = () => {
        onClose();
    };

    const handleLeave = () => {
        onConfirm();
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Escape') {
            event.preventDefault();
            event.stopPropagation();
            handleStay();
        }
    };

    return (
        <DarkDialog 
            open={open} 
            onClose={handleStay}
            onKeyDown={handleKeyDown}
            PaperProps={{
                elevation: 0,
            }}
            aria-labelledby="leave-dialog-title"
            aria-describedby="leave-dialog-description"
        >
            <DialogHeader id="leave-dialog-title">
                go out?
            </DialogHeader>
            
            <DialogFooter>
                <StayButton 
                    onClick={handleStay}
                    onKeyDown={(e) => {
                        if (e.key === 'ArrowRight') {
                            leaveButtonRef.current?.focus();
                            e.preventDefault();
                        }
                    }}
                >
                    stay
                </StayButton>
                <LeaveButton 
                    ref={leaveButtonRef}
                    onClick={handleLeave}
                    onKeyDown={(e) => {
                        if (e.key === 'ArrowLeft') {
                            e.preventDefault();
                            // Перемещаем фокус на кнопку stay
                            const stayButton = e.currentTarget.previousElementSibling as HTMLButtonElement;
                            stayButton?.focus();
                        }
                    }}
                >
                    leave
                </LeaveButton>
            </DialogFooter>
        </DarkDialog>
    );
}