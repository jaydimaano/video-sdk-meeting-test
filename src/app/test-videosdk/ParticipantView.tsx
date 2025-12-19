"use client";

import { useEffect, useMemo, useRef } from "react";
import { useParticipant } from "@videosdk.live/react-sdk";

interface ParticipantViewProps {
  participantId: string;
}

export function ParticipantView({ participantId }: ParticipantViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const {
    webcamStream,
    micStream,
    webcamOn,
    micOn,
    isLocal,
    displayName,
  } = useParticipant(participantId);

  const videoMediaStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
    return null;
  }, [webcamStream, webcamOn]);

  const audioMediaStream = useMemo(() => {
    if (micOn && micStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(micStream.track);
      return mediaStream;
    }
    return null;
  }, [micStream, micOn]);

  useEffect(() => {
    if (videoRef.current && videoMediaStream) {
      videoRef.current.srcObject = videoMediaStream;
    }
  }, [videoMediaStream]);

  useEffect(() => {
    if (audioRef.current && audioMediaStream && !isLocal) {
      audioRef.current.srcObject = audioMediaStream;
    }
  }, [audioMediaStream, isLocal]);

  return (
    <div className="relative overflow-hidden rounded-xl bg-zinc-800">
      <div className="aspect-video">
        {webcamOn && videoMediaStream ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={isLocal}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-700">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-600 text-2xl font-semibold text-white">
              {(displayName || participantId).charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
        <span className="text-sm font-medium text-white">
          {displayName || participantId}
          {isLocal && " (You)"}
        </span>
        <div className="flex gap-2">
          <span
            className={`h-2 w-2 rounded-full ${micOn ? "bg-green-500" : "bg-red-500"}`}
            title={micOn ? "Mic on" : "Mic off"}
          />
          <span
            className={`h-2 w-2 rounded-full ${webcamOn ? "bg-green-500" : "bg-red-500"}`}
            title={webcamOn ? "Camera on" : "Camera off"}
          />
        </div>
      </div>

      {!isLocal && micOn && audioMediaStream && (
        <audio ref={audioRef} autoPlay playsInline />
      )}
    </div>
  );
}
