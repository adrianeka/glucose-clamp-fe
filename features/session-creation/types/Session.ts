export type SessionStatus =
  | "PREP"
  | "RUNNING"
  | "HOLD"
  | "COMPLETED";

export interface Session {
  sessionId: number;
  participantId: string;
  participantName: string;
  protocolId: number;
  protocolName: string;
  visitDate: string;
  startTime: string;
  endTime: string;
  sessionStatus: SessionStatus;
  totalActivities: number;
  completedActivities: number;
  status: string;
}

export interface SessionListResponse {
  content: Session[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface CreateSessionRequest {
  participantId: string;
  protocolId: number;
  visitDate: string;
  startTime: string;
  fastingHour: number;
}



