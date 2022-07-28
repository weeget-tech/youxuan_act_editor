declare module 'slash2';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
declare module 'omit.js';

// google analytics interface
type GAFieldsObject = {
  eventCategory: string;
  eventAction: string;
  eventLabel?: string;
  eventValue?: number;
  nonInteraction?: boolean;
};
type Window = {
  ga: (
    command: 'send',
    hitType: 'event' | 'pageview',
    fieldsObject: GAFieldsObject | string,
  ) => void;
  reloadAuthorized: () => void;
};

declare let ga: (params: any) => void;

// preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
declare let ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: 'site' | undefined;

declare module 'react-color';
declare module 'qrcode.react';
declare module 'crypto-js';

declare const REACT_APP_ENV: 'test' | 'dev' | 'pre' | false;
declare const WINDOW_ENV: 'release' | 'alirelease' | 'pro' | 'alipressure';
declare const API_BASE_NAME: string;
declare const C_API_BASE_NAME: string;
declare const GATE_BASE_NAME: string;
declare const IMG_CDN: string;
declare const IMG_TEST_WG: string;
declare const LiveCacheJsonName: string;
declare const MiniABJsonName: string;
declare const ARMS_ENV: string;
declare const LUBAN_REST_URL: string;
declare const REST_URL: string;

declare const H5_APP_KEY: string;

declare const window: Window;
