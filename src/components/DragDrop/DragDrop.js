import React from "react";
import { ListContainer, ListItem } from './styles';
// import { DragHandle } from "./DragHandle";
import { DragDropContext } from 'react-beautiful-dnd';
import { Droppable } from 'react-beautiful-dnd';
import { Draggable } from 'react-beautiful-dnd';
import { useState } from 'react';

import Input from '../../coraWebComponents/forms/Input';
import Switch from '../../coraWebComponents/forms/Switch';
import Textarea from '../../coraWebComponents/forms/Textarea';
import NumericTextBox from '../../coraWebComponents/forms/NumericTextBox';
// import TimePicker from '../../coraWebComponents/forms/TimePicker';
// import DatePicker from '../../coraWebComponents/forms/DatePicker';
// import Upload from '../../coraWebComponents/forms/Upload';
import UnitNumericTextBox from '../../coraWebComponents/forms/NumericTextBox';

const DragDrop = () => {

  //list pre sadu prvkov
  const [list, setList] = useState([
    {
      id: 1,
      component: () => <>
        <Input
          title={"ID"}
          name={"ID"}
          // field={"IDcko"}
          onChange={() => { }}
          value={2}
          disabled={false}
        />
      </>,
    },
    {
      id: 2,
      component: () => <>
        <Textarea
          name={"Nazov"}
          onChange={() => { }}
          value="Meno"
          disabled={false}
        />
      </>,
    },
    {
      id: 3,
      component: () => <>
        <UnitNumericTextBox
          name="KMTOK"
          tooltip={"Dlzka"}
          title={"Dlzka"}
          unit={"M"}
          onChange={() => { }}
          value="UNit"
          spinners={false}
        /></>,
    },
    {
      id: 4,
      component: () => <>
      <NumericTextBox
        name="Number"
        tooltip={"Number"}
        title={"Number"}
        onChange={() => { }}
        value={123}
        spinners={false}
        placeholder="placeholder"
      /></>,
    },
    {
      id: 5,
      component: () => <>
      <Switch
        name="Switch"
        title="Switch"
        onChange={() => { }}
        checked={false}
      /></>,
    },
    // {
    //   id: 5,
    //   component: DatePicker,
    // },
    // {
    //   id: 6,
    //   component: TimePicker,
    // },
    // {
    //   id: 7,
    //   component: Upload,
    // },
  ]);

  //list pre Demo formular
  const [listForm, setListForm] = useState([
  ]);

  return (
    <div className="DragDrop"
      style={{
        display: "inline-block",
      }}
    >
      <DragDropContext
        onDragEnd={(param) => {
          const srcI = param.source.index;
          const desI = param.destination?.index;

          if (param.destination) {
            console.log(param.destination);
            if (param.source.droppableId === "droppable-1" && param.destination.droppableId === "droppable-2") {
              listForm.splice(desI, 0, list[srcI])
              setListForm(listForm);
            } else if (param.source.droppableId === "droppable-2" && param.destination.droppableId === "droppable-2") {
              listForm.splice(desI, 0, listForm.splice(srcI, 1)[0]);
              setListForm(listForm);
            }
          }
        }}>

        <ListContainer>
          <h1>Sada prvkov</h1>
          <Droppable droppableId="droppable-1">
            {(provided, snapshot) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {list.map((item, i) => (
                  <Draggable
                    key={item.id}
                    draggableId={'draggable-' + item.id}
                    index={i}>
                    {(provided, snapshot) => {
                      const Component = item.component;
                      return (
                        <ListItem
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={{
                            ...provided.draggableProps.style,
                            boxShadow: snapshot.isDragging ? "0 0 0.4rem #666" : "none",
                          }}
                        >
                          <div {...provided.dragHandleProps}>
                            <Component  {...provided.dragHandleProps} />
                          </div>
                        </ListItem>
                      )
                    }}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}

          </Droppable>
        </ListContainer>

        <ListContainer>
          <h1>Demo Formulár</h1>
          <Droppable droppableId="droppable-2">
            {(provided, snapshot) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {listForm.map((item, i) => (
                  <Draggable
                    key={item.id + "droppable-2"}
                    draggableId={'draggable-' + item.id + "droppable-2"}
                    index={i}>
                    {(provided, snapshot) => {

                      const Component = item.component;

                      return (
                        <ListItem
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={{
                            ...provided.draggableProps.style,
                            boxShadow: snapshot.isDragging ? "0 0 0.4rem #666" : "none",
                          }}
                        >
                          <div {...provided.dragHandleProps}>
                            <Component />
                          </div>


                        </ListItem>

                      )
                    }}

                  </Draggable>

                ))}
                {provided.placeholder}
              </div>
            )}

          </Droppable>
        </ListContainer>



      </DragDropContext>
    </div >
  );
};

export default DragDrop;