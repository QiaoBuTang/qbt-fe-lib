import React, {PropTypes, Component} from 'react';
import {TreeSelect} from 'antd';
import {UP_API_SERVER} from '../config.json';

const TreeNode = TreeSelect.TreeNode;

export default class Major extends Component {
  constructor(v) {
    super(v);

    let defaultValues = this.props.values ? this.props.values.map(val => {
      return val.value;
    }) : [];

    this.state = {
      values: defaultValues,
      datas: []
    };
  }

  componentWillMount() {
    fetch(`${UP_API_SERVER}/open/majors.json`).then(res => {
      return res.json();
    }).then(res => {
      this.setState({
        datas: res
      });
    });
  }

  handleChange = (value) => {
    let values = value || [];
    this.setState({
      values: values
    });

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
      this.props.onChange && this.props.onChange(values);
    }
  };

  generateTreeNode(data) {
    //因为antd默认的treeSelect的数据是要有label和value属性的，但我们的数据没有，所以这里手动添加TreeNode
    let _this = this;
    return data.map(d => {
      if (d.children.length !== 0) {
        return (
          <TreeNode value={d.id} title={d.name} key={d.id}>
            {_this.generateTreeNode(d.children)}
          </TreeNode>
        );
      } else {
        return (
          <TreeNode value={d.id} title={d.name} key={d.id} />
        );
      }
    });
  }

  render() {
    let tProps = {
      onChange: this.handleChange,
      showSearch: true,
      allowClear: true,
      multiple: this.props.multiple,
      treeNodeFilterProp: "label",
      searchPlaceholder: "请输入专业进行搜索",
      placeholder: "请输入专业",
      value: this.state.values || undefined, //后端会返回null
      dropdownStyle: { maxHeight: 300, overflow: 'auto' }
    };

    if (this.props.multiple) {
      tProps['treeCheckable'] = true;
      tProps['showCheckedStrategy'] = 'SHOW_PARENT';
    }

    return (
      <TreeSelect {...tProps}>
        {this.generateTreeNode(this.state.datas)}
      </TreeSelect>
    );
  }
}

Major.propTypes = {
  onChange: PropTypes.func,
  multiple: PropTypes.bool,
  disabled: PropTypes.bool,
  major_leaf_only: PropTypes.bool,
  keyProp: PropTypes.string,
  formModal: PropTypes.bool,
  values: PropTypes.array,
  name: React.PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array
  ])
};
