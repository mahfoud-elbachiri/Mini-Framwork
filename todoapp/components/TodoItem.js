import { jsx, useState } from '../../framework/index.js';
import { blurActiveElement } from '../utils/helpers.js';

function TodoItem({ todo, toggleTodo, deleteTodo, updateTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  function handleDoubleClick(e) {
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
    setEditText(todo.text);
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
      // Auto-focus when the input appears
     ref: el => {
        if (isEditing && el) {
          // 0 setTimeout rir bach n7ato ref function in queue stack, so dom is fully rendered
         setTimeout(() => {
            el.focus();
           
         }, 0);
        }
      },
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

export { TodoItem }; 