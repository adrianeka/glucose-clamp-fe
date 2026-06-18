export interface Participant {
  participantId: string;
  medicalRecordNo: string;
  name: string;
  gender: string;
  dob: string;
  age: number;
  numberPhone: string;
  status: "ACTIVE" | "INACTIVE" | "DELETED";
  createdAt: string | null;
  createdBy: number;
  updatedAt: string | null;
  updatedBy: number;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
  status: string;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}