// 是否为数据看板页面
export const isBoardMode = () => {
  const query = window?.location?.href;
  return !!(typeof query === "string" && query.indexOf("board") !== -1);
};

// 是否处在编辑器中
export const isEditorMode = () => {
  const query = window?.location?.href;
  return !!(
    typeof query === "string" &&
    (query.indexOf("editor") !== -1 || isBoardMode())
  );
};

// 转换内联样式像素
export const pxTransform = (size: number, designWidth = 750) => {
  const vw = isEditorMode() ? 375 : window.innerWidth;
  const multiply = designWidth / vw;
  return `${(size / multiply).toFixed(2)}px`;
};

/**
 * @description 获取侧边栏索引
 * @param pointData 渲染组件列表
 * @returns 返回搜索，-1 表示没有找到
 */
export const getTabSliderIndex = (pointData: any) => {
  return pointData?.findIndex((item: any) => item?.type === "TabSlider");
};

/**
 * @description 是否过期组件
 * @param showEndTime 组件结束时间
 * @param showTimeoutComp 是否一直显示过期组件
 * @returns Boolean
 */
export const isTimeOutComp = (
  showEndTime: number,
  showTimeoutComp: boolean
) => {
  if (!showEndTime || showTimeoutComp) return false;
  const nowTime = new Date().getTime();
  return nowTime > showEndTime;
};

/**
 * @description 是否未开始组件
 * @param showEndTime 组件开始时间
 * @param showNotStartComp 是否一直显示未开始组件
 * @returns Boolean
 */
export const isNotStartComp = (
  showStartTime: number,
  showNotStartComp: boolean
) => {
  if (!showStartTime || showNotStartComp) return false;
  const nowTime = new Date().getTime();
  return nowTime < showStartTime;
};

/**
 * @description 是否不能截图的组件
 * @param type 组件类型
 * @param hideNotCutShotComp 是否隐藏主推次推组件
 * @returns Boolean
 */
export const isNotCutShotComp = (type: string, hideNotCutShotComp: boolean) => {
  if (hideNotCutShotComp) {
    if (["MainRecommend", "SecondaryRecommend"].includes(type)) {
      return true;
    }
  }
  return false;
};

/**
 * @description 处理背景颜色及背景图片
 * @param _pageData 页面数据
 * @returns Object 样式对象
 */
export const getBackgroundStyle = (_pageData: any) => {
  const bgModeStyle: any = {};

  if (_pageData?.backgroundImage) {
    bgModeStyle.backgroundSize = "100% auto";
    bgModeStyle.backgroundRepeat = "no-repeat";
    bgModeStyle.backgroundImage = `url(${_pageData.backgroundImage})`;
  }

  if (_pageData?.backgroundColor) {
    bgModeStyle.backgroundColor = _pageData.backgroundColor;
  }

  return bgModeStyle;
};

/**
 * @description 获取组件索引
 * @param componentArray 页面数据列表
 * @param compId 组件ID
 * @returns string
 */

export const getCompIndex = (componentArray: any, compId: number | string) => {
  let compIndex = "";
  const index = componentArray.findIndex((i: any) => i.id === compId);
  if (index >= 0) {
    compIndex = index + 1;
  }
  componentArray.forEach((i: any) => {
    if (["dynamicArea", "DynamicArea"].includes(i?.type)) {
      const curIndex = i.componentList.findIndex(
        (item: any) => item.id === compId
      );
      if (curIndex >= 0) {
        compIndex = curIndex + 1;
      }
    }
  });
  return compIndex ? `${compIndex}.` : "";
};

// 是否覆盖页编辑器模式
export const isCoverEditorMode = () => {
  const query = window?.location?.href;
  return !!(
    isEditorMode() &&
    typeof query === "string" &&
    query.indexOf("type=1") !== -1
  );
};

// 是否开发者模式
export const isDevMode = () => {
  const query = window?.location?.href;
  return !!(typeof query === "string" && query.indexOf("role=dev") !== -1);
};

// 正则表达式提取字符串中字母、数字、中文
export const extractStringVarietyNumber = (value: string) => {
  const n = value.match(/\d/g);
  const e = value.match(/[a-z]/gi);
  const c = value.match(/[^ -~]/g);
  return {
    character: c === null ? 0 : c.length,
    alphabet: e === null ? 0 : e.length,
    number: n === null ? 0 : n.length,
  };
};

// 截取字符串最大长度
export const getMaxLength = (text: string, length: number) => {
  const stringText = text.split("");

  let len = 0;

  let realLength = 0;

  stringText.forEach((s: string) => {
    const { character, alphabet, number } = extractStringVarietyNumber(s);

    if (len < length * 2) {
      if (character) {
        len += 2;
        realLength += 1;
      }
      if (alphabet || number) {
        len += 1;
        realLength += 1;
      }
    }
  });
  return realLength;
};
