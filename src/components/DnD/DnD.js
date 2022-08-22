// npm instal react-dnd
//npm install react-dnd react-dnd-html5-backend
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DragDrop from './DragDrop';
import React from 'react';

function DnD() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className='DnD'>
        <DragDrop />
      </div>
    </DndProvider>
  );
}

export default DnD;