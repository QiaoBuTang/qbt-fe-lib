import React, {PropTypes, Component} from 'react';
import {DatePicker, Icon} from 'antd';
import moment from 'moment';
import {RANGE_SPLIT} from '../../helpers/const';

const { MonthPicker } = DatePicker;

export default class RangeMonthPicker extends Component {
  constructor(v) {
    super(v);

    let values = this.props.values,
      startDefaultValue = values[0] ? (values[0].value ? values[0].value.split(RANGE_SPLIT)[0] : '') : '',
      endDefaultValue = values[0] ? (values[0].value ? values[0].value.split(RANGE_SPLIT)[1] :  '') : '';

    this.state = {
      startValue: startDefaultValue ? moment(Number(startDefaultValue)): undefined,
      endValue: endDefaultValue ? moment(Number(endDefaultValue)): undefined
    };
  }

  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  onChange = (field, value) => {
    this.setState({
      [field]: value
    });
  };

  onStartChange = (value) => {
    this.onChange('startValue', value);

    //都没值时代表清空，也发送数据
    if (!this.state.endValue && !value) {
      this.props.onChange('');
    } else {
      this.props.onChange((value ? value.valueOf(): '') + RANGE_SPLIT + (this.state.endValue ? this.state.endValue.valueOf(): ''));
    }
  };

  onEndChange = (value) => {
    this.onChange('endValue', value);

    //都没值时代表清空，也发送数据
    if (!this.state.startValue && !value) {
      this.props.onChange('');
    } else {
      this.props.onChange((this.state.startValue ? this.state.startValue.valueOf() : '') + RANGE_SPLIT + (value ? value.valueOf() : ''));
    }
  };

  render() {
    const { startValue, endValue } = this.state;

    return (
      <div>
        <MonthPicker
          style={{width: "40%"}}
          disabledDate={this.disabledStartDate}
          defaultValue={startValue}
          placeholder={this.props.hint.split(RANGE_SPLIT)[0]}
          onChange={this.onStartChange}
          disabled={this.props.disabled}
        />
        <Icon type="minus" style={{padding: "0 3%"}}/>
        <MonthPicker
          style={{width: "40%"}}
          disabledDate={this.disabledEndDate}
          defaultValue={endValue}
          placeholder={this.props.hint.split(RANGE_SPLIT)[1]}
          onChange={this.onEndChange}
          disabled={this.props.disabled}
        />
      </div>
    );
  }
}

RangeMonthPicker.propTypes = {
  onChange: PropTypes.func,
  values: PropTypes.array,
  disabled: PropTypes.bool,
  hint: PropTypes.string
};
