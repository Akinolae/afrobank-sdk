interface LoginParams {
  email: string;
  password: string;
}

interface User {
  accountNumber: string;
}

interface TWOFA {
  email: string;
  code: string | number;
}

interface RegisterParams {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

interface FetchParams {
  url: string;
  method: "GET" | "PATCH" | "POST" | "PUT";
  options?: any;
  data?: object;
  hasAuth?: boolean;
}

export type { FetchParams, LoginParams, User, TWOFA, RegisterParams };
