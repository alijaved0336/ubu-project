export interface IUser {
  id: number;
  email: string;
  password: string;
  updated_at: Date;
  created_at: Date;
  // avatar: string;
}

export interface IAuth {
  email: string;
}
