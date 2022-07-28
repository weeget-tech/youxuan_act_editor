// https://umijs.org/config/
import { defineConfig } from "umi";
import defaultSettings from "./defaultSettings";
import proxy from "./proxy";

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  // 配置数据
  define: {},
  base: "/",
  publicPath: "./",
  hash: true,
  antd: {},
  history: {
    type: "hash",
  },
  dva: {
    hmr: true,
  },
  layout: {
    name: "鲁班系统",
    locale: true,
    ...defaultSettings,
  },
  locale: {
    // default zh-CN
    default: "zh-CN",
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: "@/components/PageLoading/index",
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: "/editor",
      name: "editor",
      icon: "",
      hideInMenu: true,
      // 不展示顶栏
      headerRender: false,
      // 不展示菜单
      menuRender: false,
      component: "./editor/index",
    },
    {
      path: "/",
      redirect: "/editor",
    },
    {
      component: "./404",
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    "primary-color": defaultSettings.primaryColor,
    "btn-border-radius-base": "6px",
    "btn-font-weight": "500",
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || "pro"],
  manifest: {
    basePath: "/",
  },
  externals: {
    "./cptable": "var cptable",
    "../xlsx.js": "var _XLSX",
  },
  esbuild: {
    target: "es5",
  },
});
