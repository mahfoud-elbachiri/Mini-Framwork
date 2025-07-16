function updateProps(element, oldProps, newProps) {
  for (let name in oldProps) {
    if (!(name in newProps)) {
      if (name.startsWith('on')) {
        // Remove old event handler by setting to null
        element[name] = null;
      } else if (name === 'className') {
        element.className = '';
      } else if (name === 'id') {
        element.id = '';
      } else {
        element.removeAttribute(name);
      }
    }
  }

  for (let name in newProps) {
    if (oldProps[name] !== newProps[name]) {
      if (name.startsWith('on') && typeof newProps[name] === 'function') {
        element[name] = newProps[name];
      } else if (name === 'className') {
        element.className = newProps[name];
      } else if (name === 'id') {
        element.id = newProps[name];
      } else if (name === 'value' && element.tagName === 'INPUT') {
        element.value = newProps[name];
      } else if (name === 'checked' && element.tagName === 'INPUT') {
        element.checked = newProps[name];
      } else {
        element.setAttribute(name, newProps[name]);
      }
    }
  }
}

export { updateProps }; 