# TODO

## Backfilling

1. Get [Activity Log List](https://dev.fitbit.com/build/reference/web-api/activity/get-activity-log-list/) for the last week.
1. Use [Activity Intraday by date](https://dev.fitbit.com/build/reference/web-api/intraday/get-activity-intraday-by-date/) to backfill data about each metric we care about for each activity:
  - calories
1. Do same as above with [Heart Rate Intraday](https://dev.fitbit.com/build/reference/web-api/intraday/get-heartrate-intraday-by-date/).

## Subscription

1. Create subscription that receives an activity, then requests the appropriate intraday data corresponding to the times.
