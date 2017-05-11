import React, {PropTypes, Component} from 'react';
import {InputNumber, Icon} from 'antd';
import {isNumber} from 'lodash';
import {RANGE_SPLIT} from '../helpers/const';

export default class RangeInputNumber extends Component {
  state = {
    startValue: this.props.values[0] ? (this.props.values[0].value ? this.props.values[0].value.split(RANGE_SPLIT)[0] : '') : '',
    endValue: this.props.values[0] ? (this.props.values[0].value ? this.props.values[0].value.split(RANGE_SPLIT)[1] :  '') : ''
  };

  onStartChange = (value) => {
    this.setState({
      startValue: String(value)
    });

    this.props.onChange((isNumber(value) ? value : '') + RANGE_SPLIT + (this.state.endValue || ''));
  };

  onEndChange = (value) => {
    this.setState({
      endValue: String(value)
    });

    this.props.onChange((this.state.startValue || '') + RANGE_SPLIT + (isNumber(value) ? value : ''));
  };

  render() {
    const { startValue, endValue } = this.state;
    let hint = this.props.hint;
    return (
      <div>
        <InputNumber
          style={{width: "40%", marginRight: 0}}
          defaultValue={startValue}
          placeholder={hint.split(RANGE_SPLIT)[0]}
          onChange={this.onStartChange}
          disabled={this.props.disabled}
        />
        <Icon type="minus" style={{padding: "0 3%"}}/>
        <InputNumber
          style={{width: "40%"}}
          defaultValue={endValue}
          placeholder={hint.split(RANGE_SPLIT)[1]}
          onChange={this.onEndChange}
          disabled={this.props.disabled}
        />
      </div>
    );
  }
}

RangeInputNumber.propTypes = {
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  disabled: PropTypes.bool,
  values: PropTypes.array,
  hint: PropTypes.string
};
