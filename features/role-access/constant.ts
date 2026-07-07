export const MENU_DISPLAY_NAMES: Record<string, string> = {
  USER: "User",
  ROLE: "Role",
  PARTICIPANT: "Participant",
  PHASECONFIGURATION: "Phase Configuration",
  PROTOCOLSAMPLINGSCHEDULE: "Protocol & Sampling",
  SESSION: "Session",
  SESSIONDEVICE: "Session Device",
  INFUSIONMONITORING: "Infusion Monitoring",
  LABRESULT: "Lab Result",
  BLOODSAMPLE: "Blood Sample",
  VITALSIGN: "Vital Sign",
  ANTHROPOMETRY: "Anthropometry",
  ANAMNESIS: "Anamnesis",
  DEVICE: "Device",
  GLOBALCONFIGURATION: "Global Configuration",
  ACTIVITY: "Activity",
  ACCESSMENU: "Access Menu",
  PREPARATIONCHECK: "Preparation Check",
  ROLEACCESS: "Role Access",
  BLOODDRAW: "Blood Draw",
};

export const ROLE_DISPLAY_NAMES: Record<string, string> = {
  "Admin": "Admin",
  "Supervisor": "Spv",
  "Operator Analyzer": "Analyzer Ops",
  "Operator Pump": "Pump Ops",
};

export const ROLE_SORT_ORDER: Record<string, number> = {
  "admin": 1,
  "supervisor": 2,
  "operator analyzer": 3,
  "operator pump": 4,
};

export const formatMenuName = (rawName: string): string => {
  return MENU_DISPLAY_NAMES[rawName] || rawName;
};

export const formatRoleName = (rawName: string): string => {
  return ROLE_DISPLAY_NAMES[rawName] || rawName;
};