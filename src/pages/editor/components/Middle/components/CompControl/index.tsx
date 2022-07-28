import React, { useCallback, memo, useMemo } from "react";
import {
  CopyOutlined,
  DeleteOutlined,
  UpOutlined,
  DownOutlined,
  DiffOutlined,
} from "@ant-design/icons";
import { Tooltip, Popconfirm, message } from "antd";
import { useModel } from "umi";
import _ from "lodash";
import { findComponentByIdNew } from "@/utils/utils";
import { uuid } from "@/utils/tool";
import styles from "./index.less";

const CompControl = memo(() => {
  const {
    currentCompontent = {},
    copyPointData,
    delPointData,
    upDownComp,
    disableCopyComp,
    addPointData,
    componentArray,
  }: any = useModel("editorModal", (model) => ({
    currentCompontent: model.currentCompontent,
    copyPointData: model.copyPointData,
    delPointData: model.delPointData,
    upDownComp: model.upDownComp,
    disableCopyComp: model.disableCopyComp,
    addPointData: model.addPointData,
    componentArray: model.componentArray,
    addPointDataWithCover: model.addPointDataWithCover,
  }));
  const { id, type, description }: any = currentCompontent;

  const handleMenuClick = useMemo(() => {
    return (handleType: string) => {
      switch (handleType) {
        case "upComp":
          upDownComp(id, "up");
          break;
        case "downComp":
          upDownComp(id, "down");
          break;
        case "copy":
          copyPointData(id);
          break;
        case "del":
          delPointData(id);
          break;
        default:
          break;
      }
    };
  }, [componentArray, id]);

  // 拷贝至剪切板
  const copyCompToShearPlate = useMemo(() => {
    return () => {
      const currComp: any = _.cloneDeep(currentCompontent);
      localStorage.setItem("share_plate", JSON.stringify(currComp));
      message.success("拷贝成功");
    };
  }, [currentCompontent]);

  // 粘贴组件
  const pasteComp = useMemo(() => {
    return () => {
      const copyComp = JSON.parse(localStorage.getItem("share_plate") || "{}");
      // 活动页粘贴
      const newIndex = findComponentByIdNew(componentArray, id);
      addPointData(
        {
          ...copyComp,
          id: uuid(6, 10),
        },
        newIndex + 1
      );
      return message.success("粘贴成功");
    };
  }, [componentArray, id]);

  const disableCopy = disableCopyComp.includes(type || "");

  const MoreBtn = useMemo(() => {
    return (
      <>
        <div
          className={styles.moreBtn}
          onClick={() => disableCopy || handleMenuClick("copy")}
        >
          <CopyOutlined /> 复制组件到下一坑位
        </div>
        <div className={styles.moreBtn} onClick={copyCompToShearPlate}>
          <CopyOutlined />
          复制组件到粘贴板
        </div>
      </>
    );
  }, [copyCompToShearPlate, pasteComp]);

  const MyCompMenu = useCallback(() => {
    return (
      <div className={styles.compMenu}>
        <Tooltip placement="right" title={`上移：${description}-${id}`}>
          <div
            className={styles.compMenuItem}
            onClick={() => handleMenuClick("upComp")}
          >
            <UpOutlined className={styles.compIcon} />
          </div>
        </Tooltip>
        <Tooltip placement="right" title={`下移：${description}-${id}`}>
          <div
            className={styles.compMenuItem}
            onClick={() => handleMenuClick("downComp")}
          >
            <DownOutlined className={styles.compIcon} />
          </div>
        </Tooltip>
        <Tooltip placement="right" title={MoreBtn}>
          <div
            className={styles.compMenuItem}
            onClick={() => disableCopy || handleMenuClick("copy")}
          >
            <CopyOutlined className={styles.compIcon} />
          </div>
        </Tooltip>
        <Tooltip placement="right" title="粘贴到此处">
          <div className={styles.compMenuItem} onClick={pasteComp}>
            <DiffOutlined className={styles.compIcon} />
          </div>
        </Tooltip>
        <Popconfirm
          title={`确定删除该${description}组件吗？`}
          onConfirm={() => handleMenuClick("del")}
          okText="确定"
          cancelText="取消"
        >
          <Tooltip placement="right" title={`删除：${description}-${id}`}>
            <div className={styles.compMenuItem}>
              <DeleteOutlined className={styles.compIcon} />
            </div>
          </Tooltip>
        </Popconfirm>
      </div>
    );
  }, [handleMenuClick]);

  return id ? (
    <div className={styles.menuBox}>
      <MyCompMenu />
    </div>
  ) : (
    <></>
  );
});

export default CompControl;
