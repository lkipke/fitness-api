import fetch from 'node-fetch';
import { storeAuthCreds } from '../mysql/auth';
import Auth from '../mysql/models/Auth';
import { useMock } from '../mocks/useMock';

const USER_ID = process.env.FITBIT_USER_ID;

export const getBasicAuth = () =>
  Buffer.from(
    `${process.env.FITBIT_CLIENT_ID}:${process.env.FITBIT_CLIENT_SECRET}`
  ).toString('base64');

export const getServiceAuthHeader = () => `Basic ${getBasicAuth()}`;

export const getUserAuthHeader = async () => {
  let auth = await Auth.findOne({
    where: {
      userId: USER_ID
    }
  });

  if (!auth?.accessToken) {
    throw new Error('missing auth in database');
  }

  return `Bearer ${auth.accessToken}`;
}

// curl -i -X POST \
// https://api.fitbit.com/oauth2/token \
//  -H "Authorization: Basic MjM4S1o2OmJiYzJhOTViMjc2OTM3ZGUzZTE1NmFmN2Q3ODMxNjBh"  \
//  -H "Content-Type: application/x-www-form-urlencoded"  \
//  --data "grant_type=refresh_token"  \
//  --data "refresh_token=128aada92b5e32ec60897048877b300330981e4b20852c3f7fb4263d2bd75af0"

const refreshAuthToken = async () => {
  let auth = await Auth.findOne({
    where: {
      userId: USER_ID
    }
  });

  if (!auth) {
    throw new Error('missing auth in database');
  }

  console.log('auth_entry', auth);

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

export const fetchFitbit = async<T>(
  url: string,
  withAuth = true,
  withRefresh = true,
): Promise<T> => {
  if (process.env.USE_MOCK_DATA === 'true') {
    return await useMock<T>(url);
  }

  let init: Record<string, any> = {
    headers: { accept: 'application/json' },
  };

  if (withAuth) {
    init.headers.Authorization = getUserAuthHeader();
  }

  let result = await fetch(url, init);

  if (result.status === 400 && withRefresh) {
    console.log('*** Refreshing Fitbit auth token');
    await refreshAuthToken();

    let response = await fetch(url, init);
    return await response.json();
  }

  return await result.json();
};

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
