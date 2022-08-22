import React from 'react';
import styled from 'styled-components';
import '@atlaskit/css-reset';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import initialData from './initial-data';
import Row from './row';
import Input from '../../coraWebComponents/forms/Input';
import Switch from '../../coraWebComponents/forms/Switch';
import Textarea from '../../coraWebComponents/forms/Textarea';
import NumericTextBox from '../../coraWebComponents/forms/NumericTextBox';
// import TimePicker from '../../coraWebComponents/forms/TimePicker';
// import DatePicker from '../../coraWebComponents/forms/DatePicker';
// import Upload from '../../coraWebComponents/forms/Upload';
import UnitNumericTextBox from '../../coraWebComponents/forms/NumericTextBox';
import { Alert } from 'bootstrap';

import './index.scss';

const ContainerGenerator = styled.div`
  width: 100%;
  border: 2px solid orange;
`;
const WrapperRow = styled.div``

class Generator extends React.Component {
  state = initialData;
  newArray = [];

  onDragEnd = result => {
    const { destination, source, draggableId, type } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === 'column') {
      const newColumnOrder = Array.from(this.state.columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      const newState = {
        ...this.state,
        columnOrder: newColumnOrder,
      }
      this.setState(newState);
      return;
    }

    if (type === 'row') {
      const newRowOrder = Array.from(this.state.rowOrder);
      newRowOrder.splice(source.index, 1);
      newRowOrder.splice(destination.index, 0, draggableId);

      const newState = {
        ...this.state,
        rowOrder: newRowOrder,
      }
      this.setState(newState);
      return;
    }

    const start = this.state.columns.find(x => x.id === source.droppableId);
    const finish = this.state.columns.find(x => x.id === destination.droppableId);

    if (start === finish) {
      const newItemIds = Array.from(start.itemIds);
      newItemIds.splice(source.index, 1);
      newItemIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        itemIds: newItemIds,
      };

      this.setState({
        columns: this.state.columns.map((col) => {
          if (col.id === destination.droppableId) {
            return newColumn
          }
          return col;
        })
      });
      return;
    }

    // Moving from one column to another
    const startItemIds = Array.from(start.itemIds);
    startItemIds.splice(source.index, 1);
    const newStart = {
      ...start,
      itemIds: startItemIds,
    };

