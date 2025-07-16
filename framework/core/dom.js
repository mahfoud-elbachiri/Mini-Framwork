function jsx(tag, props, ...children) {
  if (typeof tag === 'function') {
    return tag({ ...props, children });
  }
  return { tag, props: props || {}, children };
}

function createElement(node) {
  if (node === null || node === undefined || node === false || node === true) {
    return document.createTextNode('');
  }
  
  if (typeof node === 'string' || typeof node === 'number') {
    return document.createTextNode(String(node));
  }

  const element = document.createElement(node.tag);

  for (let [name, value] of Object.entries(node.props)) {
    if (name === 'ref' && typeof value === 'function') {
      value(element);
    } else if (name.startsWith('on') && typeof value === 'function') {
      element[name] = value;
    } else if (name === 'className') {
      element.className = value;
    } else if (name === 'id') {
      element.id = value;
    } else if (name === 'value' && element.tagName === 'INPUT') {
      element.value = value;  
    } else if (name === 'checked' && element.tagName === 'INPUT') {
      element.checked = value;   
    } else {
      element.setAttribute(name, value);
    }
  }

  for (let child of node.children.flat()) {
    if (child === null || child === undefined || child === false || child === true) {
      continue;
    }
    
    if (typeof child === 'string' || typeof child === 'number') {
      element.appendChild(document.createTextNode(String(child)));
    } else {
      element.appendChild(createElement(child));
    }
  }
  return element;
}

export { jsx, createElement }; 