export interface Res {
  message?: object | any;
  response?: {
    data: {
      message: string | any;
    };
  };
  data?: {
    message?: {
      has2fa: boolean;
      token: string;
      email: string;
    };
  };
}

const extractData = (res: Res): object => {
  return res.message;
};

const extractError = (res: Res) => {
  return res.message;
};

export default {
  extractData,
  extractError,
};
