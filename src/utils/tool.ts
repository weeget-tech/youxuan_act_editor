/* eslint-disable no-plusplus */
/* eslint-disable no-bitwise */
/* eslint-disable no-multi-assign */
/* eslint-disable no-param-reassign */
import { RefObject, useEffect, useLayoutEffect, useState } from 'react';

// 生成uuid
function uuid(len: number, radix: number) {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const uuid = [];
  let i;
  radix = radix || chars.length;

  if (len) {
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
  } else {
    let r;
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        // eslint-disable-next-line no-bitwise
        r = 0 | (Math.random() * 16);
        // eslint-disable-next-line no-bitwise
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join('');
}

// 将rgba字符串对象转化为rgba对象
function rgba2Obj(rgba = '') {
  const reg = /rgba\((\d+),(\d+),(\d+),(\d+)\)/g;
  let rgbaObj: any = { r: 0, g: 0, b: 0, a: 0 };

  rgba.replace(reg, (_m, r, g, b, a) => {
    rgbaObj = { r, g, b, a };
    return rgba;
  });
  return rgbaObj;
}

export { uuid, rgba2Obj };

export const isDev = process.env.NODE_ENV === 'development';

export function useGetRect() {
  const [rect, setRect] = useState({ width: 0, height: 0 });
  useEffect(() => {
    setRect({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);
  return rect;
}

export function useGetScrollBarWidth(ref: RefObject<HTMLElement>) {
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    if (ref.current) {
      const diff = ref.current.offsetWidth - ref.current.clientWidth;
      setWidth(diff);
    }
  }, [ref]);
  return width;
}

export function useAnimation(state: boolean, delay: number) {
  const [display, setDisplay] = useState(false);
  useEffect(() => {
    let timer: number;
    if (state && display === true) {
      setDisplay(false);
    } else if (!state && display === false) {
      timer = window.setTimeout(() => {
        setDisplay(true);
      }, delay);
    }
    return () => {
      window.clearTimeout(timer);
    };
  }, [delay, display, state]);
  return [display, setDisplay];
}

export function unParams(params = '?a=1&b=2&c=3') {
  const obj: any = {};
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  params &&
    // eslint-disable-next-line no-useless-escape
    params.replace(/((\w*)=([\.a-z0-9A-Z]*)?)?/g, (_m, _a, b, c): any => {
      if (b || c) obj[b] = c;
    });
  return obj;
}

export function throttle(fn: Function, delay: number) {
  let flag = true;
  return (...args: any) => {
    if (flag) {
      flag = false;
      fn(...args);
      setTimeout(() => {
        flag = true;
      }, delay);
    }
  };
}

// note (@livs-ops): 获取浏览器元信息
export function getBrowserNavigatorMetaInfo(): string {
  return window.navigator.userAgent || window.navigator.vendor || window.opera;
}

export const serverUrl = isDev ? 'http://192.16x.x.x:3000' : '你的服务器地址';

// 宽度适配器
// eslint-disable-next-line no-underscore-dangle
export const _gaw = (w: number) => {
  const vw = window.innerWidth > 800 ? 375 : window.innerWidth;
  return (vw / 375) * w;
};

export const s2ab = (s: any) => {
  let buf = [] as any;
  if (typeof ArrayBuffer !== 'undefined') {
    buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; i += 1) view[i] = s.charCodeAt(i) & 0xff;
  } else {
    buf = new Array(s.length);
    for (let i = 0; i !== s.length; i += 1) buf[i] = s.charCodeAt(i) & 0xff;
  }

  return buf;
};

export const parseJSON = () => {};
