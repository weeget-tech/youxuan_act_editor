/* eslint-disable no-template-curly-in-string */
import React, { memo, RefObject, useEffect } from "react";
import {
  Form,
  Select,
  InputNumber,
  Input,
  Switch,
  Radio,
  Checkbox,
  Row,
  Col,
  Divider,
  Button,
} from "antd";
import _ from "lodash";
import DataList from "@/components/FormComponents/DataList";
import MutiText from "@/components/FormComponents/MutiText";
import Color from "@/components/FormComponents/Color";
import CardPicker from "@/components/FormComponents/CardPicker";
import Table from "@/components/FormComponents/Table";
import DatePicker from "@/components/FormComponents/DatePicker";
import { Store } from "antd/lib/form/interface";
import { deepObjectMerge } from "@/utils/DateFactory";

const { Option, OptGroup } = Select;
const { TextArea } = Input;
interface FormEditorProps {
  uid: string;
  onSave?: (v: any) => void;
  onFinish?: (v: any) => void;
  onDel?: Function;
  defaultValue: { [key: string]: any };
  config: any[];
  rightPannelRef?: RefObject<HTMLDivElement>;
  getFormRef?: (ref: any) => void;
  formColCfg?: {};
  formValue?: {};
  layout?: any;
  submitLayout?: any;
  autoComplete?: boolean;
}

