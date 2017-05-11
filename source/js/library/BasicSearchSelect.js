import React, {PropTypes, Component} from 'react';
import {Select} from 'antd';
import debounce from 'lodash/debounce';
import qs from 'qs';
import fetch from 'isomorphic-fetch';
import './BasicSearchSelect.scss';

export default class BasicSearchSelect extends Component {
  state = {
    datas: this.props.values || [],
    selectedDatas: {} //选中过的数据，包括key和label，为了当在FormModal的时候，可以传值
  };

  handleSearch = (value) => {
    let _this = this;
    //leaf_only可以根据Region组件传入的参数来确定，如果没有，那就按multiple来确定
    let leaf_only = this.props.leaf_only;
    //搜索数据，为空时不发
    value && this.getLibraryData(_this.props.api, value, leaf_only).then((res) => {
      _this.setState({
        datas: res
      });
    });
  };

  getLibraryData(api, keyword, leaf_only) {
    let query = qs.stringify({
      keyword,
      leaf_only
    });
    return new Promise((resolve) => {
      fetch(`${api}?${query}`).then(res => {
        return res.json();
      }).then(res => {
        resolve(res);
      });
    });
  }

  handleChange = (values) => {
    if (this.props.formModal) {
      //如果是formModal的情况下，因为需要直接本地添加进总数据中，所以不能只是单纯的[id, id,id]形式，需要变成后端传给前端的数据格式
      if (Array.isArray(values)) {
        let serverFormValues = values.map(v => {
          return {
            value: v,
            label: this.state.selectedDatas[v]
          };
        });
        this.props.onChange(serverFormValues);
      } else {
        this.props.onChange([{
          value: values,
          label: this.state.selectedDatas[values]
        }]);
      }
    } else {
      if (this.props.onChange) {
        this.props.onChange(values);
      }
    }
  };

  handleSelect = (value, option) => {
    let _this = this;

    let currentSelectedDatas = _this.state.selectedDatas;
    if (!currentSelectedDatas[value]) {
      currentSelectedDatas[value] = option.props.children;
    }

    this.setState({
      selectedDatas: currentSelectedDatas
    });
  };

  render() {
    const Option = Select.Option;
    let selectProps = {
      filterOption: false,
      allowClear: true,
      showSearch: true,
      placeholder: this.props.placeholder,
      notFoundContent: "",
      onSearch: debounce(this.handleSearch, 300),
      onSelect: this.handleSelect,
      onChange: this.handleChange
    };
    if (this.props.multiple) {
      selectProps = Object.assign(selectProps, {
        mode: "multiple"
      });
    } else {
      selectProps = Object.assign(selectProps, {
        allowClear: true
      });
    }

    return (
      <Select style={{width: "100%"}} {...selectProps} defaultValue={this.props.value} disabled={this.props.disabled}>
        {this.state.datas.map(data => {
          return (
            <Option key={data.value || data.id}>
              {data.label || data.name}
              {data.parents &&
              <span className="searchSelect-option__info">{`（${data.parents}）`}</span>}
            </Option>
          );
        })}
      </Select>
    );
  }
}

BasicSearchSelect.propTypes = {
  onChange: PropTypes.func,
  multiple: PropTypes.bool,
  api: PropTypes.string,
  placeholder: PropTypes.string,
  data: PropTypes.array,
  leaf_only: PropTypes.bool,
  formModal: PropTypes.bool,
  disabled: PropTypes.bool,
  value: React.PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array
  ]),
  values: PropTypes.array
};
