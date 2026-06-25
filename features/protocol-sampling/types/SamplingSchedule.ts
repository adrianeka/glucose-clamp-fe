export interface AddSamplingScheduleRequest {
  protocol_id: number;
  phase_code: string;
  phase_name: string;
  phase_type: string;
  phase_duration: number;
  time_interval: number;
  label_prefix : string;
  blood_raw: boolean;
  insulin_inject: boolean;
  pk_sample_collection: boolean;
}

export interface SamplingShcedule {
  sampling_schedule_id : string;
  schedule_code : string;
  protocol_id : number;
  phase_code : string;
  phase_name: string;
  phase_type: string;
  time_interval : number;
  relative_minute : number;
  blood_raw : boolean;
  insulin_inject : boolean;
  pk_sample_collection : boolean;
}

export interface BulkUpdateSamplingScheduleRequest {
  items: BulkUpdateSamplingScheduleItem[];
}

export interface BulkUpdateSamplingScheduleItem {
  id: number;
  bloodRaw?: boolean;
  insulinInject?: boolean;
  pkSampleCollection?: boolean;
}