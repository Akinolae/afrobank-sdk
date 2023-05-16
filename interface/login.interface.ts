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
export type { LoginParams, User, TWOFA };
