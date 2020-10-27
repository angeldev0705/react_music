export let Config = {
  app: {
    name: process.env.APP_NAME,
    version: process.env.APP_VERSION,
    debug: process.env.APP_DEBUG,
    author: process.env.APP_AUTHOR
  },
  ads: {
    enabled: process.env.ADS_ENABLED,
    linkDownload: '',
    banners: {
      interstitial: process.env.ADS_BANNERS_INTERSITIAL,
      '234x60': process.env.ADS_BANNERS_234X60,
      '320x50': process.env.ADS_BANNERS_320X50,
      '468x60': process.env.ADS_BANNERS_468X60,
      '728x90': process.env.ADS_BANNERS_728X90,
      '300x250': process.env.ADS_BANNERS_300X250,
      '120x600': process.env.ADS_BANNERS_120X600,
      '160x600': process.env.ADS_BANNERS_160X600
    }
  },
  analytics: {
    id: process.env.ANALYTICS_ID
  },
  facebook: {
    appVersion: process.env.FACEBOOK_APP_VERSION,
    appId: process.env.FACEBOOK_APP_ID,
    fanpage: process.env.FACEBOOK_FANPAGE_URL,
    permissions: process.env.FACEBOOK_PERMISSIONS
  },
  assets: {
    imageFallback: process.env.ASSETS_IMAGE_FALLBACK_URL
  },
  server: {
    url: process.env.SERVER_URL
  }
};
