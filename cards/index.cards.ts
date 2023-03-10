import Api from "../lib/index.lib";
import responseUtils from "../utils/response.utils";

class Cards {
  private auth;
  constructor(endpoint: string) {
    this.auth = new Api(null, endpoint, null);
  }

  public async getCards() {
    try {
      const res = this.auth.apiFunctionCall({
        method: "GET",
        url: "userCards",
        hasAuth: true,
      });

      return res;
    } catch (error: any) {
      throw responseUtils.extractError(error);
    }
  }
}

export default Cards;
