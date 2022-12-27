import { response, Router } from 'express';
import fetch from 'node-fetch';
import queryString from 'query-string';
import { authWithCode, fetchWithAuth, FITBIT_REDIRECT_URI, getUserAuthHeader, storeAuthCreds } from './util';

const FITBIT_CLIENT_ID = process.env.FITBIT_CLIENT_ID;

const router = Router();
router.get('/authorize', async (req, res, next) => {
  const queryParams = {
    response_type: 'code',
    client_id: FITBIT_CLIENT_ID,
    redirect_uri: FITBIT_REDIRECT_URI,
    scope: [
      'activity',
      'heartrate',
      'location',
      'nutrition',
      'profile',
      'settings',
      'sleep',
      'social',
      'weight',
      'oxygen_saturation',
      'respiratory_rate',
    ].join(' '),
    expires_in: '86400000',
  };

  return res.redirect(
    `https://www.fitbit.com/oauth2/authorize?${queryString.stringify(
      queryParams
    )}`
  );
});

router.get('/callback', async (req, res) => {
  let code = req.query.code as string;
  if (!code) {
    return res.status(500).send('Error: Fitbit did not send an auth code.');
  }

  let results = await authWithCode(code);

  if (results.success) {
    let { success, ...data } = results;
    storeAuthCreds(data);
    res.redirect('/api');
  } else {
    res.status(500).send(results);
  }
});

router.get('/update_activity_log/:date', (req, res) => {
  req.params.date;
});

router.post('/subscriber', async (req, res) => {
  if (req.query.verify) {
    if (req.query.verify === process.env.FITBIT_VERIFICATION_CODE) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  }
  
  if (!Array.isArray(req.body)) {
    // TODO: handle errors?
    res.sendStatus(204);
  }

  req.body.forEach((update: any) => {
    if (update.collectionType === 'activities') {
      fetch(`/api/fitbit/update_activity_log/${update.date}`);
    }
  });

  res.sendStatus(204);
});

router.get('/subscription/create', async (req, res) => {
  let response = await fetchWithAuth('https://api.fitbit.com/1/user/-/activities/apiSubscriptions/2.json', 'POST');

  if (response.ok) {
    let json = await response.json();
    res.status(200).send(JSON.stringify(json));
  } else {
    let json = await response.json();
    res.status(500).send(JSON.stringify(json));
  }
});

router.get('/subscription/delete', async (req, res) => {
  let response = await fetchWithAuth('https://api.fitbit.com/1/user/-/activities/apiSubscriptions/2.json', 'DELETE');

  if (response.ok) {
    let json = await response.json();
    res.status(200).send(JSON.stringify(json));
  } else {
    let json = await response.json();
    res.status(500).send(JSON.stringify(json));
  }
});

export default router;
