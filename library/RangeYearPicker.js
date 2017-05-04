import React, {PropTypes, Component} from 'react';
import {Select, Icon} from 'antd';
import moment from 'moment';
import {RANGE_SPLIT} from '../../helpers/const';

export default class RangeMonthPicker extends Component {
  constructor(v) {
    super(v);

    let values = this.props.values,
      startDefaultValue = values[0] ? (values[0].value ? values[0].value.split(RANGE_SPLIT)[0] : '') : '',
      endDefaultValue = values[0] ? (values[0].value ? values[0].value.split(RANGE_SPLIT)[1] :  '') : '';

    this.state = {
      startValue: startDefaultValue ? moment(Number(startDefaultValue)).format('YYYY') : undefined,
      endValue: endDefaultValue ? moment(Number(endDefaultValue)).format('YYYY') : undefined
    };
  }

  getStartYears() {
    let years = [];
    for (let i = 1970; i <= (this.state.endValue ? (Number(this.state.endValue) - 1) : 2100); i++) {
      years.push(<Select.Option key={i} value={i.toString()}>{i}</Select.Option>);
    }

    return years;
  }

  getEndYears() {
    let years = [];
    for (let i = (this.state.startValue ? (Number(this.state.startValue) + 1) : 1970); i <= 2100; i++) {
      years.push(<Select.Option key={i} value={i.toString()}>{i}</Select.Option>);
    }

    return years;
  }

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
      this.props.onChange((value ? new Date().setFullYear(value) : '') + RANGE_SPLIT + (this.state.endValue ? new Date().setFullYear(this.state.endValue) : ''));
    }
  };

  onEndChange = (value) => {
    this.onChange('endValue', value);

    //都没值时代表清空，也发送数据
    if (!this.state.startValue && !value) {
      this.props.onChange('');
    } else {
      this.props.onChange((this.state.startValue ? new Date().setFullYear(this.state.startValue) : '') + RANGE_SPLIT + (value ? new Date().setFullYear(value) : ''));
    }
  };

  render() {
    const { startValue, endValue } = this.state;

    return (
      <div>
        <Select disabled={this.props.disabled} defaultValue={startValue} style={{width: "40%"}} onChange={this.onStartChange} placeholder={this.props.hint.split(RANGE_SPLIT)[0]} >
          {this.getStartYears()}
        </Select>
        <Icon type="minus" style={{padding: "0 3%"}}/>
        <Select disabled={this.props.disabled} defaultValue={endValue} style={{width: "40%"}} onChange={this.onEndChange} placeholder={this.props.hint.split(RANGE_SPLIT)[1]} >
          {this.getEndYears()}
        </Select>
      </div>
    );
  }
}

RangeMonthPicker.propTypes = {
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  values: PropTypes.array,
  hint: PropTypes.string
};
