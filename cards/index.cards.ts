import Api from "../lib/index.lib";
import responseUtils from "../utils/response.utils";

class Cards {
  private api: Api;
  constructor(store: any, endpoint: string, other: any) {
    this.api = new Api(store, endpoint, other);
  }

  public async getCards() {
    try {
      const res = await this.api.apiFunctionCall({
        method: "GET",
        url: "userCards",
        hasAuth: true,
      });

      return responseUtils.extractData(res);
    } catch (error: any) {
      throw responseUtils.extractError(error);
    }
  }
}

export default Cards;
