export interface UserData {
  id: string;
  username: string;
  created_at: string;
}

export interface SignupPayload {
  username: string;
  password: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}
