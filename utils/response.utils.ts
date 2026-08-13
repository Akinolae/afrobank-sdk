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

const extractData = (res: Res): any => {
  if (!res) return undefined;
  if (res.data?.message) return res.data.message;
  if (res.response?.data?.message) return res.response.data.message;
  return res.message;
};

const extractError = (res: any): any => {
  if (!res) return "Unknown Error";
  if (typeof res === "string") return res;
  if (res instanceof Error) return res.message;
  
  if (res.response?.data?.message) return res.response.data.message;
  if (res.data?.message) return res.data.message;
  if (res.message) {
    if (typeof res.message === "object" && "message" in res.message) {
      return (res.message as any).message;
    }
    return res.message;
  }
  return res.error || res.err || "Unknown Error";
};

export default {
  extractData,
  extractError,
};
