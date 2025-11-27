// voiceDetection.ts
let audioStream: MediaStream | null = null;
let audioContext: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let rafId: number | null = null;

export function startVoiceDetection(setIsSpeaking: (v: boolean) => void) {
    if (rafId) return; // уже запущено
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            audioStream = stream;
            audioContext = new AudioContext();
            const source = audioContext.createMediaStreamSource(stream);
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            source.connect(analyser);

            const data = new Uint8Array(analyser.frequencyBinCount);

            const loop = () => {
                if (!analyser) return;
                analyser.getByteFrequencyData(data);
                const avg = data.reduce((a,b) => a+b,0)/data.length;
                setIsSpeaking(avg>15);
                rafId = requestAnimationFrame(loop);
            };
            loop();
        })
        .catch(err => {
            console.error(err);
            setIsSpeaking(false);
        });
}

export function stopVoiceDetection(setIsSpeaking: (v:boolean)=>void) {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;

    if (audioStream) {
        audioStream.getTracks().forEach(t=>t.stop());
        audioStream = null;
    }

    if (audioContext) {
        audioContext.close();
        audioContext = null;
    }
    analyser = null;
    setIsSpeaking(false);
}
