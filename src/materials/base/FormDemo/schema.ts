import { uuid } from "@/utils/tool";
import tmp from "./template";

export interface IImageConfig {
  isTpl: boolean;
  data: TData;
}

interface TData {
  data: TDataImg;
}

interface TDataImg {
  imageUrls: any[];
}

const FormDemo = {
  config: {
    ...tmp,
    data: {
      // 组件的初始化参数
      id: uuid(6, 10),
      type: tmp.type,
      description: tmp.displayName,
      action: "",
      showStartTime: "",
      showEndTime: "",
      // 组件类型， 1、普通对象或者带子组件(componentList)的  2、组件带子内容列表(contentList)， 如商品组件
      componentType: 2,
      contentList: [],
      style: {},
      textArry: [],
      data: {
        Text: ''
      },
    },
  },
  editData: [
    {
      key: ["data", "Text"],
      label: "Text",
      type: "Text",
      // hidden: true, // 隐藏但会提交该字段
    },
    {
      key: ["style", "Number"],
      label: "Number",
      type: "Number",
    },
    {
      key: ["style", "TextArea"],
      label: "TextArea",
      type: "TextArea",
    },
    {
      key: "textArry",
      label: "MutiText",
      type: "MutiText",
    },
    {
      key: "DataList",
      label: "DataList",
      type: "DataList",
      cropRate: 1,
    },
    {
      key: "Color",
      label: "Color",
      type: "Color",
    },
    {
      key: "Select",
      label: "Select",
      type: "Select",
      range: [
        {
          value: "radio1",
          label: "下拉1",
        },
        {
          value: "radio2",
          label: "下拉2",
        },
      ],
    },
    {
      key: "SelectTags",
      label: "Select:tags/multiple",
      type: "Select",
      mode: "multiple", // tags or multiple
      rangeLabel: "name",
      rangeKey: "value",
      range: [
        {
          value: "radio1",
          name: "下拉1",
        },
        {
          value: "radio2",
          name: "下拉2",
        },
      ],
    },
    {
      key: "Radio",
      label: "Radio",
      type: "Radio",
      range: [
        {
          value: "Select1",
          label: "Select1",
        },
        {
          value: "Select2",
          label: "Select2",
        },
        {
          value: "Select3222",
          label: "Select3222",
        },
        {
          value: "Select4",
          label: "Select4",
        },
        {
          value: "Select5",
          label: "Select5",
        },
        {
          value: "Select66777",
          label: "Select66777",
        },
      ],
    },

    {
      key: "RadioButton",
      label: "RadioButton",
      type: "RadioButton",
      gutter: [10, 6],
      range: [
        {
          value: "Select1",
          label: "Select1",
        },
        {
          value: "Select2",
          label: "Select2",
        },
        {
          value: "Select3222",
          label: "Select3222",
        },
        {
          value: "Select322222222",
          label: "Selec3333t3222",
        },
      ],
    },
    {
      key: "Checkbox",
      label: "Checkbox",
      type: "Checkbox",
      range: [
        {
          value: "Checkbox1",
          label: "Checkbox1",
        },
        {
          value: "Checkbox2",
          label: "Checkbox2",
        },
        {
          value: "Checkbox3",
          label: "Checkbox3",
        },
        {
          value: "Checkbox4",
          label: "Checkbox4",
        },
      ],
    },
    {
      type: "Divider",
    },
    {
      key: "SliderNumber",
      label: "SliderNumber",
      type: "SliderNumber",
    },
    {
      key: "Switch",
      label: "Switch",
      type: "Switch",
    },
    {
      key: ["data", '["startTime", "endTime"]'], // 可传字符串或者字符串数组， 单字符串为单值对应的值， 字符串数组为将返回的数组解构出来对应的值
      label: "DatePicker",
      type: "DatePicker",
      dateString: true,
      // format: 'YYYY-MM-DD HH:mm',
      // showTime: true,
      dayLimit: 7, // 限制可以选择的最大日期长度
    },
    {
      key: '["startTime", "endTime"]',
      label: "DatePicker",
      type: "DatePicker",
      format: "YYYY-MM-DD HH时mm分",
      showTime: true,
      hourLimit: 24, // 限制可以选择的最大小时长度
    },
    {
      key: '["sTime", "eTime"]',
      label: "自定义时间",
      type: "DatePicker",
      format: "YYYY-MM-DD HH时mm分",
      showTime: true,
    },
    {
      key: "Upload",
      label: "Upload",
      type: "Upload",
      isCrop: true,
    },
    {
      key: "UploadString",
      label: "Upload String",
      type: "Upload",
      format: "string",
    },
    {
      key: "CardPicker",
      label: "CardPicker",
      type: "CardPicker",
      icons: [
        "AccountBookTwoTone",
        "AlertTwoTone",
        "ApiTwoTone",
        "AppstoreTwoTone",
        "AudioTwoTone",
        "BankTwoTone",
      ],
    },
    {
      key: "Table",
      label: "Table",
      type: "Table",
    },
    {
      key: "Pos",
      label: "Pos",
      type: "Pos",
    },
  ],
};

export default FormDemo;
