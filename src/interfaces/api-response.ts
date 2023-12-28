export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: any;
    post?: any;
  }