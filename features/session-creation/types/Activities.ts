export type ActivityStatus =
  | "INQUEUE"
  | "INPUT_DATA"
  | "COMPLETED";

export interface Activity {
  activityId: number;
  time: string;
  activityType: string;
  activityDesc: string;
  phaseCode: string;
  phaseName: string;
  activityStatus: ActivityStatus;
}

export interface SessionDetail {
  sessionId: number;
  participantId: string;
  participantName: string;
  protocolId: number;
  protocolName: string;
  visitDate: string;
  startTime: string;
  endTime: string;
  sessionStatus: string;
  totalActivities: number;
  completedActivities: number;
  progressPercentage: number;
  nextActivities: Activity[];
  activities: Activity[];
}