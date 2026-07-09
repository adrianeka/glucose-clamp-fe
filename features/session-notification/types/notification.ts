"use client";

export interface SessionActivityItem {
  activityId: number;
  time: number[]; // Format LocalDateTime: [YYYY, MM, DD, HH, mm]
  activityType: string;
  activityDesc: string;
  phaseCode: string;
  phaseName: string;
  activityStatus: string;
  minute: number;
}

export interface OngoingSessionData {
  hasActiveSession: boolean;
  sessionId: number;
  participantName: string;
  protocolName: string;
  nextActivity: SessionActivityItem;
}
