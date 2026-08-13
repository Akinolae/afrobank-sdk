/*
 used Fetch instead of  Axios
 extended to accommodate token verification and authorizations
*/
import response from "../utils/response.utils";
import { FetchParams } from "../types/index.interface";

class Api {
  private store: any;
  private endpoint: string;
  private other: any;

  constructor(store: any, endpoint: string, other: any) {
    this.store = store;
    this.endpoint = endpoint;
    this.other = other;
  }

  private getStoreState() {
    if (!this.store) {
      throw new Error("Redux store is not initialized in the SDK client.");
    }
    return this.store.getState();
  }

  private safeAtob(str: string): string {
    if (typeof atob === "function") {
      return atob(str);
    }
    const globalBuffer = (globalThis as any).Buffer;
    if (typeof globalBuffer !== "undefined") {
      return globalBuffer.from(str, "base64").toString("binary");
    }
    throw new Error("Unable to decode base64. atob or Buffer is missing.");
  }

  private isTokenExpired(token: string): boolean {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return true;
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        this.safeAtob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const payload = JSON.parse(jsonPayload);
      if (typeof payload.exp !== "number") return false;
      // Expired if current time (plus 10s buffer) exceeds exp timestamp
      return payload.exp * 1000 < Date.now() + 10000;
    } catch {
      return true; // If decoding fails, assume expired
    }
  }

  private async refreshToken(email: string) {
    const res = await this.apiFunctionCall({
      url: `new-token?email=${encodeURIComponent(email)}`,
      method: "GET",
    });

    const tokenData: any = response.extractData(res);
    if (this.store && this.other?.updateUser) {
      this.store.dispatch(this.other.updateUser(tokenData));
    }

    await this.getProfile();
  }

  private async validateToken() {
    const state = this.getStoreState();
    const payLoad = state?.user?.payLoad;
    const email = payLoad?.email;
    const token = payLoad?.token;

    if (!token) {
      throw new Error("Authentication token is missing.");
    }

    // 1. Proactive check client-side
    if (this.isTokenExpired(token)) {
      if (!email) {
        throw new Error("User email is missing; cannot refresh token.");
      }
      await this.refreshToken(email);
      return;
    }

    // 2. Verify with backend if client-side check says it's valid
    try {
      await this.apiFunctionCall({
        url: "verify-token",
        method: "POST",
        data: { token },
      });
    } catch (error: any) {
      const errMsg = response.extractError(error) || "";
      const hasExpiredMsg = ["invalid", "jwt expired"].includes(errMsg) ||
        (error && typeof error === "object" && ["invalid", "jwt expired"].includes(error.message));

      if (hasExpiredMsg) {
        if (!email) {
          throw new Error("User email is missing; cannot refresh token.");
        }
        await this.refreshToken(email);
        return;
      }
      throw response.extractError(error) || error;
    }
  }

  public async getProfile() {
    const state = this.getStoreState();
    const email = state?.user?.payLoad?.email;
    if (!email) {
      throw new Error("User email is missing; cannot get profile.");
    }

    try {
      const res = await this.apiFunctionCall({
        url: `getProfile?email=${encodeURIComponent(email)}`,
        method: "GET",
      });

      const data: any = response.extractData(res);
      if (this.store && this.other?.updateUser) {
        this.store.dispatch(this.other.updateUser(data));
      }

      return data;
    } catch (error: any) {
      throw response.extractError(error) || error;
    }
  }

  public async apiFunctionCall(params: FetchParams): Promise<any> {
    const {
      method,
      url,
      data,
      hasAuth,
      options = {},
    } = params;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...options,
    };

    const val = !!data ? { body: JSON.stringify(data) } : {};

    if (hasAuth) {
      await this.validateToken();
      const state = this.getStoreState();
      const token = state?.user?.payLoad?.token;
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    const formattedUrl = this.endpoint.endsWith("/") || url.startsWith("/")
      ? `${this.endpoint}${url}`
      : `${this.endpoint}/${url}`;

    const responseObj = await fetch(formattedUrl, {
      method: method,
      headers: headers,
      ...val,
    });

    if (!responseObj?.ok) {
      let errorBody: any;
      try {
        errorBody = await responseObj.json();
      } catch {
        errorBody = responseObj.statusText || `HTTP error ${responseObj.status}`;
      }
      throw errorBody;
    }

    if (responseObj.status === 204) {
      return {};
    }

    try {
      return await responseObj.json();
    } catch {
      return {};
    }
  }
}

export default Api;
