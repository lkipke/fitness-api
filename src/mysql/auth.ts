import { AuthData } from "../fitbit";
import Auth from "./models/Auth";

const parseData = (data: AuthData) => ({
  userId: data.user_id,
  accessToken: data.access_token,
  refreshToken: data.refresh_token,
  expiresIn: data.expires_in,
  scope: data.scope,
  tokenType: data.token_type
});

export const storeAuthCreds = async (data: AuthData) => {
  const parsed = parseData(data);

  let user = await Auth.findOne({
    where: {
      userId: parsed.userId
    }
  });

  if (user) {
    user.update({ ...parsed });
  } else {
    Auth.create({ ...parsed });
  }
}
