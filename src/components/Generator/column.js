import React from 'react';
import styled from 'styled-components';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import Item from './item';

const ColumnContainer = styled.div`
  margin: 8px;
  border: 3px solid lightgrey;
  border-radius: 2px;
  flex: 1;
  /* background-color: ${props => (props.isDragging ? 'lightblue' : 'white')};
  border: ${props => (props.isDragging ? '4px solid grey' : '3px solid lightgrey')}; */
`;

const Title = styled.h3`
  padding: 8px;
`;
const ItemList = styled.div`
  padding: 8px;
  transition: background-color 0.2s ease;
  background-color: ${props => (props.isDraggingOver ? 'skyblue' : 'white')};
  flex-grow: 1;
  min-width: 100%;
  min-height: 100px;
`;

export default class Column extends React.Component {
  render() {
    return (
      <Draggable draggableId={this.props.column.id} index={this.props.index}>
        {(provided, snapshot) => (
          <ColumnContainer
            {...provided.draggableProps}
            innerRef={provided.innerRef}
          // isDragging={snapshot.isDragging}
          >
            <div
              {...provided.dragHandleProps}
            >
              <button className="red-button" onClick={() => this.props.onClickRemoveColumn(this.props.column.id)}>x Col</button>
              <button className="green-button" onClick={() => this.props.addItem(this.props.column.id)}>+ Item</button>
            </div>
            <Droppable droppableId={this.props.column.id} type="item">

              {(provided, snapshot) => (

                <ItemList
                  innerRef={provided.innerRef}
                  {...provided.droppableProps}
                  isDraggingOver={snapshot.isDraggingOver}
                >
                  {this.props.items.map((item, index) => (
                    <Item
                      key={item.id}
                      item={item}
                      index={index}
                      onClickRemoveItem={this.props.onClickRemoveItem}
                    />
                  ))}
                  {provided.placeholder}
                </ItemList>
              )}

            </Droppable>
            {/* </div> */}
          </ColumnContainer>
        )}
      </Draggable>
    );
  }
}
