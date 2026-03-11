export interface LoginFormData {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
  };
}
export interface BaseResponse {
  success: boolean;
  message: string;
  data: any;
}

export interface PasswordChange{
  newpassword: string;
  oldpassword: string;
}