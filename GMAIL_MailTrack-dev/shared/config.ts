const MODE: any = process.env.NODE_ENV;

const URLS: any = {
  client: {
    development: "http://localhost:5173#",
    production: chrome.runtime.getURL("pages/popup/index.html#"),
  },
};

const APP_URL = URLS.client[MODE];

const REDIRECT_URL_AFTER_EXTENSION_DOWNLOAD = "<url>";

export { APP_URL, MODE, URLS, REDIRECT_URL_AFTER_EXTENSION_DOWNLOAD };
