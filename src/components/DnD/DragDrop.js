import React, { useState } from 'react';
import Picture from './Picture';
import './style.scss';

const PictureList = [
  {
    id: 1,
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYha-hFJ9PgMq_03vkBNOZMNRbESqSFtvb6Po4kf-XiV5RRlapfbzQN6SSRfxeJmKwhN4&usqp=CAU"
  },
  {
    id: 2,
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYha-hFJ9PgMq_03vkBNOZMNRbESqSFtvb6Po4kf-XiV5RRlapfbzQN6SSRfxeJmKwhN4&usqp=CAU"
  },
  {
    id: 3,
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYha-hFJ9PgMq_03vkBNOZMNRbESqSFtvb6Po4kf-XiV5RRlapfbzQN6SSRfxeJmKwhN4&usqp=CAU"
  },
]
function DragDrop() {
  const [board, setBoard] = useState([
    {
      id: 3,
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYha-hFJ9PgMq_03vkBNOZMNRbESqSFtvb6Po4kf-XiV5RRlapfbzQN6SSRfxeJmKwhN4&usqp=CAU"
    },
  ]);
  return (
    <>
      <div className='Pictures'>
        {PictureList.map((picture) => {
          return <Picture url={picture.url} id={picture.id} />;
        })}
      </div>
      <div className='Board'>
        {board.map((picture) => {
          return <Picture url={picture.url} id={picture.id} />;
        })}
      </div>
    </>
  );
}

export default DragDrop;