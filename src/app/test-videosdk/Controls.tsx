"use client";

import { useState } from "react";
import { useMeeting } from "@videosdk.live/react-sdk";

const BACKEND_URL = "https://video-sdk-test.requestcatcher.com";

interface ControlsProps {
  meetingId: string;
}

export function Controls({ meetingId }: ControlsProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState<string>("");

  const {
    leave,
    toggleMic,
    toggleWebcam,
    startRecording,
    stopRecording,
    localMicOn,
    localWebcamOn,
  } = useMeeting({
    onRecordingStarted: () => {
      setIsRecording(true);
      setRecordingStatus("Recording started");
    },
    onRecordingStopped: () => {
      setIsRecording(false);
      setRecordingStatus("Recording stopped");
    },
    onRecordingStateChanged: (state) => {
      setRecordingStatus(`Recording state: ${state.status}`);
    },
  });

  const handleStartRecording = () => {
    const webhookUrl = `${BACKEND_URL}/storage/videosdk`;
    const awsDirPath = `/xoots-recordings/${meetingId}`;
    startRecording(webhookUrl, awsDirPath);
    setRecordingStatus("Starting recording...");
  };

  const handleStopRecording = () => {
    stopRecording();
    setRecordingStatus("Stopping recording...");
  };

  return (
    <div className="border-t border-zinc-700 bg-zinc-800 px-6 py-4">
      <div className="flex flex-col gap-4">
        {recordingStatus && (
          <div
            className={`text-center text-sm ${isRecording ? "text-red-400" : "text-zinc-400"}`}
          >
            {isRecording && (
              <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-red-500" />
            )}
            {recordingStatus}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => toggleMic()}
            className={`rounded-lg px-4 py-2 font-medium transition-colors ${
              localMicOn
                ? "bg-zinc-600 text-white hover:bg-zinc-500"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            {localMicOn ? "Mute Mic" : "Unmute Mic"}
          </button>

          <button
            onClick={() => toggleWebcam()}
            className={`rounded-lg px-4 py-2 font-medium transition-colors ${
              localWebcamOn
                ? "bg-zinc-600 text-white hover:bg-zinc-500"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            {localWebcamOn ? "Stop Camera" : "Start Camera"}
          </button>

          {!isRecording ? (
            <button
              onClick={handleStartRecording}
              className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700"
            >
              Start Recording
            </button>
          ) : (
            <button
              onClick={handleStopRecording}
              className="rounded-lg bg-orange-600 px-4 py-2 font-medium text-white transition-colors hover:bg-orange-700"
            >
              Stop Recording
            </button>
          )}

          <button
            onClick={() => leave()}
            className="rounded-lg bg-zinc-700 px-4 py-2 font-medium text-white transition-colors hover:bg-zinc-600"
          >
            Leave Meeting
          </button>
        </div>
      </div>
    </div>
  );
}
