import { useState } from "react";
import { message } from "antd";
import _ from "lodash";
import { uuid } from "@/utils/tool";
import { deepObjectMerge } from "@/utils/DateFactory";
import {
  findComponentByIdNew,
  reorder,
  findSecondCompPath,
} from "@/utils/utils";
import schema from "@/materials/schema";
import basicTemplate from "@/materials/template";
import { isCoverEditorMode, isDevMode } from "@/utils/act_utils";

function setStorage(name: string, data: any) {
  localStorage.setItem(name, JSON.stringify(data));
}

function getStorage(name: string) {
  return JSON.parse(localStorage.getItem(name) || "[]");
}

/**
 * 注意事项：
 * 1. 由于使用了memo性能优化，组件实时更新的话需要全局对象componentArray地址及内部深度对象地址不变才能实时更新
 */

export interface INewData {
  category?: string;
  data: IConfigData;
  defaultIndex?: number;
  description: string;
  h?: number;
  id: number | string;
  isCombined?: boolean;
  name?: string;
  point?: IPoint;
  translate2Pix?: boolean;
  type: string;
  abRule?: string;
  rate?: number;
  displayName?: string;
  tabName?: string;
  coverCompId?: string;
}

export interface IConfigData {
  coverCompId?: string;
  abErtId?: number;
  abId?: number;
  id: number | string;
  contentList?: any[];
  description: string;
  componentList?: INewData[];
  data?: any;
  type: string;
  showEndTime: number;
  showStartTime: number;
  decorate?: any;
}

export interface IPoint {
  h?: number;
  i?: string | number;
  isBounded?: boolean;
  w?: number;
  x?: number;
  y?: number;
}

export interface IEditorModal {
  componentArray?: INewData[];
  addPointData?: (newData: INewData, newIndex: number) => void;
  currentCompontent?: INewData;
  modCurrPointData?: (pointData: any, renderId: any) => void;
  setCurrentCompontent?: (v: INewData) => void;
  copyPointData?: (id: number) => void;
  delPointData?: (id: number) => void;
  sortPointData?: (result: IDragEndProps) => void;
  clearDPointData?: () => void;
  setPointData?: (pointData: INewData[]) => void;
  upDownComp?: (id: number, type: string) => void;
  disableCopyComp: string[];
  disableMoveComp: string[];
  sideModeComp: string[];
  secondMapList: string[];
}

export interface IDragEndProps {
  combine?: null;
  destination: TSource;
  draggableId: string;
  mode: string;
  reason: string;
  source: TSource;
  type: string;
}

type TSource = {
  droppableId: string;
  index: number;
};

