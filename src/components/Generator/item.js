import React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';

const ItemContainer = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: ${props => (props.isDragging ? 'lightblue' : 'white')};
  border: ${props => (props.isDragging ? '2px solid grey' : '1px solid lightgrey')};
`;

export default class Item extends React.Component {

  render() {
    //vytvaranie komponenetu vramci itemu
    // const Comp = this.props.item.content;
    return (
      <Draggable draggableId={this.props.item.id} index={this.props.index}>
        {(provided, snapshot) => (
          <ItemContainer
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            innerRef={provided.innerRef}
            isDragging={snapshot.isDragging}
          >
            <div style={{ display: "flex" }}>
              <div style={{ width: "80%" }}>{this.props.item.field}</div>
              <div style={{ width: "20%" }}><button className="red-button" onClick={() => this.props.onClickRemoveItem(this.props.item.id)}>x</button></div>
            </div>
          </ItemContainer>
        )}
      </Draggable>
    );
  }
}
