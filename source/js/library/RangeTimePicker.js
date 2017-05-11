import React, {PropTypes, Component} from 'react';
import {TimePicker, Icon} from 'antd';
import moment from 'moment';
import {RANGE_SPLIT} from '../helpers/const';

export default class RangeTimePicker extends Component {
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
        <TimePicker
          style={{width: "40%"}}
          defaultValue={startValue}
          placeholder={this.props.hint.split(RANGE_SPLIT)[0]}
          onChange={this.onStartChange}
          disabled={this.props.disabled}
        />
        <Icon type="minus" style={{padding: "0 3%"}}/>
        <TimePicker
          style={{width: "40%"}}
          defaultValue={endValue}
          placeholder={this.props.hint.split(RANGE_SPLIT)[1]}
          onChange={this.onEndChange}
          disabled={this.props.disabled}
        />
      </div>
    );
  }
}

RangeTimePicker.propTypes = {
  onChange: PropTypes.func,
  values: PropTypes.array,
  disabled: PropTypes.bool,
  hint: PropTypes.string
};
