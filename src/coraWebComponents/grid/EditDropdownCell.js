import React from 'react';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { GridCell } from '@progress/kendo-react-grid';

/**
 * Edit dropdown cell component
 * @module
 * @param {func} getProps - Get props function
 * @param {func} getColumns - Get columns function
 */
export function EditDropdownCell({ getProps, getColumns }) {
  return class extends GridCell {
    constructor(props) {
      super(props);
      this.state = {
        localizedData: [],
      }
    }

    componentDidMount() {
      const getedProps = getProps();
      let schema = getColumns().filter(item =>
        item.field === this.props.field
      )

      if (getedProps.parentProps[schema[0]['data']] && getedProps.parentProps[schema[0]['data']].data.length === 0) {
        getedProps.parentProps[schema[0]['onChange']]({ filters: [] }, { skip: 0, take: 100 }, [], schema[0]['primaryField'])
      }
    }

    handleChange = (e) => {
      this.props.onChange({
        dataItem: this.props.dataItem,
        field: this.props.field.split(".")[0],
        syntheticEvent: e.syntheticEvent,
        value: e.target.value
      });
    }

    render() {
      const getedProps = getProps();
      const schema = getColumns().filter(item =>
        item.field === this.props.field
      )

      const { dataItem, field } = this.props;
      let splitField = field.split(".")[0];
      const dataValue = dataItem[splitField] === null ? '' : dataItem[splitField];
      const data = getedProps.parentProps[schema[0]['data']] ? getedProps.parentProps[schema[0]['data']].data : [];

      return (
        <td>
          {(dataItem.inEdit === true || dataItem.inEdit === splitField) ? (
            <DropDownList
              style={{ width: "100px" }}
              onChange={this.handleChange}
              value={dataValue && schema[0]['primaryField'] !== undefined ? data.find(c => c[schema[0]['primaryField']] === dataValue[schema[0]['primaryField']]) : ''}
              data={data}
              textField={schema[0]['textField']}
            />
          ) : (
              dataValue[schema[0]['textField']]
            )}
        </td>
      );
    }
  }
}


