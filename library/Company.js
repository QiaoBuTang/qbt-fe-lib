import React, {PropTypes, Component} from 'react';
import {Select} from 'antd';
import qs from 'qs';
import fetch from 'isomorphic-fetch';
import {UP_API_SERVER} from '../../../config.json';
import debounce from 'lodash/debounce';
const Option = Select.Option;

export default class Company extends Component {
  constructor(v) {
    super(v);

    let defaultValues = this.props.values ? this.props.values.map(val => {
      return val.value;
    }) : [];
    if (!this.props.multiple) {
      defaultValues = defaultValues[0];
    }

    this.state = {
      data: [],
      value: defaultValues,
      previousValue: defaultValues
    };
  }

  debounceEventHandler(...args) {
    const debouncedFn = debounce(...args);
    return function(e = '') {
      e.persist && e.persist();
      return debouncedFn(e);
    };
  }

  handleChange = (value) => {
    this.setState({value});

    let query = qs.stringify({
      keyword: value
    });

    fetch(`${UP_API_SERVER}/open/companies/search.json?${query}`).then(res => {
      return res.json();
    }).then(res => {
      this.setState({
        data: res
      });
    });
  };

  handleSearch = (value) => {
    let query = qs.stringify({
      keyword: value
    });

    fetch(`${UP_API_SERVER}/open/companies/search.json?${query}`).then(res => {
      return res.json();
    }).then(res => {
      this.setState({
        data: res
      });
    });
  };

  handleBlur = (val) => {
    let previousVal = this.state.previousValue;
    //如果blur的时候值并没有变化，那就没必要发请求保存
    if (!previousVal || val.toString() !== previousVal.toString()) {
      this.setState({
        previousValue: val
      });
      this.props.onChange && this.props.onChange(this.state.value);
    }
  };

  render() {
    const options = this.state.data.map(d => <Option key={d.name}>{d.name}</Option>);

    let selectProps = {
      value: this.state.value,
      disabled: this.props.disabled,
      placeholder: "请输入公司",
      notFoundContent: "",
      defaultActiveFirstOption: false,
      showArrow: false,
      filterOption: false,
      onBlur: this.handleBlur
    };

    if (this.props.multiple) {
      selectProps['mode'] = 'tags';
      selectProps['onSearch'] = this.debounceEventHandler(this.handleSearch, 500);
      selectProps['onChange'] = (value) => {
        this.setState({value});
      };
    } else {
      selectProps['mode'] = 'combobox';
      selectProps['onChange'] = this.debounceEventHandler(this.handleChange, 500);
    }

    return (
      <Select {...selectProps}>
        {options}
      </Select>
    );
  }
}

Company.propTypes = {
  onChange: PropTypes.func,
  multiple: PropTypes.bool,
  disabled: PropTypes.bool,
  values: PropTypes.array
};