import FitbitAuthSession from "../database/models/FitbitAuthSession";
import fetch from 'node-fetch';
import User from "../database/models/User";

export const FITBIT_REDIRECT_URI = 'https://localhost:9000/api/fitbit/callback';

export interface AuthData {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
  user_id: string;
}

type AuthSuccess = AuthData & {
  success: true;
};

interface FitbitError {
  success: false;
  errors: { errorType: string; message: string }[];
}

export const fetchWithAuth = async (url: string, method = "GET") => {
  const doFetch = async () => {
    return await fetch(url, {
      method: method,
      headers: {
        ...(await getUserAuthHeader())
      }
    });
  }

  const response = await doFetch();
  if (response.status !== 400) {
    return response;
  }

  await refreshAuthToken();
  return await doFetch();
}

export const getFitbitAuth = async () => {
  let user = await User.findOne({
    where: {
      fitbitUserId: process.env.FITBIT_USER_ID
    }
  });
  
  if (!user?.id) {
    throw new Error(`Unable to find matching user for fitbit id: ${process.env.FITBIT_USER_ID}`);
  }

  let auth = await FitbitAuthSession.findOne({
    where: {
      UserId: user.id
    }
  });

  return auth;
}

export const getBasicAuth = () =>
  Buffer.from(
    `${process.env.FITBIT_CLIENT_ID}:${process.env.FITBIT_CLIENT_SECRET}`
  ).toString('base64');

export const getServiceAuthHeader = () => `Basic ${getBasicAuth()}`;

export const getUserAuthHeader = async () => {
  let auth = await getFitbitAuth();

  if (!auth?.accessToken) {
    throw new Error('Need to refresh fitbit auth.');
  }

  return {
    Authorization: `Bearer ${auth.accessToken}`
  };
}

export const authWithCode = async (
  code: string
): Promise<AuthSuccess | FitbitError> => {
  let params = new URLSearchParams({
    clientId: process.env.FITBIT_CLIENT_ID as string,
    grant_type: 'authorization_code',
    redirect_uri: FITBIT_REDIRECT_URI,
    code: code,
  });

  let result = await fetch('https://api.fitbit.com/oauth2/token', {
    method: 'POST',
    headers: {
      Authorization: getServiceAuthHeader(),
    },
    body: params,
  });

  let json = await result.json();
  if (result.ok) {
    return { ...json, success: true };
  } else {
    return { ...json, success: false } as FitbitError;
  }
};

export const storeAuthCreds = async (data: AuthData) => {
  const parsed = {
    userId: data.user_id,
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
    scope: data.scope,
    tokenType: data.token_type
  };

  let user = await User.findOne({
    where: {
      fitbitUserId: parsed.userId
    }
  });

  if (!user) {
    throw new Error(`No matching user found with fitbit id: ${parsed.userId}`)
  }

  let existingSession = await FitbitAuthSession.findOne({
    where: {
      UserId: user.id
    }
  });

  if (existingSession) {
    existingSession.update({ ...parsed });
  } else {
    FitbitAuthSession.create({
      UserId: user.id,
      ...parsed
    });
  }
}

export const refreshAuthToken = async () => {
  let auth = await getFitbitAuth();
  if (!auth?.refreshToken) {
    throw new Error('No existing fitbit refresh token found');
  }

  let result = await fetch('https://api.fitbit.com/oauth2/token', {
    method: 'POST',
    headers: {
      Authorization: getServiceAuthHeader(),
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: auth.refreshToken,
    }),
  });

  if (result.ok) {
    let json = await result.json();
    storeAuthCreds(json);
  } else {
    throw result;
  }
};
