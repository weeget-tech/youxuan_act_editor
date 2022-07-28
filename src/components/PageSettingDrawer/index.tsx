/* eslint-disable no-param-reassign */
import React, { memo, useEffect, useMemo, useState } from "react";
import { Drawer } from "antd";
import { history, useModel } from "umi";
import FormRender from "@/core/renderer/FormRender";

type TPageSettingDrawer = {
  show: boolean;
  onClose: () => void;
};

const PageSettingDrawer = ({ show, onClose }: TPageSettingDrawer) => {
  const { type = "0", role = "" }: any = history.location.query;
  const hiddenCol = role === "dev" || type !== "1";
  const { pageData }: any = useModel("editorModal", (model) => ({
    pageData: model.pageData,
  }));
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(show);
  }, [show]);

  const closeDrawer = () => {
    setVisible(false);
    if (onClose) {
      onClose();
    }
  };

  const handleSubmitForm = useMemo(() => {
    // eslint-disable-next-line consistent-return
    return (): void | any => {
      // 活动页保存校验
      console.log("活动页保存");
    };
  }, [pageData]);

  const formCfg = [
    {
      key: ["title"],
      label: "页面标题",
      type: "Text",
      rules: [
        {
          required: true,
          message: "请输入页面标题",
        },
      ],
    },
    {
      key: ["description"],
      label: "页面备注",
      type: "Text",
    },
    {
      key: '["startTime", "endTime"]',
      label: "有效期",
      type: "DatePicker",
      showTime: true,
      hidden: !hiddenCol,
      rules: [
        {
          required: true,
          message: "请选择有效期",
        },
      ],
    },
    {
      type: "Divider",
    },
    {
      key: ["backgroundImage"],
      label: "背景图片",
      type: "Upload",
      format: "string",
    },
    {
      key: ["backgroundColor"],
      label: "背景色",
      type: "Color",
      rules: [
        {
          required: true,
          message: "请选择背景色",
        },
      ],
    },
  ];

  return (
    <Drawer
      title={`${pageData.actPagesId ? "修改" : "添加"}页面`}
      placement="right"
      onClose={closeDrawer}
      visible={visible}
      maskClosable={false}
      width={340}
    >
      {visible && (
        <FormRender
          uid="PageSetting"
          onFinish={handleSubmitForm}
          defaultValue={pageData}
          config={formCfg}
          layout="vertical"
          formColCfg={{
            labelCol: { span: 10 },
            wrapperCol: { span: 24 },
          }}
        />
      )}
    </Drawer>
  );
};

export default memo(PageSettingDrawer);
