import React, { memo } from 'react';
import { Input, Button, Popconfirm, message } from 'antd';
import { MinusCircleFilled } from '@ant-design/icons';
import { extractStringVarietyNumber, getMaxLength } from '@/utils/act_utils';
import styles from './index.less';
import { TMutiTextDefaultType, TMutiTextObjectType } from '../types';

type MultiTextProps = {
  onChange?: (v: TMutiTextDefaultType | TMutiTextObjectType) => void;
  value?: TMutiTextDefaultType | TMutiTextObjectType;
  limit?: number;
  format?: string;
  maxLength?: number;
};

export default memo(function MutiText(props: MultiTextProps) {
  const { value, onChange, limit = 30, format = 'default', maxLength = 10000 } = props;

  const valueInit: TMutiTextObjectType =
    format === 'string'
      ? (value as TMutiTextDefaultType)?.map((item) => ({ text: item }))
      : (value as TMutiTextObjectType);

  const handleAdd = () => {
    if (format === 'string') {
      onChange &&
        onChange([
          ...(valueInit as TMutiTextObjectType).map((item) => item.text)!,
          '新增项目',
        ] as TMutiTextDefaultType);
    } else {
      onChange && onChange([...valueInit!, { text: '新增项目' }] as TMutiTextObjectType);
    }
  };

  const handleDel = (index: number) => {
    const newList = valueInit!.filter((_item, i) => i !== index);
    onChange && onChange(newList);
  };

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const inputText = e.target.value.trim();
    const newList = valueInit!.map((item, i) =>
      i === index ? { text: inputText } : item,
    ) as TMutiTextObjectType;
    if (format === 'string') {
      onChange && onChange([...newList.map((item) => item.text)!]);
    } else {
      onChange && onChange([...newList!]);
    }
  };

  const onBlurHandler = (index: number, e: any) => {
    let inputText = e.target.value.trim();
    const { alphabet, character, number } = extractStringVarietyNumber(inputText || '');
    const inputNumber = character * 2 + alphabet + number;
    if (inputNumber > maxLength * 2) {
      message.warning(`最大支持${maxLength}个中文字符或${maxLength * 2}个英文字符`);
      inputText = inputText.slice(0, getMaxLength(inputText, maxLength));
    }
    const newList = valueInit!.map((item, i) =>
      i === index ? { text: inputText } : item,
    ) as TMutiTextObjectType;
    if (format === 'string') {
      onChange && onChange([...newList.map((item) => item.text)!]);
    } else {
      onChange && onChange([...newList!]);
    }
  };

  return (
    <div className={styles.mutiText}>
      {valueInit && valueInit.length ? (
        valueInit!.map((item, i) => {
          return (
            <div className={styles.iptWrap} key={i}>
              <Input
                value={item.text}
                onChange={(e) => handleChange(i, e)}
                onBlur={(e) => onBlurHandler(i, e)}
              />
              <Popconfirm
                title="确定要删除吗?"
                onConfirm={() => handleDel(i)}
                placement="leftTop"
                okText="确定"
                cancelText="取消"
              >
                <span className={styles.delBtn}>
                  <MinusCircleFilled />
                </span>
              </Popconfirm>
            </div>
          );
        })
      ) : (
        <></>
      )}
      {value && value.length < limit && (
        <div className={styles.iptWrap}>
          <Button block onClick={handleAdd}>
            添加
          </Button>
        </div>
      )}
    </div>
  );
});
