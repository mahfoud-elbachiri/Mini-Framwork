function blurActiveElement() {
  if (document.activeElement && typeof document.activeElement.blur === 'function') {
    document.activeElement.blur();
  }
}


function TodoItem({ todo, toggleTodo, deleteTodo, updateTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  function handleDoubleClick() {
    setIsEditing(true);
    setEditText(todo.text);
  }

  function handleSubmit() {
    const trimmedText = editText.trim();
    if (trimmedText) {
      updateTodo(todo.id, trimmedText);
    }
    setIsEditing(false);
  }

  function handleBlur() {
    setIsEditing(false);
    setEditText(todo.text); // Reset to original text
  }

  const toggleClass = `toggle${todo.completed ? ' checked' : ''}`;
  return jsx('li', {
    className: `todo-item ${todo.completed ? 'completed' : ''} ${isEditing ? 'editing' : ''}`
  }, [
    jsx('div', { className: 'view' }, [
      jsx('input', {
        type: 'checkbox',
        className: toggleClass,
        checked: todo.completed,
        onchange: () => { toggleTodo(todo.id); blurActiveElement(); }
      }),
      jsx('label', { 
        className: 'label',
        ondblclick: handleDoubleClick 
      }, todo.text),
      jsx('button', {
        className: 'destroy',
        onclick: () => { deleteTodo(todo.id); blurActiveElement(); }
      })
    ]),
    isEditing && jsx('input', {
      className: 'edit',
      type: 'text',
      value: editText,
      oninput: (e) => setEditText(e.target.value),
      onblur: handleBlur,
      onkeydown: (e) => {
        if (e.key === 'Enter') {
          handleSubmit();
        } else if (e.key === 'Escape') {
          handleBlur();
        }
      }
    })
  ]);
}

function TodoApp() {
  // Simple initialization first
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  
  // Use router instead of filter state
  const { route, navigate, getParams } = useRouter();
  const filter = getParams(); // Get current filter from URL

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
    // Ensure we're not triggering unnecessary updates
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

  // Filter todos based on current filter (with safety check)
  const filteredTodos = Array.isArray(todos) ? todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true; // 'all'
  }) : [];

  const activeTodosCount = Array.isArray(todos) ? todos.filter(todo => !todo.completed).length : 0;
  const hasCompletedTodos = Array.isArray(todos) ? todos.some(todo => todo.completed) : false;

  return jsx('section', { className: 'todoapp' }, [
    // Header
    jsx('header', { className: 'header' }, [
      jsx('h1', {}, 'todos'),
      jsx('div', { className: 'input-container' }, [
        jsx('input', {
          className: 'new-todo',
          type: 'text',
          value: input,
          placeholder: 'What needs to be done?',
          oninput: (e) => setInput(e.target.value),
          onkeydown: (e) => {
            if (e.key === 'Enter') addTodo();
          }
        })
      ])
    ]),

    // Main
    jsx('main', { className: 'main' }, [
      // Toggle all (only show if there are todos)
      (Array.isArray(todos) && todos.length > 0) ? jsx('div', { className: 'toggle-all-container' }, [
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
        jsx('label', { className: 'toggle-all-label', for: 'toggle-all',
          onclick: (e) => {
            // Only allow toggleAll if there is something to toggle in this filter
            if (
              (filter === 'completed' && todos.some(todo => todo.completed)) ||
              (filter === 'active' && todos.some(todo => !todo.completed)) ||
              filter === 'all'
            ) {
              toggleAll();
            }
          }
        })
      ]) : null,

      // Todo list
      jsx('ul', { className: 'todo-list' },
        filteredTodos.map(todo => jsx(TodoItem, { 
          key: todo.id, 
          todo, 
          toggleTodo, 
          deleteTodo,
          updateTodo 
        }))
      )
    ]),

    // Footer (only show if there are todos)
    (Array.isArray(todos) && todos.length > 0) ? jsx('footer', { className: 'footer' }, [
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

      hasCompletedTodos ? jsx('div', { className: 'clear-completed' },
        jsx('button', {
          className: 'clear-completed',
          onclick: clearCompleted
        }, 'Clear completed')
      ) : null
    ]) : null
  ]);
}

function App() {
  const { getParams } = useRouter();
  const route = getParams();
  
  // Handle empty route - redirect to 'all'
  if (!route) {
    window.location.hash = '#/all';
    return null;
  }

  // Show TodoApp for valid routes
  if (['all', 'active', 'completed'].includes(route)) {
    return jsx('div', { id: 'root' }, [
      jsx(InfoAside),
      jsx(TodoApp)
    ]);
  }
  
  // Show NotFound for any other route (including /notfound)
  return jsx('div', { id: 'root' }, jsx(NotFound));
}

// Initial render
render();
