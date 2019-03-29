# Instagram feed service

Provides access to companies instagram feed.

## Installation

### Debuging
- copy env.sample to `.env`
- setup enviornment variables in `.env` file
- run `yarn start`

### Production
- setup environment variables on server
- run via pm2 `pm2 start index.js`

## Fetch data from instagram
- go to domain root `http://localhost:5000`
- you will be redirected to ig authentication
- then you will be redirected back to update `http://localhost:5000/handleauth`

## Read data from isntagram feed
- use url `http://localhost:5000/instagram-feed`



