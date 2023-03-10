/*
 used Fetch instead of  Axios
 exended to accomodate token verification and authorizations
*/

import response from "../utils/response.utils";

type api = {
  url: string;
  method: "GET" | "PATCH" | "POST" | "PUT";
  options?: any;
  data?: any;
  hasAuth?: boolean;
};

class Api {
  private store;

  constructor(store: any) {
    this.store = store;
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
    try {
      const res = await this.apiFunctionCall({
        url: `getProfile?email=${email}`,
        method: "GET",
      });

      const data: any = response.extractData(res);

      return data?.message;
    } catch (error: any) {
      throw error.message || error;
    }
  }

  public async apiFunctionCall(params: api) {
    const { method, url, data, hasAuth, options } = params;

    const val = !!data
      ? { body: typeof data !== "string" ? JSON.stringify(data) : data }
      : {};

    /*
    only validate token when @params(hasAuth) => true
  */

    if (hasAuth) {
      await this.validateToken();
      const token = this.store.getState().user.payLoad.token;
      options.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`http://localhost:3005/Api/v1/${url}`, {
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
