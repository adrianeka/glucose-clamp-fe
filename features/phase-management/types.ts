export interface PhaseConfig {
  id?: string | number;
  priority: number;
  code: string;
  name: string;
  type: string;
}

export interface PhaseApiResponse {
  phaseConfId: string | number;
  phaseConfPriority: number;
  phaseConfCode: string;
  phaseConfName: string;
  phaseConfType: string;
}