import { loginParams } from "../interface/index.interface";
import { Axios } from "../lib/index.lib";

class Auth {
  public async login(params: loginParams): Promise<any> {
    try {
      const { email, password } = params;
      const res = await Axios.post("/login", { email, password });
      return res.data.message;
    } catch (error) {
      throw error;
    }
  }
}

export default Auth;
