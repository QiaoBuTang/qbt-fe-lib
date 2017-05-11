import React, {PropTypes, Component} from 'react';
import {TreeSelect} from 'antd';
import fetch from 'isomorphic-fetch';
import {UP_API_SERVER} from '../config.json';
import './Category.scss';

const TreeNode = TreeSelect.TreeNode;
export default class Category extends Component {
  state = {
    datas: []
  };

  componentWillMount() {
    fetch(`${UP_API_SERVER}/open/job_categories.json`).then(res => {
      return res.json();
    }).then(res => {
      this.setState({
        datas: res
      });
    });
  }

  generateTreeNode(data) {
    //因为antd默认的treeSelect的数据是要有label和value属性的，但我们的数据没有，所以这里手动添加TreeNode
    let _this = this;
    return data.map(d => {
      if (d.children.length !== 0) {
        return (
          <TreeNode className="treeSelect-category__li" value={d.id} title={d.name} key={d.id} disableCheckbox>
            {_this.generateTreeNode(d.children)}
          </TreeNode>
        );
      } else {
        return (
          <TreeNode className="treeSelect-category__leaf" value={d.id} title={d.name} key={d.id} />
        );
      }
    });
  }

  onChange = (vals) => {
    this.props.onChange && this.props.onChange(vals);
  };

  render() {
    const tProps = {
      onChange: this.onChange,
      multiple: true,
      treeCheckable: true,
      showSearch: true,
      treeNodeFilterProp: "label",
      searchPlaceholder: '请选择职类, 输入可搜索',
      dropdownStyle: { maxHeight: 300, overflow: 'auto' }
    };
    if (this.props.values && this.props.values.length !== 0) {
      tProps['value'] = this.props.values.map(v => {
        return v.value;
      });
    } else if (this.props.value) {
      tProps['value'] = this.props.value;
    }
    return (
      <TreeSelect {...tProps}>
        {this.generateTreeNode(this.state.datas)}
      </TreeSelect>
    );
  }
}

Category.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.array,
  values: PropTypes.array
};
