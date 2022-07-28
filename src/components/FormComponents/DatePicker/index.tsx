/* eslint-disable react/no-unused-state */
import React from 'react';
import { DatePicker } from 'antd';
import type { Moment } from 'moment';
import moment from 'moment';

export type DateConfigType = (number | string | Moment | undefined)[];

// value 初始值传来，onchange item给的回调
interface DataPickerProps {
  value: DateConfigType;
  format: string;
  showTime: boolean;
  dateString: boolean;
  onChange?: (v: DateConfigType) => void;
  dayLimit: number | undefined;
  hourLimit: number | undefined;
}

interface stateProps {
  dates: Moment[];
  hackValue: undefined | [];
  value: DateConfigType;
}

const { RangePicker } = DatePicker;
const defaultFormat = 'YYYY-MM-DD HH:mm:ss';
class DatePickerItem extends React.Component<DataPickerProps> {
  state: stateProps = {
    dates: [],
    hackValue: undefined,
    value: [undefined, undefined],
  };

  // componentDidMount() {
  //   const { value = [] } = this.props;
  //   this.setState({
  //     value: this.dateTimeFormatToMoment(value)
  //   })
  // }

  disabledDate = (current: moment.Moment) => {
    const { dayLimit, hourLimit } = this.props;
    const { dates } = this.state;
    if (!dates || dates.length === 0) {
      return false;
    }
    if (
      (dayLimit && typeof dayLimit === 'number') ||
      (hourLimit && typeof hourLimit === 'number')
    ) {
      const type = dayLimit ? 'days' : 'hours';
      const limit = (dayLimit || hourLimit) as number;
      const tooLate = dates[0] && current.diff(dates[0], type) > limit;
      const tooEarly = dates[1] && dates[1].diff(current, type) > limit;
      return tooEarly || tooLate;
    }

    return false;
  };

  onChange = (v: any) => {
    const value = v || [];
    const { dateString } = this.props;
    let st: string | number = (value[0]?.valueOf() as number) || '';
    let et: string | number = (value[1]?.valueOf() as number) || '';
    if (dateString) {
      st = (moment(value[0]).format(defaultFormat) as string) || '';
      et = (moment(value[1]).format(defaultFormat) as string) || '';
    }
    this.setState({
      value,
    });
    if (this.props.onChange) {
      this.props.onChange([st, et]);
    }
  };

  onOpenChange = (open: boolean) => {
    if (open) {
      this.setState({
        hackValue: [],
        dates: [],
      });
    } else {
      this.setState({
        hackValue: undefined,
      });
    }
  };

  dateTimeFormatToMoment = (value: DateConfigType) => {
    if (value[0] && value[1]) {
      return [moment(value[0]), moment(value[1])];
    }
    return value;
  };

  render() {
    const { showTime, format, value: propValue = [undefined, undefined] } = this.props;
    const { value: stateValue = [undefined, undefined] } = this.state;
    const dateDefaultValues = propValue[0] ? propValue : stateValue;
    const value = this.dateTimeFormatToMoment(dateDefaultValues);

    return (
      <RangePicker
        ranges={{
          今日: [moment().startOf('day'), moment().endOf('day')],
          // '当周': [moment().startOf('week'), moment().endOf('week')],
          // '当月': [moment().startOf('month'), moment().endOf('month')],
        }}
        value={value as any}
        disabledDate={this.disabledDate}
        showTime={showTime}
        format={format || (showTime && 'YYYY/MM/DD HH:mm:ss') || 'YYYY/MM/DD'}
        onChange={this.onChange}
        onCalendarChange={(val) => {
          this.setState({ dates: val });
        }}
        onOpenChange={this.onOpenChange}
      />
    );
  }
}

export default DatePickerItem;
