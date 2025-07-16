import { createElement } from './dom.js';
import { updateProps } from './events.js';

function diff(oldNode, newNode, element) {
  if (oldNode === null || oldNode === undefined || oldNode === false || oldNode === true) {
    oldNode = '';
  }
  if (newNode === null || newNode === undefined || newNode === false || newNode === true) {
    newNode = '';
  }

  if (!oldNode) {
    return createElement(newNode);
  }
  if (!newNode) {
    element.remove();
    return null;
  }
  
  if (typeof oldNode === 'string' || typeof oldNode === 'number') {
    if (typeof newNode === 'string' || typeof newNode === 'number') {
      if (oldNode !== newNode) {
        element.textContent = String(newNode);
      }
      return element;
    } else {
      const newElement = createElement(newNode);
      element.parentNode.replaceChild(newElement, element);
      return newElement;
    }
  }
  
  if (oldNode.tag !== newNode.tag) {
    const newElement = createElement(newNode);
    element.parentNode.replaceChild(newElement, element);
    return newElement;
  }
  
  updateProps(element, oldNode.props || {}, newNode.props || {});
  
  const oldChildren = oldNode.children.flat().filter(child => 
    child !== null && child !== undefined && child !== false && child !== true
  );
  const newChildren = newNode.children.flat().filter(child => 
    child !== null && child !== undefined && child !== false && child !== true
  );
  
  while (element.childNodes.length > newChildren.length) {
    element.removeChild(element.lastChild);
  }
  
  for (let i = 0; i < newChildren.length; i++) {
    const newChild = newChildren[i];
    const oldChild = oldChildren[i];
    
    if (i >= element.childNodes.length) {
      element.appendChild(createElement(newChild));
    } else {
      diff(oldChild, newChild, element.childNodes[i]);
    }
  }
  
  return element;
}

export { diff }; 