import React, {PropTypes, Component} from 'react';
import BasicSearchSelect from './BasicSearchSelect';
import {UP_API_SERVER} from '../config.json';

export class Region extends Component {
  render() {
    //因为后端数据结构是label,value一起的形式，所以这里的值就把value单独抽出来
    let valueArr = this.props.values ? this.props.values.map(val => {
      return val.value;
    }) : [];
    //这里的keyProp字段，是当组件用在弹窗中，每次弹窗出来，有不同的key，那组件就会重渲染，不会遗留上次的数据
    return (
      <BasicSearchSelect disabled={this.props.disabled} formModal={this.props.formModal} key={this.props.keyProp || ''}
                         value={valueArr} values={this.props.values} multiple={this.props.multiple}
                         leaf_only={this.props.region_leaf_only} onChange={this.props.onChange}
                         api={`${UP_API_SERVER}/open/countries/search.json`} placeholder="请输入地区进行搜索"/>
    );
  }
}

export class University extends Component {
  render() {
    //因为后端数据结构是label,value一起的形式，所以这里的值就把value单独抽出来
    let valueArr = this.props.values ? this.props.values.map(val => {
      return val.value;
    }) : [];
    //这里的keyProp字段，是当组件用在弹窗中，每次弹窗出来，有不同的key，那组件就会重渲染，不会遗留上次的数据
    return (
      <BasicSearchSelect disabled={this.props.disabled} formModal={this.props.formModal} key={this.props.keyProp || ''}
                         value={valueArr} values={this.props.values} multiple={this.props.multiple}
                         onChange={this.props.onChange}
                         api={`${UP_API_SERVER}/open/universities/search.json`}
                         placeholder="请输入学校进行搜索，若输入985，也会匹配出相应学校"/>
    );

  }
}

// export class Major extends Component {
//   render() {
//     //因为后端数据结构是label,value一起的形式，所以这里的值就把value单独抽出来
//     let valueArr = this.props.values ? this.props.values.map(val => {
//       return val.value;
//     }) : [];
//     //这里的keyProp字段，是当组件用在弹窗中，每次弹窗出来，有不同的key，那组件就会重渲染，不会遗留上次的数据
//     return (
//       <BasicSearchSelect disabled={this.props.disabled} formModal={this.props.formModal} key={this.props.keyProp || ''}
//                          value={valueArr} values={this.props.values} multiple={this.props.multiple}
//                          leaf_only={this.props.major_leaf_only} onChange={this.props.onChange}
//                          api={`${UP_API_SERVER}/open/majors/search.json`} placeholder="请输入专业进行搜索"/>
//     );
//   }
// }


Region.propTypes = {
  onChange: PropTypes.func,
  multiple: PropTypes.bool,
  disabled: PropTypes.bool,
  region_leaf_only: PropTypes.bool,
  keyProp: PropTypes.string,
  formModal: PropTypes.bool,
  values: PropTypes.array,
  name: React.PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array
  ])
};
University.propTypes = {
  onChange: PropTypes.func,
  multiple: PropTypes.bool,
  disabled: PropTypes.bool,
  scope: PropTypes.bool,
  keyProp: PropTypes.string,
  formModal: PropTypes.bool,
  values: PropTypes.array,
  name: React.PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array
  ])
};
// Major.propTypes = {
//   onChange: PropTypes.func,
//   multiple: PropTypes.bool,
//   disabled: PropTypes.bool,
//   major_leaf_only: PropTypes.bool,
//   keyProp: PropTypes.string,
//   formModal: PropTypes.bool,
//   values: PropTypes.array,
//   name: React.PropTypes.oneOfType([
//     PropTypes.string,
//     PropTypes.array
//   ])
// };
