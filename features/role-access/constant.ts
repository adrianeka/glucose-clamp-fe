export const MENU_DISPLAY_NAMES: Record<string, string> = {
  USER: "User",
  ROLE: "Role",
  PARTICIPANT: "Participant",
  PROTOCOL: "Protocol",
  PHASECONFIGURATION: "Phase Configuration",
  SAMPLINGSCHEDULE: "Sampling Schedule",
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
};

export const formatMenuName = (rawName: string): string => {
  return MENU_DISPLAY_NAMES[rawName] || rawName;
};