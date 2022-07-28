# 鲁班可视化搭建系统

<img width="100px" src="https://imagecos.yunhuotong.net/2021_08/1d1352ad4f386e66f78242b19ba2957b.jpg">

<p align="left">
  <b>基于以下技术构建：</b>
</p>
<table align="center" cellspacing="0" cellpadding="0">
  <tbody>
    <tr>
      <td align="center" valign="middle" width="250">
        <a href="https://ant.design/index-cn" title="Ant Design" target="_blank">
			    <img width="100px" src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg">
          <p>Ant Design</pp>
        </a>
      </td>
      <td align="center" valign="middle" width="250">
        <a href="https://react.docschina.org/" title="react" target="_blank">
          <img height="100px" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/react/react.png" title="react">
          <p>React hooks</p>
        </a>
      </td>
      <td align="center" valign="middle" width="250">
        <a href="https://github.com/atlassian/react-beautiful-dnd" title="react-beautiful-dnd" target="_blank">
          <img height="100px" src="https://user-images.githubusercontent.com/2182637/53611918-54c1ff80-3c24-11e9-9917-66ac3cef513d.png" title="react-beautiful-dnd">
          <p>react-beautiful-dnd</p>
        </a>
      </td>
    </tr>
  </tbody>
</table>

## 介绍

- 移动端可视化页面搭建平台，为**小程序 / H5 / APP 提供 JSON Schema 页面驱动结构系统**
- 技术栈：React Hooks / Ant Design / Umi / TypeScript / Egg.js / MySQL / react-beautiful-dnd
- 解决了营销活动页面及灵活变更的广告位业务需求，上线**超过 20 个组件，覆盖业务方 70%营销需求，减少了定制开发超过 300+页面**，并且支持**ABTest 及访问数据埋点收集分析看板**，上线运营**页面累计 PV 超过 10 亿，实现成交 GMV 超过 10 亿**
- 全新一代鲁班渲染架构，开发者只关注组件样式和逻辑开发，一次开发多端适配(**浏览器 H5/小程序 H5/APP H5**)，统一项目代码结构，无需开发配置面板，通过最佳实践模板开发组件，**减少开发耗时 50%以上**

安装 `node_modules`:

```bash
npm install

```

or

```bash
yarn
```

## 运行脚本

脚本配置在 `package.json`中. 提供一下运行脚本:

### 运行项目

```bash
npm start
```

#### 运行指定环境(请求对应环境的接口)

```bash
# alipressure
npm run start:alipressure
# release
npm run start:release
# or alirelease 同 start
npm run start:alirelease
# or 生成
npm run start:pro
```