export default () => {
  // 当前页面组件列表
  const [componentArray, setComponentArray] = useState([] as any);
  // 选中的组件
  const [currentCompontent, setCurrentCompontent] = useState({});
  // 当前页面信息
  const [pageData, setPageData] = useState({
    startTime: new Date().getTime(),
    endTime: new Date().getTime(),
    pushText: "您订阅的活动上线啦",
    backgroundColor: "#f1eff0",
    title: "页面标题",
  } as any);
  // 禁止复制和禁止移动的组件列表
  const disableCopyComp = ["TabSlider", "TabAnchor", "TabText"];
  const disableMoveComp = ["TabSlider"];
  // TAB的所有组件
  const TABCOMPONENTLIST = [...disableCopyComp, "TabSecond"];
  // 需要设置侧边栏模式组件列表
  const sideModeComp = ["TabSlider"];
  // 限制添加数量的组件列表
  const limitAddCount = [
    {
      type: "TabSlider",
      count: 1,
    },
    {
      type: "TabSecond",
      count: 1,
    },
  ];
  // 与Tab互斥的组件
  const exclusionTabList: any = [];
  // 嵌套的组件
  const secondMapList = ["ABContainer", "DynamicArea"];

  const [tabSelect, setTabSelect] = useState({});

  // 是否显示过期组件
  const [showTimeoutComp, setShowTimeoutComp] = useState(false);
  // 是否显示未开始组件
  const [showNotStartComp, setShowNotStartComp] = useState(false);

  // 保存组件并写入缓存
  const setPointData = (pointData: IConfigData[]) => {
    if (!pointData) return;
    setComponentArray(pointData);
    setStorage("LUBUN_TEMP_DATA", pointData);
  };

  // 增加组件拦截器
  const addIntercept = (newData: INewData, compList: INewData[]) => {
    if (!newData) return true;
    function getArrItemNum(arr: any) {
      const obj: any = {};
      arr.forEach((element: any) => {
        if (obj[element.type]) {
          // eslint-disable-next-line no-plusplus
          obj[element.type]++;
        } else {
          obj[element.type] = 1;
        }
      });
      return obj;
    }
    const resultObj = getArrItemNum(compList);
    const currItem = limitAddCount.find((i) => i.type === newData.type);
    if (currItem) {
      if (resultObj[currItem.type] >= currItem.count) {
        message.warning(`只能添加${currItem.count}个${newData.description}！`);
        return true;
      }
    }
    // tab拦截
    const ingornAddTab =
      compList.some((item) => disableCopyComp.includes(item.type)) &&
      disableCopyComp.includes(newData.type);
    if (ingornAddTab) {
      message.warning(`该Tab类型最多只能添加一个！`);
      return true;
    }

    // tab互斥组件
    const isExclusionTab =
      compList.some((item) => TABCOMPONENTLIST.includes(item.type)) &&
      exclusionTabList.includes(newData.type);
    if (isExclusionTab) {
      message.warning(`该组件与Tab组件互斥！`);
      return true;
    }
    const isExclusionComp =
      compList.some((item) => exclusionTabList.includes(item.type)) &&
      TABCOMPONENTLIST.includes(newData.type);
    if (isExclusionComp) {
      message.warning(`画板中存在与Tab组件互斥的组件！`);
      return true;
    }

    return false;
  };

  /**
   * @description 拦截并处理组件添加的参数
   * @param {INewData} addComponentData 新增的组件
   * @returns {INewData}
   */
  const decorateComponentHandle = (addComponentData: INewData) => {
    if (TABCOMPONENTLIST.includes(addComponentData.type)) {
      console.log("addComponentData>>", addComponentData);

      // eslint-disable-next-line no-param-reassign
      addComponentData.tabName = `tab-${addComponentData.id}`;
    }
    return addComponentData;
  };

  /**
   * @description
   * @param newData
   * @param newIndex
   * @returns
   */
  // 增加组件
  const addPointData = (newData: INewData, newIndex: number) => {
    if (addIntercept(newData, componentArray)) return;
    const decorateComponent = decorateComponentHandle(newData);
    componentArray.splice(newIndex, 0, decorateComponent);
    setPointData([...componentArray]);
    setCurrentCompontent(decorateComponent);
    message.success(`新增${decorateComponent.description}组件成功`);
  };

  // 写入组件配置数据
  const modPointData = (curData: INewData, data: Record<string, any>) => {
    if (!curData) return;
    const newCurData = deepObjectMerge(_.cloneDeep(curData), data);
    const index = findComponentByIdNew(componentArray, curData.id);
    if (index !== -1) {
      componentArray[index] = newCurData;
    } else if (newCurData.coverCompId) {
      // 更新动态配置区里面的组件
      const coverIndex = findComponentByIdNew(
        componentArray,
        newCurData.coverCompId
      );
      const targetIndex = findComponentByIdNew(
        componentArray[coverIndex].componentList,
        curData.id
      );
      if (targetIndex >= 0 && componentArray[coverIndex].componentList) {
        componentArray[coverIndex].componentList[targetIndex] = newCurData;
      }
    }
    setCurrentCompontent(newCurData);
    setPointData(componentArray);
  };

  // 选中当前组件
  const modCurrPointData = (
    pointData: any,
    renderId: any,
    coverCompId?: string
  ) => {
    if (!pointData || !renderId) return;
    const currentItem: INewData = pointData.find(
      (i: INewData) => i.id === renderId
    );
    if (isCoverEditorMode()) {
      if (coverCompId) {
        currentItem.coverCompId = coverCompId;
      } else if (
        !currentItem.coverCompId &&
        !["Atmosphere", "DynamicArea"].includes(currentItem?.type) &&
        !isDevMode()
      ) {
        // 覆盖页模式不选中非动态配置区的第一层组件
        return;
      }
    }
    setCurrentCompontent(currentItem);
  };

  // 复制组件
  const copyPointData = (id: number) => {
    const pointData: IConfigData[] = [];
    let curPointData: any = {} as IConfigData;
    componentArray.forEach((item: IConfigData) => {
      // 复制
      pointData.push({ ...item });
      if (item.id === id) {
        const newId = uuid(6, 10);
        curPointData = { ..._.cloneDeep(item), id: newId };
        curPointData.id = newId;
        pointData.push(curPointData);
      }
    });
    if (Object.keys(curPointData).length > 0) {
      setPointData(pointData);
      setCurrentCompontent(curPointData);
      message.success(`已复制${curPointData.description}组件`);
    }
  };

  // 删除组件
  const delPointData = (
    id: number,
    forceDelete?: boolean
  ): void | undefined => {
    const targetIndex = findComponentByIdNew(componentArray, id);
    if (componentArray[targetIndex]?.abId && !forceDelete) {
      message.warning("该组件已存在AB策略，请移除策略后再删除！");
      return;
    }
    if (targetIndex !== -1) {
      if (
        ["DynamicArea", "Atmosphere"].includes(
          componentArray[targetIndex].type
        ) &&
        !isDevMode() &&
        !forceDelete
      ) {
        message.error("暂不能删除！");
        return;
      }
      // 第一层删除
      const pointData = componentArray.filter(
        (item: INewData) => item.id !== id
      );
      setPointData(pointData);
      setCurrentCompontent({});
      message.success(`删除成功`);
    } else {
      // 第二层删除
      componentArray.forEach((item: IConfigData) => {
        if (secondMapList.includes(item.type)) {
          // eslint-disable-next-line no-param-reassign
          const pointComList = item.componentList || [];
          const newArr = pointComList?.filter(
            (compItem: INewData) => compItem.id !== id
          );
          pointComList.length = 0;
          pointComList.push(...newArr);
        }
      });
      setPointData(componentArray);
      setCurrentCompontent({});
      message.success(`删除成功`);
    }
  };

  // 清空所有组件
  const clearDPointData = () => {
    setPointData([]);
    setCurrentCompontent({});
    message.success(`已清空页面面板`);
  };

  // 组件排序
  const sortPointData = (result: IDragEndProps) => {
    if (!result.destination) {
      return;
    }
    const draggableId = result.draggableId.replace(/^(Map-|Middle-)/gi, "");
    const curPointIndex = findComponentByIdNew(componentArray, draggableId);

    const curPointData = componentArray[curPointIndex];
    if (curPointData) {
      const pointData: IConfigData[] = reorder(
        componentArray,
        result.source.index,
        result.destination.index
      );
      setPointData(pointData);
      setCurrentCompontent(curPointData || {});
    } else {
      const compArr = _.cloneDeep(componentArray);
      const indexArr = findSecondCompPath(compArr, draggableId, secondMapList);
      const compItem = compArr[indexArr[0]];
      const currComp = compItem?.data?.componentList[indexArr[1]];
      compItem.data.componentList = reorder(
        compItem?.data?.componentList || [],
        result.source.index,
        result.destination.index
      );
      setPointData(compArr);
      setCurrentCompontent(currComp);
    }
  };

  // 覆盖页地图排序
  const sortSecondPointData = (result: IDragEndProps) => {
    const { source, destination, draggableId }: any = result;
    if (!result.destination) {
      return;
    }

    // 1. 找来源的动态配置区
    const coverCompId = source.droppableId.replace(
      /^(Map-|Middle-|Droppable-Map-Second-)/gi,
      ""
    );
    const curPointIndex = findComponentByIdNew(componentArray, coverCompId);
    if (curPointIndex < 0) return;
    const sourceComponentList = componentArray[curPointIndex].componentList;

    // 2. 寻找拖放的组件
    const targetCompId = draggableId.replace(/^(Map-|Middle-)/gi, "");
    const targetCompIndex = findComponentByIdNew(
      sourceComponentList,
      targetCompId
    );
    if (targetCompIndex < 0) return;

    // 3. 对动态配置区里面的组件进行排序
    componentArray[curPointIndex].componentList = reorder(
      componentArray[curPointIndex]?.componentList || [],
      source.index,
      destination.index
    );
    setPointData(_.cloneDeep(componentArray));
    setCurrentCompontent(sourceComponentList[targetCompIndex]);
  };

  // 组装新组件对象
  const getNewDragItem = (sourceIndex: number) => {
    // 判断是否覆盖页编辑器模式
    const BasicTemplate =
      isCoverEditorMode() && !isDevMode()
        ? basicTemplate.filter((i: any) => !i.hiddenInPageEdit)
        : basicTemplate;
    const { type } = BasicTemplate[sourceIndex];
    const item = _.cloneDeep(schema[type].config.data);
    const params: INewData = {
      ...item,
      id: uuid(6, 10),
    };
    return params || {};
  };

  // 处理组件嵌套
  const handleCombineDrag = (result: IDragEndProps) => {
    const { source, combine, draggableId }: any = result;
    // 被交集的组件
    const index = findComponentByIdNew(
      componentArray,
      combine.draggableId.replace(/[Map-|Middle-|drag-]/gi, "")
    );
    const containerComponent = componentArray[index];
    // 被拖动的组件
    const sourceIndex = source ? source.index : 0;
    if (containerComponent?.type === "DynamicArea") {
      if (source.droppableId === "Droppable-Left") {
        // 判断是否覆盖页编辑器模式
        const BasicTemplate =
          isCoverEditorMode() && !isDevMode()
            ? basicTemplate.filter((i: any) => !i.hiddenInPageEdit)
            : basicTemplate;
        if (secondMapList.includes(BasicTemplate[sourceIndex].type)) {
          message.warning("不能拖入嵌套组件");
          return;
        }
        // 新增组件至DynamicArea
        const params = getNewDragItem(sourceIndex);
        params.coverCompId = containerComponent.id;
        containerComponent.componentList?.push(params);
        setPointData(componentArray);
        setCurrentCompontent(params);
      } else if (source.droppableId === "Droppable-Middle") {
        // 从DynamicArea外拖入至DynamicArea
        const dragIndex = findComponentByIdNew(
          componentArray,
          draggableId.replace(/[Map-|Middle-|drag-]/gi, "")
        );
        const dragItem = componentArray[dragIndex];
        if (secondMapList.includes(dragItem.type)) {
          message.warning("不能拖入嵌套组件");
          return;
        }
        containerComponent.componentList?.push(dragItem);
        componentArray.splice(dragIndex, 1);
        setPointData(componentArray);
        setCurrentCompontent({});
      }
      message.success("移入DynamicArea成功");
    }
  };

  // 增加覆盖页组件
  const addPointDataWithCover = (
    coverCompList: any[],
    coverIndex: number,
    newData: INewData,
    newIndex: number
  ) => {
    if (addIntercept(newData, coverCompList)) return;
    const decorateComponent = decorateComponentHandle(newData);
    coverCompList.splice(newIndex, 0, decorateComponent);
    componentArray[coverIndex].componentList = coverCompList;
    setPointData(componentArray);
    setCurrentCompontent(decorateComponent);
    message.success(`新增${decorateComponent.description}组件成功`);
  };

  // 覆盖页新增组件
  const handleCoverAddComp = ({ source, destination }: IDragEndProps) => {
    // 找到覆盖页模块
    const index = findComponentByIdNew(
      componentArray,
      destination?.droppableId?.replace("droppable-middle-", "")
    );
    if (index >= 0) {
      // 覆盖页模块
      const containerComponent = componentArray[index];
      // 组件库索引
      const sourceIndex = source ? source.index : 0;
      // 目标索引
      const destinationIndex = destination ? destination.index : 0;
      // 创建新对象
      const params = getNewDragItem(sourceIndex);
      params.coverCompId = containerComponent.id;
      // 新增至面板中
      addPointDataWithCover(
        containerComponent.componentList,
        index,
        params,
        destinationIndex
      );
    }
  };

  // 覆盖模块组件排序
  const sortCoverPointData = ({
    destination,
    source,
    draggableId,
  }: IDragEndProps) => {
    if (!destination.droppableId) {
      return;
    }
    // 动态配置区目标
    const destinationCompId = destination.droppableId.replace(
      /^(Map-|Middle-|droppable-middle-)/gi,
      ""
    );
    // 动态配置区来源
    const sourceCompId = source.droppableId.replace(
      /^(Map-|Middle-|droppable-middle-)/gi,
      ""
    );
    // 被拖的组件id
    const targetId = draggableId.replace(
      /^(Map-|Middle-|droppable-middle-)/gi,
      ""
    );
    // 当前配置区
    const curPointIndex = findComponentByIdNew(
      componentArray,
      destinationCompId
    );
    const curPointData = componentArray[curPointIndex];

    // 跨动态配置区移动组件
    if (sourceCompId !== destinationCompId) {
      const sourceCoverIndex = findComponentByIdNew(
        componentArray,
        sourceCompId
      );
      // 找出被拖的组件
      const moveTarget = componentArray[sourceCoverIndex].componentList.find(
        (i: any) => i.id === targetId
      );
      // 删除原来配置区的拖放组件
      componentArray[sourceCoverIndex].componentList = componentArray[
        sourceCoverIndex
      ].componentList.filter((i: any) => i.id !== targetId);
      if (moveTarget) {
        // 插入指定的数据
        curPointData.componentList.splice(destination.index, 0, moveTarget);
        setPointData(componentArray);
        setCurrentCompontent(curPointData || {});
      }
      return;
    }

    if (curPointData) {
      const pointData: IConfigData[] = reorder(
        curPointData.componentList,
        source.index,
        destination.index
      );
      curPointData.componentList = pointData;
      setPointData(componentArray);
      setCurrentCompontent(_.clone(curPointData) || {});
    }
  };

  // 处理拖拽结束事件
  const handleDragEnd = (result: IDragEndProps) => {
    const { source, destination, combine, type }: any = result;

    // 从左边拖出到无效区域
    if (
      !(destination || combine) ||
      (destination && destination.droppableId === "Droppable-Left")
    ) {
      return;
    }

    // 拖放组件时没有发生顺序变化和交集变化
    if (
      destination &&
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // AB容器之间组件无法移动
    if (
      destination &&
      destination.droppableId.indexOf("ABContainer") !== -1 &&
      source.droppableId.indexOf("ABContainer") !== -1 &&
      destination.droppableId !== source.droppableId
    ) {
      message.warning("无法移动AB容器之间组件");
      return;
    }

    // 第二层处理，组件交集时操作，主要服务于组件嵌套
    if (
      combine &&
      combine.draggableId &&
      combine.droppableId === "Droppable-Middle"
    ) {
      handleCombineDrag(result);
      return;
    }

    // 第一层排序
    if (
      source.droppableId === "Droppable-Middle" ||
      (source.droppableId === "Droppable-Map-First" &&
        destination.droppableId !== "Droppable-Middle")
    ) {
      // 活动页下可以排序，覆盖页模式下只在dev模式下可以排序
      if (isCoverEditorMode() && !isDevMode()) return;
      sortPointData(result);
      return;
    }

    // 覆盖页地图排序
    if (
      type === "Map-Second" &&
      source?.droppableId.includes("Droppable-Map-Second-drag-") &&
      destination?.droppableId.includes("Droppable-Map-Second-drag-") &&
      source.droppableId === destination.droppableId
    ) {
      sortSecondPointData(result);
      return;
    }

    // 覆盖页组件排序
    if (
      type === "second-level" &&
      source?.droppableId.includes("droppable-middle-") &&
      destination?.droppableId.includes("droppable-middle-")
    ) {
      sortCoverPointData(result);
    }

    // 第一层新增
    if (source.droppableId === "Droppable-Left") {
      // 被拖动的组件
      const sourceIndex = source ? source.index : 0;
      const destinationIndex = destination ? destination.index : 0;
      const params = getNewDragItem(sourceIndex);
      addPointData(params, destinationIndex);
    }

    // 覆盖页组件新增
    if (source.droppableId === "droppable-left-base") {
      handleCoverAddComp(result);
    }
  };

  // 上下调整组件顺序
  const upDownComp = (id: number, type: string) => {
    const pointData = [...componentArray];
    const currIndex = findComponentByIdNew(pointData, id);
    if (currIndex >= 0) {
      // 活动页下可以排序，覆盖页模式下只在dev模式下可以排序
      if (isCoverEditorMode() && !isDevMode()) return;
      // 第一层调整组件顺序
      if (type === "up" && currIndex > 0) {
        upDownHandle(pointData, currIndex, type);
      } else if (type === "down" && currIndex < pointData.length - 1) {
        upDownHandle(pointData, currIndex, type);
      }
    } else {
      // 第二层调整组件顺序
      const indexArr = findSecondCompPath(pointData, id, secondMapList);
      const index = indexArr[1];
      const compList = pointData[indexArr[0]]?.componentList || [];
      if (type === "up" && index > 0) {
        upDownHandle(compList, index, type);
      } else if (type === "down" && index < compList.length - 1) {
        upDownHandle(compList, index, type);
      }
    }

    // 处理调整上下组件功能函数
    let flag = false;
    function upDownHandle(list: INewData[], index: number, state: string) {
      if (flag) return;
      const currItem = list.splice(index, 1);
      const sourceIndex = state === "down" ? index + 1 : index - 1;
      list.splice(sourceIndex, 0, currItem[0]);
      setPointData(pointData);
      setCurrentCompontent(currItem[0]);
      flag = true;
    }
  };

  // 初始化编辑器数据
  const initEditData = () => {
    setPointData(getStorage("LUBUN_TEMP_DATA"));
    setCurrentCompontent({});
  };

  // 退出编辑器
  const clearEditor = () => {
    setCurrentCompontent({});
    setPageData({
      startTime: new Date().getTime(),
      endTime: new Date().getTime(),
      pushText: "您订阅的活动上线啦",
      backgroundColor: "#f1eff0",
      title: "页面标题",
    });
  };

  return {
    componentArray,
    addPointData,
    currentCompontent,
    modPointData,
    modCurrPointData,
    setCurrentCompontent,
    copyPointData,
    delPointData,
    sortPointData,
    clearDPointData,
    setPointData,
    handleDragEnd,
    pageData,
    setPageData,
    upDownComp,
    disableCopyComp,
    disableMoveComp,
    sideModeComp,
    secondMapList,
    clearEditor,
    tabSelect,
    setTabSelect,
    showTimeoutComp,
    setShowTimeoutComp,
    showNotStartComp,
    setShowNotStartComp,
    initEditData,
    addPointDataWithCover,
  };
};
