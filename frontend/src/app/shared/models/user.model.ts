export interface IUser {
  id: string;
  _id?: string;
  username: string;
  role: 'user' | 'admin';
  department?: string;
  accessLevel?: 'Read' | 'Write' | 'Admin';
  createdAt?: string;
  updatedAt?: string;
}

export interface ILoginRequest {
  username: string;
  password: string;
}

export interface ILoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    role: string;
    department?: string;
    accessLevel?: string;
  };
}

export interface IDashboardStats {
  totalUsers: number;
  adminCount: number;
  userCount: number;
  departmentCount: number;
}
