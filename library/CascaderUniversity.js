import React, {PropTypes, Component} from 'react';
import {Select, TreeSelect} from 'antd';
import fetch from 'isomorphic-fetch';
import {UP_API_SERVER} from '../../../config.json';
import {University} from './SearchSelect';
import './CascaderUniversity.scss';

const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;

export default class CascaderUniversity extends Component {
  constructor(v) {
    super(v);

    let defaultValues = this.props.values[0] ? JSON.parse(this.props.values[0].value) : {};
    let defaultLables = this.props.values[0] ?JSON.parse(this.props.values[0].label) : {};
    this.state = {
      regionDatas: [],
      regionId: defaultValues.region || [],
      categoryId: defaultValues.category || [],
      universitiesValue: this.generateUniversities(defaultValues, defaultLables)
    };
  }

  componentWillMount() {
    fetch(`${UP_API_SERVER}/open/countries/china.json`).then(res => {
      return res.json();
    }).then(res => {
      this.setState({
        regionDatas: res.children
      });
    });
  }

  generateTreeNode(data) {
    //因为antd默认的treeSelect的数据是要有label和value属性的，但我们的数据没有，所以这里手动添加TreeNode
    let _this = this;
    return data.map(d => {
      if (d.children.length !== 0) {
        return (
          <TreeNode value={d.id} title={d.zh_cn} key={d.id}>
            {_this.generateTreeNode(d.children)}
          </TreeNode>
        );
      } else {
        return (
          <TreeNode value={d.id} title={d.zh_cn} key={d.id} />
        );
      }
    });
  }

  generateUniversities = (defaultValues, defaultLables) => {
    if (defaultValues.universities) {
      return defaultValues.universities.map((v, index) => {
        return {
          value: v,
          label: defaultLables.universities[index]
        };
      });
    } else {
      return [];
    }

  };

  onChange = (region, category, universities = []) => {
    let obj = {
      universities: universities
    };
    region && (obj['region'] = region);
    category && (obj['category'] = category);
    this.props.onChange && this.props.onChange(JSON.stringify(obj));
  };

  handleRegionChange = (value) => {
    let regionValue = value ? [value]: [];
    this.setState({
      regionId: regionValue,
      universitiesValue: []
    });
    this.onChange(regionValue, this.state.categoryId);
  };

  handleCategoryChange = (value) => {
    this.setState({
      categoryId: value,
      universitiesValue: []
    });
    this.onChange(this.state.regionId, value);
  };

  handleUniversityChange = (value) => {
    if (value.length !== 0) {
      this.setState({
        categoryId: [],
        regionId: []
      });
    }

    this.onChange(undefined, undefined, value);
  };

  render() {
    let hideUniversity = this.state.regionId.length || this.state.categoryId.length;  //只要选了地区，或类别，那选学校的就应该消失
    let universityDisplay = hideUniversity ? 'none' : 'inline-block';
    let selectStyle = {
      width: hideUniversity ? '40%' : '25%',
      marginRight: hideUniversity ? '8%' : '5%'
    };
    const tProps = {
      onChange: this.handleRegionChange,
      showSearch: true,
      allowClear: true,
      treeNodeFilterProp: "label",
      searchPlaceholder: "输入地区搜索",
      placeholder: "请选择地区",
      value: this.state.regionId[0] || undefined, //后端会返回null
      dropdownStyle: { maxHeight: 300, overflow: 'auto' }
    };

    return (
      <div>
        <TreeSelect allowClear style={selectStyle} {...tProps}>
          {this.generateTreeNode(this.state.regionDatas)}
        </TreeSelect>
        <Select style={selectStyle} allowClear disabled={this.props.disabled} mode="multiple" value={this.state.categoryId} placeholder="请选择类型" onChange={this.handleCategoryChange}>
          <Option value="985">985</Option>
          <Option value="211">211</Option>
          <Option value="普通本科">普通本科</Option>
          <Option value="三本院校">三本院校</Option>
          <Option value="高职高专">高职高专</Option>
        </Select>
        <div className="cascaderUniversity-wrapper" style={{width: '40%', display: `${universityDisplay}`}}>
          <University values={this.state.universitiesValue} onChange={this.handleUniversityChange} multiple disabled={this.props.disabled}/>
        </div>
      </div>
    );
  }
}

CascaderUniversity.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.array,
  disabled: PropTypes.bool,
  values: PropTypes.array
};
