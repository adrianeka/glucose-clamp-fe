export interface Protocol {
  protocol_id: number;
  protocol_code: string;
  protocol_name: string;
  insulin_dose_rule: string;
  insulin_dose_unit: string;
  glucose_target_min: number;
  glucose_target_max: number;
  glucose_target_unit: string;
  glucose_target_min_extreme: number;
  glucose_target_max_extreme: number;
  duration_hours: number;
  version: number;
  sampling_schedules:String;
}

export interface AddProtocolRequest {
  protocol_code: string;
  protocol_name: string;
  insulin_dose_rule: string;
  insulin_dose_unit: string;
  glucose_target_min: number;
  glucose_target_max: number;
  glucose_target_unit: string;
  glucose_target_min_extreme: number;
  glucose_target_max_extreme: number;
  duration_hours: number;
  version: number;
  sampling_schedules: [];
}

export interface UpdateProtocolRequest
  extends AddProtocolRequest {}

export interface Pagination {
  pageNumber: number;
  pageSize: number;
  keyword?: string;
}

export interface ProtocolDropdown {
  protocolId: number;
  protocolCode: string;
  protocolName: string;
}