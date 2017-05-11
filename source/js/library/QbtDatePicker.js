import React, {PropTypes, Component} from 'react';
import {DatePicker, TimePicker, Select} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import RangeMonthPicker from './RangeMonthPicker';
import RangeDatePicker from './RangeDatePicker';
import RangeTimePicker from './RangeTimePicker';
import RangeYearPicker from './RangeYearPicker';

const { MonthPicker, RangePicker } = DatePicker;

export default class QbtDatePicker extends Component {
  getYears() {
    let years = [];
    for (let i = 1900; i <= 2100; i++) {
      years.push(<Select.Option key={i} value={i.toString()}>{i}</Select.Option>);
    }

    return years;
  }

  render() {
    let date_flags = this.props.date_flags,
      hint = this.props.hint,
      values = this.props.values;
    if (date_flags === 'true,false,false,false,false,false') {
      //精确到年
      if (this.props.date_range) {
        return (
          <RangeYearPicker disabled={this.props.disabled} hint={hint} values={values} onChange={this.props.onChange}/>
        );
      } else {
        return (
          <Select disabled={this.props.disabled} placeholder={hint} defaultValue={values[0] ? moment(Number(values[0].value)).format('YYYY') : undefined} onChange={year => this.props.onChange(new Date().setFullYear(year))}>
            {this.getYears()}
          </Select>
        );
      }
    } else if (date_flags === 'true,true,false,false,false,false') {
      //精确到月
      if (this.props.date_range) {
        return (
          <RangeMonthPicker disabled={this.props.disabled} hint={hint} values={values} onChange={this.props.onChange}/>
        );
      } else {
        return (
          <MonthPicker disabled={this.props.disabled} placeholder={hint} defaultValue={values[0] ? moment(Number(values[0].value)): undefined} onChange={momentTime => this.props.onChange(momentTime ? momentTime.valueOf() : '')}/>
        );
      }
    } else if (date_flags === 'true,true,true,false,false,false') {
      //精确到日
      if (this.props.date_range) {
        return (
          <RangeDatePicker disabled={this.props.disabled} hint={hint} values={values} onChange={this.props.onChange}/>
        );
      } else {
        return (
          <DatePicker disabled={this.props.disabled} placeholder={hint} defaultValue={values[0] ? moment(Number(values[0].value)): undefined} onChange={momentTime => this.props.onChange(momentTime ? momentTime.valueOf() : '')}/>
        );
      }
    } else if (date_flags === 'false,false,false,true,true,true') {
      //精确到只有时分秒
      if (this.props.date_range) {
        return (
          <RangeTimePicker disabled={this.props.disabled} hint={hint} values={values} onChange={this.props.onChange}/>
        );
      } else {
        return (
          <TimePicker disabled={this.props.disabled} placeholder={hint} defaultValue={values[0] ? moment(Number(values[0].value)): undefined} onChange={momentTime => this.props.onChange(momentTime ? momentTime.valueOf() : '')}/>
        );
      }
    } else {
      return null;
    }
  }
}

QbtDatePicker.propTypes = {
  onChange: PropTypes.func,
  date_flags: PropTypes.string,
  date_range: PropTypes.bool,
  disabled: PropTypes.bool,
  values: PropTypes.array,
  hint: PropTypes.string
};
