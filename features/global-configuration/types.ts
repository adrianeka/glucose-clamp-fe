export interface GlobalConfiguration {
  id?: string;
  gconfId?: string;
  
  name?: string;
  gconfTitle?: string; 

  key?: string;
  gconfCode?: string;

  value: string;
  gconfValue?: string;

  description?: string;
  gconfDescription?: string;
  status?: string;
}

export interface GlobalConfigurationRequest {
  gconfCode: string;
  gconfValue: string;
  gconfTitle?: string;
  gconfDescription?: string;
}