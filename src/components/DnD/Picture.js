import React from 'react';
import { useDrag } from 'react-dnd';

function Picture({ id, url }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "image",
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    })
  }));
  return <img
    ref={drag}
    src={url} width="150px"
    alt="dd"
    style={{ border: isDragging ? "5px solid pink" : "0px" }} />;
}

export default Picture;
