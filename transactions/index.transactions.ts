import Api from "../lib/index.lib";
import responseUtils from "../utils/response.utils";

class Transactions {
  private api: Api;

  constructor(storeOrToken: any, endpoint?: string, other?: any) {
    if (typeof storeOrToken === "string") {
      // Legacy token-based constructor
      const mockStore = {
        getState: () => ({
          user: {
            payLoad: {
              token: storeOrToken,
              email: "",
            },
          },
        }),
        dispatch: () => {},
      };
      this.api = new Api(mockStore, endpoint || "", other || null);
    } else {
      this.api = new Api(storeOrToken, endpoint || "", other || null);
    }
  }

  public async getTransactions() {
    try {
      const res = await this.api.apiFunctionCall({
        method: "GET",
        url: "transactions",
        hasAuth: true,
      });

      return responseUtils.extractData(res);
    } catch (error: any) {
      throw responseUtils.extractError(error);
    }
  }
}

export default Transactions;