    const finishItemIds = Array.from(finish.itemIds);
    finishItemIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      itemIds: finishItemIds,
    };

    this.setState({
      columns: this.state.columns.map((col) => {
        if (col.id === source.droppableId) {
          return newStart;
        } else if (col.id === destination.droppableId) {
          return newFinish
        } else {
          return col;
        }
      })
    });
  };

  addItem = (columnId) => {
    const itemField = prompt('Zadajte názov Fieldu');
    this.setState((state) => {
      const newItemId = `item-${state.items.length + 1}`;

      return {
        ...state,
        items: [
          ...state.items,
          {
            id: newItemId,
            field: itemField,
          }
        ],
        columns: state.columns.map(c => {
          if (c.id === columnId) {
            return {
              ...c, itemIds: [...c.itemIds, newItemId]
            }
          }
          return c;
        })
      }
    });
    //#region PRVKY vo formulare

    // //pridanie itemu na zakalde typu cez switch
    // const itemType = prompt('Aky item si prajete pridať ? (input, switch, textarea, numeric)');    

    // let newComponent = null;
    // switch (itemType) {
    //   case 'input': {
    //     newComponent = () => <>
    //       <Input
    //         title={"ID"}
    //         name={"ID"}
    //         field={"IDcko"}
    //         onChange={() => { }}
    //         value={2}
    //         disabled={false}
    //       />
    //     </>;
    //     break;
    //   }
    //   case 'switch': {
    //     newComponent = () => <>
    //       <Switch
    //         name="Switch"
    //         title="Switch"
    //         onChange={() => { }}
    //         checked={false}
    //       /></>;
    //     break;
    //   }
    //   case 'numeric': {
    //     newComponent = () => <>
    //       <NumericTextBox
    //         name="Number"
    //         tooltip={"Number"}
    //         title={"Number"}
    //         onChange={() => { }}
    //         value={123}
    //         spinners={false}
    //         placeholder="placeholder"
    //       /></>;
    //     break;
    //   }
    //   case 'textarea': {
    //     newComponent = () => <>
    //       <Textarea
    //         name={"Nazov"}
    //         onChange={() => { }}
    //         value="Meno"
    //         disabled={false}
    //       />
    //     </>;
    //     break;
    //   }

    //   default: {
    //     alert('Dany typ itemu neexistuje !');
    //     break;
    //   }
    // }

    // if (!newComponent) {
    //   return;
    // }
    //#endregion

  }

  addColumn = (rowId) => {
    this.setState((state) => {
      const newColId = `column-${state.columns.length + 1}`;

      return {
        ...state,
        columns: [
          ...state.columns,
          {
            id: newColId,
            itemIds: [],
          }
        ],
        columnOrder: [...state.columnOrder, newColId],
        rows: state.rows.map(x => {
          if (x.id === rowId) {
            return {
              ...x,
              columnIds: [...x.columnIds, newColId]
            };
          }
          else {
            return x;
          }
        }),
      }
    });
  }

  addRow = () => {
    const newRowId = `row-${Object.keys(this.state.rows).length + 1}`
    this.setState(state => ({
      rows: [...state.rows, { id: newRowId, columnIds: [] }],
      rowOrder: [...state.rowOrder, newRowId]
    }))
  }

  onClickRemoveItem = (id) => {
    const items = this.state.items.filter(x => x !== id);
    const columns = this.state.columns.map(col => {
      if (col.itemIds.indexOf(id) !== -1) {
        return { ...col, itemIds: col.itemIds.filter(x => x !== id) }
      }
      return col;
    })

    this.setState({ items, columns });
  }

  onClickRemoveColumn = (columnId, rowId) => {
    // alert(`${columnId} ${rowId}`)
    // alert(columnId)

    this.setState(state => ({
      ...state,
      columns: state.columns.filter(c => c !== columnId),
      columnOrder: state.columnOrder.filter(c => c !== columnId),
      rows: state.rows.map(x => {
        if (x.id === rowId) {
          console.log(x)
          return {
            ...x,
            columnIds: x.columnIds.filter(c => c !== columnId)
          };
        }
        else {
          return x;
        }
      }),
    }));
  }

  onClickRemoveRow = (id) => {
    this.setState(state => ({
      rows: state.rows.filter(x => x.id !== id),
      rowOrder: state.rowOrder.filter(x => x !== id)
    }))
  }

  generateUI = () => {
    const pages = [];
    const rows = [];
    this.state.rows.map(row => {
      const cols = [];
      row.columnIds.map(colId => {
        const col = this.state.columns.find(x => x.id === colId);
        const fields = [];
        col.itemIds.map(itemId => {
          const item = this.state.items.find(x => x.id === itemId);
          fields.push({ field: item.field })
        })
        cols.push(fields);
      });
      rows.push(cols);
    });
    pages.push(rows);
    const generatedUiScheme = JSON.stringify(pages, null, '\t');
    const generatedUiSchemeMinified = JSON.stringify(pages);
    this.props.setGeneratedUiScheme({ generatedUiScheme, generatedUiSchemeMinified });
  }

  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <ContainerGenerator>
          <button onClick={this.addRow} className="green-button">+ Row</button>
          <button onClick={this.generateUI} className="green-button">Generate UI</button>
          {/* <div style={{
            // border: "5px solid green",
            // display: "inline-flex",
            // flexDirection: "row",
            // // width: "100%",
            // alignItems: "stretch",
            // justifyContent: "center"
          }}> */}
          <Droppable droppableId="all-row" direction="vertical" type="row">
            {(provided, snapshot) => (
              <WrapperRow
                {...provided.droppableProps}
                innerRef={provided.innerRef}
              >
                {this.state.rowOrder.map((rowId, index) => {
                  const row = this.state.rows.find(x => x.id === rowId);
                  const columns = row.columnIds.map(
                    colId => this.state.columns.find(x => x.id === colId)
                  );

                  return <Row
                    row={row}
                    key={row.id}
                    columns={columns}
                    items={this.state.items}
                    index={index}
                    onClickRemoveItem={this.onClickRemoveItem}
                    onClickRemoveColumn={(columnId) => this.onClickRemoveColumn(columnId, row.id)}
                    onClickRemoveRow={this.onClickRemoveRow}
                    addColumn={() => this.addColumn(row.id)}
                    addItem={this.addItem}
                  />
                })}
                {provided.placeholder}
              </WrapperRow>
            )}
          </Droppable>
        </ContainerGenerator>
      </DragDropContext >
    );
  }
}


export default Generator;
