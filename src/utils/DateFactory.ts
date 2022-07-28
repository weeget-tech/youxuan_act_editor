import type { IConfigData } from "@/models/editorModal";

/**
 *  #处理表单提交数据#
 *  深层合并两个对象
 * @param firstObject 被合并的object对象旧值，不限制对象层级
 * @param secondObject object对象值，覆盖原来的旧值，不限制对象层级
 * @param isHandleTimes 是否处理拆分key为数组时间的值
 * @return newObject 深层合并后的新对象
 */
export function deepObjectMerge(
  firstObject: Object,
  secondObject: Object,
  isHandleTimes?: Boolean
): IConfigData {
  Object.keys(secondObject).map((key: string) => {
    const item = secondObject[key];
    if (typeof item !== "undefined") {
      // 对象key值为数组, 解构出key值
      if (/^\[.*\]$/.test(key) && isHandleTimes) {
        const keyArr = JSON.parse(key);
        firstObject[keyArr[0]] = secondObject[key][0];
        firstObject[keyArr[1]] = secondObject[key][1];
        delete firstObject[key];
      } else {
        firstObject[key] =
          firstObject[key] &&
          Object.prototype.toString.call(firstObject[key]) ===
            "[object Object]" &&
          Object.prototype.toString.call(secondObject[key]) ===
            "[object Object]"
            ? deepObjectMerge(firstObject[key], secondObject[key])
            : secondObject[key];
      }
    }
  });

  return firstObject as IConfigData;
}
