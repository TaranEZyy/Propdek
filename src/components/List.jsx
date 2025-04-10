import React from 'react';
import Task from './Task';
import TaskInput from './TaskInput';

const List = ({ provided, list, renameList, deleteList, addTask, deleteTask, toggleComplete }) => {
  return (
    <div
      className="list"
      ref={provided.innerRef}
      {...provided.droppableProps}
    >
      <div className="list-header">
        <input
          className="list-title"
          value={list.name}
          onChange={e => renameList(list.id, e.target.value)}
        />
        <button onClick={() => deleteList(list.id)}>Delete</button>
      </div>
      <TaskInput onAdd={text => addTask(list.id, text)} />
      {list.tasks.map((task, index) => (
        <Task
          key={task.id}
          task={task}
          index={index}
          listId={list.id}
          onComplete={toggleComplete}
          onDelete={deleteTask}
        />
      ))}
      {provided.placeholder}
    </div>
  );
};

export default List;
