import Api from "../lib/index.lib";
import responseUtils from "../utils/response.utils";
import { LoginParams, User, RegisterParams } from "../types/index.interface";

class Auth {
  private store: object;
  private auth;

  constructor(store: object, endpoint: string, other: any) {
    this.store = store;
    this.auth = new Api(this.store, endpoint, other);
  }

  public async register(params: RegisterParams): Promise<void> {
    try {
      await this.auth.apiFunctionCall({
        url: "register",
        method: "POST",
        data: params,
      });
    } catch (error) {
      throw error;
    }
  }

  public async login(params: LoginParams): Promise<any> {
    try {
      const res = await this.auth.apiFunctionCall({
        url: "login",
        method: "POST",
        data: params,
      });

      const data = responseUtils.extractData(res);
      return data;
    } catch (error) {
      throw error;
    }
  }

  public async getUser(params: User): Promise<any> {
    const { accountNumber } = params;

    try {
      const res = await this.auth.apiFunctionCall({
        method: "GET",
        url: `user/${accountNumber}`,
        hasAuth: true,
      });

      return res.data.message;
    } catch (error) {
      throw error;
    }
  }

  public async validate2FA(params: string) {
    try {
      await this.auth.apiFunctionCall({
        method: "POST",
        url: "validate2fa",
        data: { code: params },
        hasAuth: true,
      });

      return;
    } catch (error: any) {
      throw error.message || error;
    }
  }

  public async getProfile(): Promise<any> {
    const res = await this.auth.getProfile();
    const data: any = responseUtils.extractData(res);

    return data?.message;
  }
}

export default Auth;
