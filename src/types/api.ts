export interface User {
  id: number;
  username: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  providers?: string[]; // ví dụ ["LOCAL", "GOOGLE"] — hữu ích khi test xem user đã link provider nào
}

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    status: number;
    timestamp: string;
    path: string;
    fieldErrors?: { field: string; message: string }[];
  };
}
