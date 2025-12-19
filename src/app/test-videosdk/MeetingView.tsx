"use client";

import { MeetingProvider, useMeeting } from "@videosdk.live/react-sdk";
import { Controls } from "./Controls";
import { ParticipantView } from "./ParticipantView";

interface MeetingViewProps {
  token: string;
  meetingId: string;
  onLeave: () => void;
}

function MeetingContainer({ meetingId, onLeave }: { meetingId: string; onLeave: () => void }) {
  const { participants, meetingId: currentMeetingId } = useMeeting({
    onMeetingLeft: () => {
      onLeave();
    },
  });

  const participantIds = [...participants.keys()];

  return (
    <div className="flex min-h-screen flex-col bg-zinc-900">
      <div className="border-b border-zinc-700 bg-zinc-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">VideoSDK Meeting</h1>
            <p className="text-sm text-zinc-400">
              Meeting ID: <span className="font-mono text-zinc-300">{currentMeetingId || meetingId}</span>
            </p>
          </div>
          <div className="text-sm text-zinc-400">
            Participants: {participantIds.length}
          </div>
        </div>
      </div>

      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {participantIds.map((participantId) => (
            <ParticipantView key={participantId} participantId={participantId} />
          ))}
        </div>
        {participantIds.length === 0 && (
          <div className="flex h-64 items-center justify-center text-zinc-500">
            Waiting for participants...
          </div>
        )}
      </div>

      <Controls meetingId={meetingId} />
    </div>
  );
}

export function MeetingView({ token, meetingId, onLeave }: MeetingViewProps) {
  return (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: true,
        name: "Test User",
        debugMode: false,
      }}
      token={token}
      joinWithoutUserInteraction={true}
    >
      <MeetingContainer meetingId={meetingId} onLeave={onLeave} />
    </MeetingProvider>
  );
}
