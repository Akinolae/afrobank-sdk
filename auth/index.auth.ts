import Api from "../lib/index.lib";
import responseUtils from "../utils/response.utils";
import { LoginParams, User, RegisterParams } from "../types/index.interface";

class Auth {
  private store: object;
  private api: Api;

  constructor(store: object, endpoint: string, other: any) {
    this.store = store;
    this.api = new Api(this.store, endpoint, other);
  }

  public async register(params: RegisterParams): Promise<void> {
    try {
      await this.api.apiFunctionCall({
        url: "register",
        method: "POST",
        data: params,
      });
    } catch (error: any) {
      throw responseUtils.extractError(error);
    }
  }

  public async login(params: LoginParams): Promise<any> {
    try {
      const res = await this.api.apiFunctionCall({
        url: "login",
        method: "POST",
        data: params,
      });

      const data = responseUtils.extractData(res);
      return data;
    } catch (error: any) {
      throw responseUtils.extractError(error);
    }
  }

  public async verifyEmail(email: string, code: string): Promise<void> {
    try {
      await this.api.apiFunctionCall({
        url: "confirmSignUp",
        method: "POST",
        data: { email, code },
      });
    } catch (error: any) {
      throw responseUtils.extractError(error);
    }
  }

  public async getUser(params: User): Promise<any> {
    const { accountNumber } = params;

    try {
      const res = await this.api.apiFunctionCall({
        method: "GET",
        url: `user/${accountNumber}`,
        hasAuth: true,
      });

      return responseUtils.extractData(res);
    } catch (error: any) {
      throw responseUtils.extractError(error);
    }
  }

  public async validate2FA(params: string) {
    try {
      await this.api.apiFunctionCall({
        method: "POST",
        url: "validate2fa",
        data: { code: params },
        hasAuth: true,
      });

      return;
    } catch (error: any) {
      throw responseUtils.extractError(error);
    }
  }

  public async getProfile(): Promise<any> {
    try {
      const data = await this.api.getProfile();
      return data;
    } catch (error: any) {
      throw responseUtils.extractError(error);
    }
  }
}

export default Auth;
