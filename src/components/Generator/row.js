import React from 'react'
import styled from 'styled-components';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import Column from './column';

const RowContainer = styled.div`
  margin: 8px;
  width: 100%; 
  padding: 1px;
  /* background-color: ${props => (props.isDragging ? 'yellow' : 'lightyellow')};
  border: ${props => (props.isDragging ? '5px solid grey' : '3px solid lightgrey')}; */
  border: 2px solid yellow; 
`;

const ColumnList = styled.div`
  padding: 8px;
  /* transition: background-color 0.2s ease;
  background-color: ${props => (props.isDraggingOver ? 'lightgreen' : 'white')}; */
  border: 2px solid red;
  display: flex;
  width: 100%;
`;
const RowButton = styled.div``;

export default class Row extends React.Component {
  render() {
    const { columns, onClickRemoveItem, onClickRemoveColumn, addItem } = this.props;
    return (
      <Draggable draggableId={this.props.row.id} index={this.props.index}>
        {(provided) => (
          <RowContainer
            {...provided.draggableProps}
            innerRef={provided.innerRef}
          >
            <RowButton
              {...provided.dragHandleProps}
            >
              <button className="red-button" onClick={() => this.props.onClickRemoveRow(this.props.row.id)}>x Row</button>
              <button className="green-button" onClick={() => this.props.addColumn(this.props.row.id)}>+ Col</button>
            </RowButton>
            <Droppable droppableId={this.props.row.id} direction="vertical" type="column">

              {(provided, snapshot) => (

                <ColumnList
                  innerRef={provided.innerRef}
                  {...provided.droppableProps}
                // isDraggingOver={snapshot.isDraggingOver}
                >
                  {columns.map((column, index) => {

                    const items = column.itemIds.map(
                      itemId => this.props.items.find(x => x.id === itemId),
                    );
                    return <Column
                      key={column.id}
                      column={column}
                      items={items}
                      index={index}                    
                      onClickRemoveItem={onClickRemoveItem}
                      onClickRemoveColumn={onClickRemoveColumn}
                      addItem={addItem}
                    />;
                  })}
                  {provided.placeholder}
                </ColumnList>
              )}
            </Droppable>
          </RowContainer>
        )}
      </Draggable>
    )
  }
}
