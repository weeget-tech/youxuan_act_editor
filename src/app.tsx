import React from "react";
import type {
  BasicLayoutProps,
  Settings as LayoutSettings,
} from "@ant-design/pro-layout";
import { notification } from "antd";
import type { RequestConfig } from "umi";
import { history } from "umi";
import type { ResponseError } from "umi-request";
import { getUser } from "@/utils/auth";
import defaultSettings from "../config/defaultSettings";

export async function getInitialState(): Promise<{
  settings?: LayoutSettings;
  currentUser?: any;
  fetchUserInfo: () => any;
  nickName?: string;
}> {
  const fetchUserInfo = async () => {
    try {
      return getUser();
    } catch (error) {
      history.push("/user/login");
    }
    return undefined;
  };

  // 如果是登录页面，不执行
  if (history.location.pathname !== "/user/login") {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
}

export const layout = ({
  initialState,
}: {
  initialState: {
    fetchUserInfo?: any;
    currentUser?: any;
    settings?: any;
  };
}): BasicLayoutProps => {
  return {
    rightContentRender: () => <></>,
    disableContentMargin: false,
    // footerRender: () => <Footer />,
    onPageChange: async () => {},
    menuHeaderRender: undefined,
    ...initialState?.settings,
  };
};

/**
 * @description 修改路由配置
 * @param oldRoutes
 */
export async function patchRoutes(oldRoutes: any) {
  const oldRouteConfig = oldRoutes.routes[0].routes || [];

  // 改变路由内容
  const newRouteConfig = oldRouteConfig.map((r: any) => {
    return { ...r };
  });

  const newRoutes = { ...oldRoutes };

  newRoutes.routes[0].routes = newRouteConfig;

  Object.assign(oldRoutes, newRoutes);
}

/**
 * @description 在patchRoutes之前执行， 可以进行接口请求
 * @param oldRoutes
 */
export async function render(oldRoutes: any) {
  // 执行后面的操作
  oldRoutes();
}

const codeMessage = {
  200: "服务器成功返回请求的数据。",
  201: "新建或修改数据成功。",
  202: "一个请求已经进入后台排队（异步任务）。",
  204: "删除数据成功。",
  400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
  401: "用户没有权限（令牌、用户名、密码错误）。",
  403: "用户得到授权，但是访问是被禁止的。",
  404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
  405: "请求方法不被允许。",
  406: "请求的格式不可得。",
  410: "请求的资源被永久删除，且不会再得到的。",
  422: "当创建一个对象时，发生一个验证错误。",
  500: "服务器发生错误，请检查服务器。",
  502: "网关错误。",
  503: "服务不可用，服务器暂时过载或维护。",
  504: "网关超时。",
};

/**
 * 异常处理程序
 */
const errorHandler = (error: ResponseError) => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  }
  if (!response) {
    notification.error({
      description: "您的网络发生异常，无法连接服务器",
      message: "网络异常",
    });
  }
  throw error;
};
export const request: RequestConfig = {
  errorHandler,
  timeout: 18000,
  errorConfig: {},
  middlewares: [],
  requestInterceptors: [],
  responseInterceptors: [
    async (response: any) => {
      return response;
    },
  ],
};
