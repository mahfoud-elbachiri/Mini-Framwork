import { jsx, useState, useRouter } from '../../framework/index.js';
import { TodoItem } from './TodoItem.js';
import { blurActiveElement } from '../utils/helpers.js';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  
  const { route, navigate, getParams } = useRouter();
  const filter = getParams();

  function saveTodos(newTodos) {
    if (Array.isArray(newTodos)) {
      setTodos(newTodos);
    } else {
      console.error('saveTodos: newTodos is not an array', newTodos);
      setTodos([]);
    }
  }

  function addTodo() {
    if (!input.trim()) return;
    
    const newTodo = {
      id: Date.now(),
      text: input.trim(),
      completed: false
    };
    
    const newTodos = [...todos, newTodo];
    saveTodos(newTodos);
    setInput('');
  }

  function updateTodo(id, newText) {
    const updated = todos.map(todo => 
      todo.id === id 
        ? { ...todo, text: newText }
        : todo
    );
    saveTodos(updated);
  }

  function toggleTodo(id) {
    const updated = todos.map(todo => 
      todo.id === id 
        ? { ...todo, completed: !todo.completed }
        : todo
    );
    if (JSON.stringify(todos) !== JSON.stringify(updated)) {
      saveTodos(updated);
    }
  }

  function deleteTodo(id) {
    const filtered = todos.filter(todo => todo.id !== id);
    saveTodos(filtered);
  }

  function clearCompleted() {
    const filtered = todos.filter(todo => !todo.completed);
    saveTodos(filtered);
  }

  function toggleAll() {
    const allCompleted = todos.every(todo => todo.completed);
    const updated = todos.map(todo => ({ ...todo, completed: !allCompleted }));
    saveTodos(updated);
  }

  const filteredTodos = Array.isArray(todos) ? todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  }) : [];

  const activeTodosCount = Array.isArray(todos) ? todos.filter(todo => !todo.completed).length : 0;
  const hasCompletedTodos = Array.isArray(todos) ? todos.some(todo => todo.completed) : false;

  return jsx('section', { className: 'todoapp', id:'root' }, [
   
   
   
    jsx('header', { className: 'header', 'data-testid':'header' }, [
     
     
      jsx('h1', {}, 'todos'),
      jsx('div', { className: 'input-container' }, [
        jsx('input', {
          className: 'new-todo',
          id : "todo-input",
          type: 'text',
          'data-testid' : "text-input",
          value: input,
          placeholder: 'What needs to be done?',
          oninput: (e) => setInput(e.target.value),
          onkeydown: (e) => {
            if (e.key === 'Enter') addTodo();
          }
        }),
        jsx('label' , {className:'visually-hidden' , for : 'todo-input'},
          "New Todo Input"
        )
      ])
    ]),

    jsx('main', { className: 'main' }, [
      (Array.isArray(todos) && todos.length > 0) && jsx('div', { className: 'toggle-all-container' }, [
        jsx('input', {
          className: 'toggle-all',
          type: 'checkbox',
          id: 'toggle-all',
          checked: todos.length > 0 && todos.every(todo => todo.completed),
          onchange: (e) => {
            if (
              (filter === 'completed' && todos.some(todo => todo.completed)) ||
              (filter === 'active' && todos.some(todo => !todo.completed)) ||
              filter === 'all'
            ) {
              toggleAll();
            }
          },
          disabled: (
            (filter === 'completed' && !todos.some(todo => todo.completed)) ||
            (filter === 'active' && !todos.some(todo => !todo.completed))
          )
        }),
        jsx('label', { 
          className: 'toggle-all-label', 
          for: 'toggle-all',
          onclick: (e) => {
            if (
              (filter === 'completed' && todos.some(todo => todo.completed)) ||
              (filter === 'active' && todos.some(todo => !todo.completed)) ||
              filter === 'all'
            ) {
              toggleAll();
            }
          }
        })
      ]),

      jsx('ul', { className: 'todo-list', 'data-testid':'todo-list' },
        filteredTodos.map(todo => jsx(TodoItem, { 
          key: todo.id, 
          todo, 
          toggleTodo, 
          deleteTodo,
          updateTodo 
        }))
      )
    ]),

    (Array.isArray(todos) && todos.length > 0) && jsx('footer', { className: 'footer' }, [
      jsx('span', { className: 'todo-count' },
        jsx('span', {}, `${activeTodosCount} item${activeTodosCount !== 1 ? 's' : ''} left`)
      ),

      jsx('ul', { className: 'filters' }, [
        jsx('li', { 
          className: filter === 'all' ? 'selected' : '',
          onclick: () => navigate('#/all')
        }, jsx('a', { href: '#/all' }, 'All')),
        
        jsx('li', { 
          className: filter === 'active' ? 'selected' : '',
          onclick: () => navigate('#/active')
        }, jsx('a', { href: '#/active' }, 'Active')),
        
        jsx('li', { 
          className: filter === 'completed' ? 'selected' : '',
          onclick: () => navigate('#/completed')
        }, jsx('a', { href: '#/completed' }, 'Completed'))
      ]),

      hasCompletedTodos && jsx('div', { className: 'clear-completed' },
        jsx('button', {
          className: 'clear-completed',
          onclick: clearCompleted
        }, 'Clear completed')
      )
    ])
  ]);
}

export { TodoApp }; 