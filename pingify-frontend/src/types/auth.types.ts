export interface UserData {
  id: string;
  username: string;
  created_at: string;
}

export interface AuthPayload {
  username: string;
  password: string;
}
