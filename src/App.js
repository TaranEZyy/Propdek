import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './App.css';

const App = () => {
  const [lists, setLists] = useState(() => {
    const saved = localStorage.getItem('todo-lists');
    return saved ? JSON.parse(saved) : [];
  });
  const [listName, setListName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editListId, setEditListId] = useState(null);
  const [editListName, setEditListName] = useState('');

  useEffect(() => {
    localStorage.setItem('todo-lists', JSON.stringify(lists));
  }, [lists]);

  const addList = () => {
    if (!listName) return;
    setLists([...lists, { id: Date.now().toString(), name: listName, tasks: [] }]);
    setListName('');
  };

  const renameList = (id, newName) => {
    setLists(lists.map(list => list.id === id ? { ...list, name: newName } : list));
    setEditListId(null);
    alert('List renamed successfully!');
  };

  const deleteList = (id) => {
    setLists(lists.filter(list => list.id !== id));
    alert('List deleted successfully!');
  };

  const addTask = (listId, text) => {
    if (!text) return;
    setLists(lists.map(list =>
      list.id === listId ? { ...list, tasks: [...list.tasks, { id: Date.now().toString(), text, completed: false }] } : list
    ));
  };

  const deleteTask = (listId, taskId) => {
    setLists(lists.map(list =>
      list.id === listId ? { ...list, tasks: list.tasks.filter(task => task.id !== taskId) } : list
    ));
    alert('Task deleted successfully!');
  };

  const toggleComplete = (listId, taskId) => {
    setLists(lists.map(list =>
      list.id === listId ? {
        ...list,
        tasks: list.tasks.map(task =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      } : list
    ));

    const isNowCompleted = lists
      .find(list => list.id === listId)
      .tasks.find(task => task.id === taskId).completed;

    alert(`Task marked as ${isNowCompleted ? 'uncompleted' : 'completed'}!`);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;

    const sourceList = lists.find(list => list.id === source.droppableId);
    const destList = lists.find(list => list.id === destination.droppableId);

    const sourceTasks = [...sourceList.tasks];
    const [movedTask] = sourceTasks.splice(source.index, 1);

    if (sourceList.id === destList.id) {
      sourceTasks.splice(destination.index, 0, movedTask);
      setLists(lists.map(list => list.id === sourceList.id ? { ...list, tasks: sourceTasks } : list));
    } else {
      const destTasks = [...destList.tasks];
      destTasks.splice(destination.index, 0, movedTask);
      setLists(lists.map(list => {
        if (list.id === sourceList.id) return { ...list, tasks: sourceTasks };
        if (list.id === destList.id) return { ...list, tasks: destTasks };
        return list;
      }));
    }
  };

  const filteredLists = lists.map(list => ({
    ...list,
    tasks: list.tasks.filter(task => task.text.toLowerCase().includes(searchTerm.toLowerCase()))
  }));

  return (
    <div className="app">
      <h1>Multi-List Todo App</h1>
      <div className="controls">
        <input value={listName} onChange={e => setListName(e.target.value)} placeholder="New List Name" />
        <button onClick={addList}>Add List</button>
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="list-container">
          {filteredLists.map(list => (
            <Droppable droppableId={list.id} key={list.id}>
              {(provided) => (
                <div className="list" ref={provided.innerRef} {...provided.droppableProps}>
                  <div className="list-header">
                    {editListId === list.id ? (
                      <>
                        <input
                          className="list-title"
                          value={editListName}
                          onChange={e => setEditListName(e.target.value)}
                        />
                        <button  onClick={() => renameList(list.id, editListName)}>Save</button>
                      </>
                    ) : (
                      <>
                        <span>{list.name}</span>
                        <button className="buttoncss" onClick={() => { setEditListId(list.id); setEditListName(list.name); }}>Rename</button>
                        <button className="buttoncss"  onClick={() => deleteList(list.id)}>Delete</button>
                      </>
                    )}
                  </div>
                  <TaskInput onAdd={text => addTask(list.id, text)} />
                  {list.tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          className={`task ${task.completed ? 'completed' : ''}`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <span>{task.text}</span>
                          <button onClick={() => toggleComplete(list.id, task.id)}>
                            {task.completed ? 'Uncomplete' : 'Complete'}
                          </button>
                          <button onClick={() => deleteTask(list.id, task.id)}>✖</button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

const TaskInput = ({ onAdd }) => {
  const [text, setText] = useState('');
  const handleAdd = () => {
    onAdd(text);
    setText('');
  };
  return (
    <div className="task-input">
      <input value={text} onChange={e => setText(e.target.value)} placeholder="New Task" />
      <button onClick={handleAdd}>Add</button>
    </div>
  );
};

export default App;
