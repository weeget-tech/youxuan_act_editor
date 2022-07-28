import moment from "moment";
import { INewData, IConfigData } from "@/models/editorModal";

// 生成ID
export const getId = () => {
  return Math.floor(Math.random() * 9999999);
};

// 数组重新排序
export const reorder = (
  list: any[],
  startIndex: number,
  endIndex: number
): any[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

// 根据id获取组件索引
export const findComponentById = (
  components: any[],
  gid: string
): number[] => {
  const id = gid.match(/\d+/gi)?.[0] || 0;
  // console.log('id>?>>>>>>>>>>>>>', id);
  // console.log('components>>>>>', components);
  const firstLevel = components.findIndex((component) =>
    component?.data?.id.includes(id)
  );
  if (firstLevel !== -1) {
    return [firstLevel, -1, -1];
  }

  let newRes = [-1, -1, -1];
  for (let newIndex = 0; newIndex < components.length; newIndex += 1) {
    const comp = components[newIndex];
    if (comp?.category === "container") {
      const secondIndex = comp.data.componentList?.findIndex((item) =>
        item?.data?.id.includes(id)
      ) as number;
      if (secondIndex !== -1) {
        newRes = [newIndex, secondIndex, -1];
      }
    }
    if (comp.type === "DynamicArea") {
      const secondIndex = comp.data.componentList?.findIndex((item) =>
        item?.data?.id.includes(id)
      ) as number;
      if (secondIndex !== -1) {
        newRes = [newIndex, secondIndex, -1];
      } else {
        // console.log('=======================第三层 动态配置区内的AB=======================');
        for (
          let newSecond = 0;
          newSecond < comp.data.componentList.length;
          newSecond += 1
        ) {
          const newSecComp = comp.data.componentList[newSecond];
          if (newSecComp?.category === "container") {
            const thirdIndex = newSecComp.data.componentList?.findIndex(
              (abItem) => abItem?.data?.id.includes(id)
            ) as number;
            if (thirdIndex !== -1) {
              newRes = [newIndex, newSecond, thirdIndex];
            }
          }
        }
      }
    }
  }
  return newRes;
};

// 覆盖页数据处理
export const handleCoverPageData = (data: ComponentInitItem[]) => {
  if (data.length === 0) return;
  // const tempArr: ComponentInitItem[] = [];
  // const newData = JSON.parse(JSON.stringify(data));
  // console.log('tempArr', tempArr);
  // console.log('newData', newData);
};

// 将热区中的弹窗抽出，转成协议格式， 放到一级目录
export function handleBonusOutputBack(res) {
  const newRes = JSON.parse(JSON.stringify(res));
  newRes.forEach((item) => {
    // TODO: 兼容旧组件， 后续通过translate2Pix字段判断即可
    if (
      item.data.type === "imageRange" ||
      item.data.type === "indexLive" ||
      item.data.type === "workBenchPanelB" ||
      item.translate2Pix
    ) {
      // console.log(item, 'itmemtet');
      const { contentList } = item.data;
      contentList.forEach((area) => {
        if (!area.id) return;
        // 拿到最后的背景地址
        const { notice, param } = area;
        notice &&
          Object.keys(notice).forEach((noticeKey) => {
            if (
              notice[noticeKey] &&
              notice[noticeKey]?.buttonImgInfo &&
              (notice[noticeKey].backgroundImage || notice[noticeKey].imageUrl)
            ) {
              notice[noticeKey].buttonImgInfo.url =
                notice[noticeKey].buttonImgUrl;
              // 弹窗组件的数据
              const popUpJson = {
                data: {
                  id: notice.id,
                  popType: noticeKey,
                  type: "popUp",
                  description: "弹窗",
                  popName: `${noticeKey}_${notice.id}`,
                  componentType: 1,
                  style: {
                    backgroundImage: notice[noticeKey].backgroundImage || "",
                  },
                  data: {
                    imageUrl: notice[noticeKey].imageUrl || "",
                    buttonImgInfo: notice[noticeKey].buttonImgInfo || undefined,
                    singleCoupon:
                      typeof param.singleCoupon !== "undefined"
                        ? param.singleCoupon
                        : true,
                  },
                  action: notice[noticeKey].isNotice
                    ? notice[noticeKey].action
                    : "",
                },
              };
              // 过滤名字相同的pop弹窗， 只显示第一个
              const existPop = newRes.find(
                (e: any) => e.data.popName === popUpJson.data.popName
              );
              if (!existPop) {
                newRes.push(popUpJson);
              }
            }
          });
      });
    }
  });
  return newRes;
}

const abMapDataBack = (json: ComponentInitItem[]) => {
  const newJson = [...json];
  // console.log('newJson>>>>', newJson);
  const res = newJson.map((i: any) => {
    const item = i;
    if (item.data.type === "aBContainer") {
      // const { compABLists, abId = 0, abErtId = 0, userGroup = [] } = item.data.data;
      item.data.componentList = item.data.componentList.map((oAbChild) => {
        const abChild = { ...oAbChild };
        abChild.data.showStartTime = abChild.data.showStartTime
          ? moment(abChild.data.showStartTime).format("YYYY-MM-DD HH:mm:ss")
          : "";
        abChild.data.showEndTime = abChild.data.showEndTime
          ? moment(abChild.data.showEndTime).format("YYYY-MM-DD HH:mm:ss")
          : "";
        return abChild;
      });
      return item;
    }
    if (item.data.type === "dynamicArea") {
      item.data.componentList = item.data.componentList.map((ody) => {
        const dy = { ...ody };
        if (dy.data.type === "aBContainer") {
          // const { compABLists, abId = 0, abErtId = 0, userGroup = [] } = dy.data.data;
          dy.data.componentList = dy.data.componentList.map((oAbChild) => {
            const abChild = { ...oAbChild };
            abChild.data.showStartTime = abChild.data.showStartTime
              ? moment(abChild.data.showStartTime).format("YYYY-MM-DD HH:mm:ss")
              : "";
            abChild.data.showEndTime = abChild.data.showEndTime
              ? moment(abChild.data.showEndTime).format("YYYY-MM-DD HH:mm:ss")
              : "";
            return abChild;
          });
          return dy;
        }
        return dy;
      });
    }

    item.data.showStartTime = item.data.showStartTime
      ? moment(item.data.showStartTime).format("YYYY-MM-DD HH:mm:ss")
      : "";
    item.data.showEndTime = item.data.showEndTime
      ? moment(item.data.showEndTime).format("YYYY-MM-DD HH:mm:ss")
      : "";

    return item;
  });

  // return json;
  return res;
};

// 筛选AB规则
export const filterABRuleData = (
  componentArray: INewData[],
  coverCompId?: string
) => {
  const arr: any = [];
  componentArray.forEach((item: any) => {
    if (item.abRule) {
      const targetIndex = arr.findIndex(
        (item2: any) => item2.abId === item.data.abId
      );
      if (targetIndex !== -1) {
        arr[targetIndex].compList.push({
          compId: item.data.id,
          name: item.name,
          rate: item.abRule.rate,
          abErtId: item.data.abErtId,
          abId: item.data.abId,
          abStgId: item.data.abStgId,
          showInPreview: item.abRule.showInPreview,
          coverCompId: coverCompId,
        });
      } else {
        arr.push({
          ...item.abRule,
          abId: item.data.abId,
          compList: [
            {
              compId: item.data.id,
              name: item.name,
              rate: item.abRule.rate,
              abErtId: item.data.abErtId,
              abId: item.data.abId,
              abStgId: item.data.abStgId,
              showInPreview: item.abRule.showInPreview,
              coverCompId: coverCompId,
            },
          ],
        });
      }
    }
    // 过滤动态配置区里面的组件
    if (["dynamicArea", "DynamicArea"].includes(item?.type)) {
      filterABRuleData(item.data.componentList, item.id).forEach((i: any) =>
        arr.push(i)
      );
    }
  });

  return arr;

  // return componentArray
  //   .filter((item: INewData) => item.abRule)
  //   .map((item2) => {
  //     const target: any = item2.abRule;
  //     target.description = item2.description;
  //     return target;
  //   });
};

// 获取画板Item的样式
export const getItemStyle = (isDragging: any, draggableStyle: any) => ({
  userSelect: "none",
  ...draggableStyle,
});

export const findComponentByIdNew = (
  components: ComponentInitItem[],
  gid: string | number
) => {
  return components.findIndex((i: any) => i.id === gid);
};

// 寻找第二层组件的路径index
export const findSecondCompPath = (
  list: IConfigData[],
  compId: Number | string,
  secondMapList: string[]
) => {
  const arr: number[] = [];
  list.forEach((compItem: IConfigData, index: number) => {
    if (secondMapList.includes(compItem.type)) {
      compItem?.componentList?.forEach((i: INewData, secondIndex: number) => {
        if (i.id === compId) {
          arr.push(index);
          arr.push(secondIndex);
        }
      });
    }
  });
  return arr;
};

