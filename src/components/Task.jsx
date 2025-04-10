import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const Task = ({ task, index, listId, onComplete, onDelete }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          className={`task ${task.completed ? 'completed' : ''}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <span onClick={() => onComplete(listId, task.id)}>
            {task.text}
          </span>
          <button onClick={() => onDelete(listId, task.id)}>✖</button>
        </div>
      )}
    </Draggable>
  );
};

export default Task;
