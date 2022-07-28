import React, { memo, useMemo } from "react";
import { Dropdown, Menu, Modal, Tooltip, Upload } from "antd";
import { useModel } from "umi";
import { saveAs } from "file-saver";
import { isCoverEditorMode, isDevMode } from "@/utils/act_utils";
import {
  ArrowLeftOutlined,
  ClearOutlined,
  DownOutlined,
  FolderOutlined,
} from "@ant-design/icons";
import styles from "./index.less";

const { confirm } = Modal;
interface HeaderComponentProps {
  location: any;
}

const HeaderComponent: React.FC<HeaderComponentProps> = memo(({ location }) => {
  const {
    componentArray = [],
    pageData,
    clearDPointData,
    setPointData,
  } = useModel("editorModal", (model) => ({
    componentArray: model.componentArray,
    pageData: model.pageData,
    clearDPointData: model.clearDPointData,
    setPointData: model.setPointData,
  }));

  // 清空画板
  const clearData = useMemo(() => {
    return () => {
      clearDPointData();
    };
  }, []);

  // 导入画板
  const importTpl = useMemo(() => {
    return (e: any) => {
      clearData();
      setPointData(e);
    };
  }, []);

  // 下载画板数据
  const downLoadJson = useMemo(() => {
    return () => {
      const jsonStr = JSON.stringify(componentArray);
      const blob = new Blob([jsonStr], { type: "text/plain;charset=utf-8" });
      saveAs(blob, `${pageData.title || "pageSchema"}.json`);
    };
  }, [componentArray, pageData]);

  // 清空画布
  const deleteAll = useMemo(() => {
    return () => {
      if (!componentArray.length) return;
      confirm({
        title: "确认清空画布?",
        okText: "确认",
        cancelText: "取消",
        onOk() {
          clearData();
        },
      });
    };
  }, [componentArray]);

  // 处理下载格式
  const uploadprops = useMemo(
    () => ({
      name: "file",
      showUploadList: false,
      beforeUpload(file: File) {
        // 解析并提取excel数据
        const reader = new FileReader();
        reader.onload = (e: Event) => {
          const data = (e as any).target.result;
          importTpl(JSON.parse(data || "[]"));
        };
        reader.readAsText(file);
      },
    }),
    []
  );

  const menu = (
    <Menu>
      <Menu.Item>
        <Upload {...(uploadprops as any)}>载入页面</Upload>
      </Menu.Item>
      <Menu.Item>
        <a target="_blank" onClick={downLoadJson}>
          导出页面
        </a>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className={`${styles.header} downShowAnimation`}>
      <Tooltip placement="bottom" title="返回上一级">
        <ArrowLeftOutlined
          title="返回上一级"
          className={styles.backBtn}
          onClick={() => window.history.back()}
        />
      </Tooltip>
      {(!isCoverEditorMode() || isDevMode()) && (
        <Dropdown overlay={menu}>
          <div className={styles.normalIcon}>
            <FolderOutlined title="导入导出" />
            <DownOutlined className={styles.downOutlined} />
          </div>
        </Dropdown>
      )}
      {!isCoverEditorMode() && (
        <Tooltip placement="bottom" title="清空画板">
          <ClearOutlined
            title="清空画板"
            className={styles.normalIcon}
            onClick={deleteAll}
          />
        </Tooltip>
      )}
    </div>
  );
});

export default HeaderComponent;
