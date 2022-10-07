import { LoginParams, TWOFA, User } from "../interface/index.interface";
import { Axios } from "../lib/index.lib";

class Auth {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  public async register(params: {}): Promise<void> {
    try {
      await Axios.post("/register", params);
    } catch (error) {
      throw error;
    }
  }

  public async login(params: LoginParams): Promise<any> {
    try {
      const { email, password } = params;
      const res = await Axios.post("/login", { email, password });
      return res.data.message;
    } catch (error) {
      throw error;
    }
  }

  public async getUser(params: User, hasAuth: boolean): Promise<any> {
    try {
      const { accountNumber } = params;
      const authorization = hasAuth ? this.authorization() : {};
      const res = await Axios.get(`/user/${accountNumber}`, authorization);
      return res.data.message;
    } catch (error) {
      throw error;
    }
  }

  public async enable2FA(): Promise<any> {
    try {
      const res = await Axios.patch(`/enable2fa/`, this.authorization());
      return res.data.message;
    } catch (error) {
      throw error;
    }
  }

  public async getProfile(): Promise<any> {
    try {
      const res = await Axios.get("/getProfile/", this.authorization());
      return res.data.message;
    } catch (error) {}
  }

  public async disable2FA(params: TWOFA): Promise<any> {
    const { code } = params;
    try {
      const res = await Axios.patch(
        `/disable2fa/`,
        { code },
        this.authorization()
      );
      return res.data.message;
    } catch (error) {
      throw error;
    }
  }

  private authorization(): object {
    return {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    };
  }
}

export default Auth;