const FormEditor = (props: FormEditorProps) => {
  const {
    config = [],
    onSave,
    uid,
    getFormRef,
    formColCfg,
    formValue,
    onFinish: onSubmit,
    layout,
    submitLayout,
    autoComplete = true,
  } = props;
  const defaultValue = { ...props.defaultValue };

  /**
   * @description 接口json存储格式数据回显原始数据处理
   */
  config?.forEach((itemConfig) => {
    // 数组key处理默认值
    if (/^\[.*\]$/.test(itemConfig.key)) {
      const keyArray = JSON.parse(itemConfig.key);
      defaultValue[itemConfig.key] = [
        defaultValue[keyArray[0]],
        defaultValue[keyArray[1]],
      ];
      if (formValue?.[keyArray[0]] && formValue?.[keyArray[1]]) {
        formValue[itemConfig.key] = [
          formValue?.[keyArray[0]],
          formValue?.[keyArray[1]],
        ];
      }
    }
  });

  const formItemLayout = formColCfg || {
    labelCol: { span: 5 },
    wrapperCol: { span: 17 },
  };

  const submitButtonLayout =
    submitLayout ||
    (layout === "vertical"
      ? {
          wrapperCol: { span: 17 },
        }
      : {
          wrapperCol: { span: 17, offset: 5 },
        });

  /**
   * @description 原始数据回吐为json存储格式处理
   */
  const originalDataFormat = (values: Object) => {
    const copyValues = {};
    return deepObjectMerge(copyValues, values, true);
  };

  const onFinish = (values: Store) => {
    if (onSubmit && !onSave) {
      const newValue = originalDataFormat(values);
      onSubmit(newValue);
    }
  };

  const [form] = Form.useForm();

  useEffect(() => {
    if (getFormRef) {
      getFormRef(form);
    }
    return () => {
      form.resetFields();
    };
  }, [uid, form]);

  const handlechange = _.debounce(() => {
    const values = form.getFieldsValue();
    if (onSave && !onSubmit) {
      const newValue = originalDataFormat(values);
      onSave(newValue);
    }
  }, 300);

  const FormItemNormal = memo((itemProps: any) => {
    const { item, children, ...rest } = itemProps;
    const isRender =
      item.render === undefined
        ? true
        : item.render &&
          typeof item.render === "function" &&
          item.render(defaultValue);

    return (
      (isRender && (
        <Form.Item
          label={item.label}
          name={item.key}
          wrapperCol={item.wrapperCol}
          hidden={item.hidden}
          rules={item.rules}
          {...rest}
        >
          {children}
        </Form.Item>
      )) || <></>
    );
  });

  const FormItemField = memo(({ item = {}, children, ...rest }: any) => {
    const { render, rules = [], wrapperCol } = item;

    return (
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) =>
          render?.shouldUpdate(prevValues, currentValues)
        }
      >
        {({ getFieldValue }) =>
          render?.renderCurrent?.(getFieldValue) ? (
            <Form.Item
              label={item.label}
              name={item.key}
              hidden={item.hidden}
              rules={rules}
              wrapperCol={wrapperCol}
              {...rest}
            >
              {children}
            </Form.Item>
          ) : null
        }
      </Form.Item>
    );
  });

  const FormItem = (itemProps: any) => {
    if (
      (_.isObject(itemProps.item.isRender) &&
        itemProps.item.isRender &&
        itemProps.item.isRender.key) ||
      itemProps.item.render
    ) {
      return <FormItemField {...itemProps} />;
    }
    return <FormItemNormal {...itemProps} />;
  };

  useEffect(() => {
    if (formValue) {
      form.setFieldsValue(formValue);
    }
  }, [formValue]);

  const validateMessages = {
    required: "'${name}' 是必选字段",
  };

  return (
    <Form
      form={form}
      name="form_editor"
      {...formItemLayout}
      onFinish={onFinish}
      initialValues={defaultValue}
      onValuesChange={handlechange}
      layout={layout}
      validateMessages={validateMessages}
      autoComplete={autoComplete ? "on" : "off"}
    >
      {config.map((item, i) => {
        return (
          <React.Fragment key={i.toString()}>
            {item.type === "Number" && (
              <FormItem item={item}>
                <InputNumber
                  disabled={item.disabled || false}
                  placeholder={item.placeholder || ""}
                  max={item.range && item.range[1]}
                  min={item.range && item.range[0]}
                  precision={item.precision}
                />
              </FormItem>
            )}
            {item.type === "Text" && (
              <FormItem item={item}>
                <Input
                  disabled={item.disabled || false}
                  placeholder={item.placeholder || ""}
                  maxLength={item.maxLength || ""}
                />
              </FormItem>
            )}
            {item.type === "TextArea" && (
              <FormItem item={item}>
                <TextArea
                  disabled={item.disabled || false}
                  placeholder={item.placeholder || ""}
                  rows={4}
                  maxLength={item.maxLength}
                />
              </FormItem>
            )}
            {item.type === "MutiText" && (
              <FormItem item={item}>
                <MutiText
                  limit={item.limit}
                  format={item.format}
                  maxLength={item.maxLength}
                />
              </FormItem>
            )}
            {item.type === "DataList" && (
              <FormItem item={item}>
                <DataList cropRate={item.cropRate} />
              </FormItem>
            )}
            {item.type === "Color" && (
              <FormItem item={item}>
                <Color />
              </FormItem>
            )}

            {item.type === "DatePicker" && (
              <FormItem item={item}>
                <DatePicker {...item} />
              </FormItem>
            )}

            {item.type === "Divider" && (
              <Divider
                dashed={!!item.dashed}
                orientation={item.orientation || "center"}
              >
                {item.text}
              </Divider>
            )}

            {item.type === "Select" && (
              <FormItem item={item}>
                <Select
                  placeholder={item.placeholder || "请选择"}
                  showSearch
                  mode={item.mode}
                  allowClear
                  disabled={item.disabled || false}
                >
                  {item.range.map((v: any, index: number) => {
                    return (
                      <Option
                        value={v[item.rangeKey] || v.value}
                        key={index.toString()}
                      >
                        {v[item.rangeLabel] || v.label}
                      </Option>
                    );
                  })}
                </Select>
              </FormItem>
            )}
            {item.type === "SelectGroup" && (
              <FormItem item={item}>
                <Select
                  placeholder={item.placeholder || "请选择"}
                  showSearch
                  mode={item.mode}
                  allowClear
                  disabled={item.disabled || false}
                >
                  {item.range.map((v: any) => (
                    <OptGroup label={v.label} key={v.id}>
                      {v.list.map((k: any) => (
                        <Option key={k.id} value={k[item.rangeKey] || k.value}>
                          {k[item.rangeLabel] || k.label}
                        </Option>
                      ))}
                    </OptGroup>
                  ))}
                </Select>
              </FormItem>
            )}
            {item.type === "Radio" && (
              <FormItem item={item}>
                <Radio.Group disabled={item.disabled || false}>
                  <Row gutter={[0, 5]}>
                    {item.range.map((v: any, index: number) => {
                      return (
                        <Col span={12} key={index.toString()}>
                          <Radio value={v[item.rangeKey] || v.value}>
                            {v[item.rangeLabel] || v.label}
                          </Radio>
                        </Col>
                      );
                    })}
                  </Row>
                </Radio.Group>
              </FormItem>
            )}
            {item.type === "RadioButton" && (
              <FormItem item={item}>
                <Radio.Group disabled={item.disabled || false}>
                  <Row gutter={item.gutter || [0, 0]}>
                    {item.range.map((v: any, index: number) => {
                      return (
                        <Col key={index.toString()}>
                          <Radio.Button value={v[item.rangeKey] || v.value}>
                            {v[item.rangeLabel] || v.label}
                          </Radio.Button>
                        </Col>
                      );
                    })}
                  </Row>
                </Radio.Group>
              </FormItem>
            )}
            {item.type === "Checkbox" && (
              <FormItem item={item}>
                <Checkbox.Group disabled={item.disabled || false}>
                  <Row>
                    {item.range.map((v: any, index: number) => {
                      return (
                        <Col span={12} key={index.toString()}>
                          <Checkbox value={v[item.rangeKey] || v.value}>
                            {v[item.rangeLabel] || v.label}
                          </Checkbox>
                        </Col>
                      );
                    })}
                  </Row>
                </Checkbox.Group>
              </FormItem>
            )}

            {item.type === "Switch" && (
              <FormItem item={item} valuePropName="checked">
                <Switch disabled={item.disabled || false} />
              </FormItem>
            )}
            {item.type === "CardPicker" && (
              <FormItem item={item} valuePropName="type">
                <CardPicker icons={item.icons} type={defaultValue.type} />
              </FormItem>
            )}
            {item.type === "Table" && (
              <FormItem item={item} valuePropName="data">
                <Table data={item.data} />
              </FormItem>
            )}
            {/* 自定义渲染内容 */}
            {item.type === "HTML" && (
              <FormItem item={item}>
                <div>{item.content()}</div>
              </FormItem>
            )}
            {/* 自定义渲染内容 */}
            {item.type === "PureText" && (
              <FormItem item={item}>
                <div style={item.customStyle || {}}>{item.content || ""}</div>
              </FormItem>
            )}
          </React.Fragment>
        );
      })}

      {onSubmit && (
        <Form.Item {...submitButtonLayout}>
          <Button type="primary" htmlType="submit">
            确定
          </Button>
        </Form.Item>
      )}
    </Form>
  );
};

export default memo(FormEditor);
