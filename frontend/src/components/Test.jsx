import React, { useState } from "react";

function Test() {
  const [tasks, setTasks] = useState(["test", "text", "lala"]);
  const [newTask, setNewTask] = "";

  // * To see the text in the input field
  function handleInputChange(event) {
    setNewTask(event.target.value);
  }

  function addTask() {
    setTasks((t) => [...t, newTask]);
    setNewTask("");
  }

  function deleteTask(index) {}

  return (
    <div className="todolist">
      <h1>To Do List</h1>
      <div>
        <input
          type="text"
          placeholder="placeholder"
          value={newTask}
          onChange={handleInputChange}
        />
        <button className="add-button" onClick={addTask}>
          Add
        </button>
      </div>
      <ol>
        {tasks.map((task, index) => (
          <li key={index}>
            <span className="text">{task}</span>
            <button className="delete-button" onClick={() => deleteTask(index)}>
              Delete
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default Test;
