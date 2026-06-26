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
  glucose_drop_trigger_percentage: number;    
  initial_glucose_infusion_rate: number;      
  initial_glucose_infusion_rate_unit: string; 
  version: number;
  sampling_schedules: string;
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
  glucose_drop_trigger_percentage: number;      // Field baru
  initial_glucose_infusion_rate: number;        // Field baru
  initial_glucose_infusion_rate_unit: string;   // Field baru
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