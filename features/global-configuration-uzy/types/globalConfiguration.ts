export interface GlobalConfiguration {
  gconfId: number;
  gconfCode: string;
  gconfValue: string;
  status: string;
}

export interface GlobalConfigResponse {
  data: GlobalConfiguration;
  message: string;
  statusCode: number;
  status: string;
}