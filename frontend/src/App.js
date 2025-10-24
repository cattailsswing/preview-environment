import React, {useEffect, useState} from 'react';

import LogoIcon from "./images/logo-icon.svg";
import CheckIcon from "./images/group_4949.svg";

import './App.css';

const baseUrl = 'https://' + process.env.REACT_APP_API_HOST + '.onrender.com'

// CHANGED: ListItem now accepts the full 'item' object
const ListItem = ({ item }) => {
  // Helper class for styling the priority badge
  let priorityClass = '';
  let priorityText = '';
  switch (item.priority) {
      case 1:
          priorityClass = 'priority-high';
          priorityText = 'High';
          break;
      case 2:
          priorityClass = 'priority-medium';
          priorityText = 'Medium';
          break;
      default:
          priorityClass = 'priority-low';
          priorityText = 'Low';
          break;
  }

  return (
      <div className="task-row">
          <img src={CheckIcon} alt="" className="task-check-icon"/>
          {/* CHANGED: Use item.title */}
          <h3 className="task-text">{item.title}</h3>
          
          {/* CHANGED: Added priority badge */}
          {item.priority && (
              <span className={`priority-badge ${priorityClass}`}>
                  {priorityText}
              </span>
          )}
      </div>
  )
}

const TodoList = ({items}) => {
    return (
        <div>
            {/* CHANGED: Pass the full 'item' and add a 'key' */}
            {items.map((item) => (
                <ListItem key={item.id || item.title} item={item}/>
            ))}
        </div>
    )
}
function FetchData() {
    return fetch(baseUrl + '/todos')
        .then(items => items.json())
}

function App() {
    const [todos, setTodos] = useState([] );
    // CHANGED: Add state for the new todo's title and priority
    const [newTodoTitle, setNewTodoTitle] = useState('');
    const [newTodoPriority, setNewTodoPriority] = useState(3); // Default to 3 (Low)

    async function CheckKey(e) { // CHANGED: Made async to align with SubmitTodo
        if (e.key === 'Enter') {
            e.preventDefault();
            await SubmitTodo(); // CHANGED: await the submission
        }
    }

    // CHANGED: Rewrote SubmitTodo to use state and send priority
    async function SubmitTodo() {
        // Read from state instead of document.getElementById
        if (newTodoTitle === '') {
            return
        }

        const priority = parseInt(newTodoPriority, 10); // Ensure priority is a number
        const newTodo = { title: newTodoTitle, priority: priority };

        // Reset the input fields
        setNewTodoTitle('');
        setNewTodoPriority(3);

        // Optimistic update: Add to UI immediately
        // Give it a temporary ID for the React key
        const tempId = `temp-${Date.now()}`;
        setTodos([{ ...newTodo, id: tempId }].concat(todos));

        try {
            // Send to backend
            const response = await fetch(baseUrl+ '/todos', {
                method: "POST", 
                body: JSON.stringify(newTodo), // Send the full todo object
                headers: {'Content-Type': 'application/json'}
            });
            const savedTodo = await response.json(); // { todo: { id, title, ... } }

            // Replace temporary todo with the real one from the server (which has a real ID)
            setTodos(currentTodos =>
                currentTodos.map(t =>
                    t.id === tempId ? savedTodo.todo : t
                )
            );
        } catch (error) {
            console.error("Failed to save todo:", error);
            // On failure, remove the optimistic update
            setTodos(currentTodos => currentTodos.filter(t => t.id !== tempId));
        }
    }

    useEffect(() => {
        async function loadTodos() {
            const result = await FetchData()
            setTodos(result.todos)
        }
        loadTodos()
    }, []);

    return (
        <div className="banner-container">
            <div className="widget-container-2 outline">
                <div className="widget-body-2">
                    <div className="w-form">
                        {/* CHANGED: Removed onKeyPress from input, it's not needed here */}
                        <form id="email-form" name="email-form" data-name="Email Form" className="form" onKeyPress={CheckKey}>
                            <div className="task-title-group"><img src={LogoIcon} loading="lazy" alt="" className="task-logo"/>
                                <div className="task-overline">Powered by <a href="https://render.com">Render</a></div>
                                <h1 className="task-title">Todo List</h1>
                            </div>
                            <div className="task-container">
                                <div className="task-wrapper">
                                    {/* CHANGED: This is now a controlled component */}
                                    <input 
                                        type="text" 
                                        className="task-input w-input" 
                                        maxLength="256" 
                                        name="name-5" 
                                        data-name="Name 5" 
                                        placeholder="enter a task description ..." 
                                        id="name-5"
                                        value={newTodoTitle}
                                        onChange={(e) => setNewTodoTitle(e.target.value)}
                                    />
                                </div>

                                {/* CHANGED: Added priority selector */}
                                <div className="task-wrapper" style={{marginTop: '10px'}}>
                                    <select 
                                        className="task-priority-select w-input" 
                                        value={newTodoPriority} 
                                        onChange={(e) => setNewTodoPriority(e.target.value)}
                                    >
                                        <option value="3">Priority: Low</option>
                                        <option value="2">Priority: Medium</option>
                                        <option value="1">Priority: High</option>
                                    </select>
                                </div>
                                
                                <a className="task-button w-inline-block" onClick={SubmitTodo}>
                                    <div>Add Task</div>
                                </a>
                            </div>
                            <TodoList items={todos}/>
                        </form>
                        <div className="w-form-done">
                            <div>Thank you! Your submission has been received!</div>
                        </div>
                        <div className="w-form-fail">
                            <div>Oops! Something went wrong while submitting the form.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App;
