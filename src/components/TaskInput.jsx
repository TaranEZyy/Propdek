import React, { useState } from 'react';

const TaskInput = ({ onAdd }) => {
  const [text, setText] = useState('');
  const handleAdd = () => {
    onAdd(text);
    setText('');
  };

  return (
    <div className="task-input">
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="New Task"
      />
      <button onClick={handleAdd}>Add</button>
    </div>
  );
};

export default TaskInput;
