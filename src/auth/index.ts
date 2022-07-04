import fetch from 'node-fetch';

export const getBasicAuth = () =>
  Buffer.from(
    `${process.env.FITBIT_CLIENT_ID}:${process.env.FITBIT_CLIENT_SECRET}`
  ).toString('base64');

interface AuthData {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
  user_id: string;
}

export type AuthSuccess = Omit<AuthData, 'scope'> & {
  success: true;
  scopes: string[];
};

interface FitbitError {
  success: false;
  errors: { errorType: string; message: string }[];
}

export const authWithCode = async (
  code: string
): Promise<AuthSuccess | FitbitError> => {
  let params = new URLSearchParams({
    clientId: process.env.FITBIT_CLIENT_ID as string,
    grant_type: 'authorization_code',
    redirect_uri: process.env.FITBIT_REDIRECT_URI as string,
    code: code,
  });

  let result = await fetch('https://api.fitbit.com/oauth2/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${getBasicAuth()}`,
    },
    body: params,
  });

  let json = await result.json();
  if (result.ok) {
    let { scope, ...authData } = json as AuthData;
    let scopes = scope.split(' ');
    return { ...authData, scopes, success: true } as AuthSuccess;
  } else {
    return { ...json, success: false } as FitbitError;
  }
};
