export interface AddSamplingScheduleRequest {
  protocol_id: number;
  phase_code: string;
  phase_name: string;
  phase_type: string;
  time_interval: number;
  blood_raw: boolean;
  insulin_inject: boolean;
  pk_sample_collection: boolean;
}

export interface SamplingShcedule {
  sampling_schedule_id : string;
  protocol_id : number;
  phase_code : string;
  time_interval : number;
  relative_minute : number;
  blood_raw : boolean;
  insulin_inject : boolean;
  pk_sample_collection : boolean;
}