"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { createMeeting } from "@/vendors/video-sdk";

const MeetingView = dynamic(() => import("./MeetingView").then((mod) => mod.MeetingView), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center bg-zinc-900">
      <div className="text-white">Loading meeting...</div>
    </div>
  ),
});

export default function TestVideoSDK() {
  const [token, setToken] = useState<string | null>(null);
  const [meetingId, setMeetingId] = useState<string | null>(null);
  const [joinMeetingId, setJoinMeetingId] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchToken();
  }, []);

  const fetchToken = async () => {
    try {
      const response = await fetch("/api/videosdk/token");
      const tokenData = await response.json();
      setToken(tokenData);
    } catch (err) {
      setError("Failed to fetch token");
      console.error(err);
    }
  };

  const handleCreateMeeting = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const roomId = await createMeeting({ token });
      setMeetingId(roomId);
      setIsJoined(true);
    } catch (err) {
      setError("Failed to create meeting");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinMeeting = () => {
    if (!joinMeetingId.trim()) {
      setError("Please enter a meeting ID");
      return;
    }
    setMeetingId(joinMeetingId.trim());
    setIsJoined(true);
  };

  const handleLeaveMeeting = () => {
    setIsJoined(false);
    setMeetingId(null);
    setJoinMeetingId("");
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-900">
        <div className="text-white">Loading token...</div>
      </div>
    );
  }

  if (isJoined && meetingId) {
    return (
      <MeetingView
        token={token}
        meetingId={meetingId}
        onLeave={handleLeaveMeeting}
      />
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-zinc-900 p-8">
      <h1 className="text-3xl font-bold text-white">VideoSDK Test Page</h1>

      {error && (
        <div className="rounded-lg bg-red-500/20 px-4 py-2 text-red-400">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-6 rounded-xl bg-zinc-800 p-8">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-white">Create New Meeting</h2>
          <button
            onClick={handleCreateMeeting}
            disabled={loading}
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create & Join Meeting"}
          </button>
        </div>

        <div className="h-px bg-zinc-700" />

        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-white">Join Existing Meeting</h2>
          <input
            type="text"
            placeholder="Enter Meeting ID"
            value={joinMeetingId}
            onChange={(e) => setJoinMeetingId(e.target.value)}
            className="rounded-lg bg-zinc-700 px-4 py-3 text-white placeholder-zinc-400 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleJoinMeeting}
            disabled={!joinMeetingId.trim()}
            className="rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
          >
            Join Meeting
          </button>
        </div>
      </div>

      <div className="text-sm text-zinc-500">
        Token loaded: {token ? "Yes" : "No"}
      </div>
    </div>
  );
}
