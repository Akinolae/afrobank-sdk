/*
 used Fetch instead of  Axios
 exended to accomodate token verification and authorizations
*/
import response from "../utils/response.utils";

type api = {
  url: string;
  method: "GET" | "PATCH" | "POST" | "PUT";
  options?: any;
  data?: object;
  hasAuth?: boolean;
};

class Api {
  private store;
  private endpoint;
  private other;

  constructor(store: any, endpoint: string, other: any) {
    this.store = store;
    this.endpoint = endpoint;
    this.other = other;
  }

  private async validateToken() {
    const { email, token } = this.store.getState().user.payLoad;

    try {
      await this.apiFunctionCall({
        url: "verify-token",
        method: "POST",
        data: { token },
      });
    } catch (error: any) {
      /*
      If error is invalid it runs this bloc of code
      */

      if (["invalid", "jwt expired"].includes(error.message)) {
        await this.apiFunctionCall({
          url: `new-token?email=${email}`,
          method: "GET",
        });

        await this.getProfile();
        return;
      }
      throw response.extractError(error) || error;
    }
  }

  public async getProfile() {
    const { email } = this.store.getState().user.payLoad;
    console.log(this.store.getState().user.payLoad);
    try {
      const res = await this.apiFunctionCall({
        url: `getProfile?email=${email}`,
        method: "GET",
      });

      const data: any = response.extractData(res);
      this.store?.dispatch(this.other?.updateUser(data));

      return data?.message;
    } catch (error: any) {
      throw error.message || error;
    }
  }

  public async apiFunctionCall(params: api) {
    const {
      method,
      url,
      data,
      hasAuth,
      options = { "Content-Type": "application/json" },
    } = params;

    const val = !!data ? { body: JSON.stringify(data) } : {};

    /*
    only validate token when @params(hasAuth) => true
    */

    if (hasAuth) {
      await this.validateToken();
      const token = this.store.getState().user.payLoad.token;
      options.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(this.endpoint + url, {
      method: method,
      headers: options,
      ...val,
    });

    if (!response?.ok) {
      throw (await response.json()) || "Network Error";
    }

    return response.json();
  }
}

export default Api;
