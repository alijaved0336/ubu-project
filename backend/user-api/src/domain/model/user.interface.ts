export interface IUser {
  id: number;
  email: string;
  password: string;
  updated_at: Date;
  created_at: Date;
  // type: string;
  // avatar: string;
}

export interface IAuth {
  email: string;
}
