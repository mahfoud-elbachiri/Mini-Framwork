const SimpleReact = (function() {
  let states = [];
  let stateIndex = 0;
  let currentVTree = null; // Store the current virtual DOM tree

  function useState(initialValue) {
    const currentIndex = stateIndex;
    states[currentIndex] = states[currentIndex] !== undefined ? states[currentIndex] : initialValue;

    function setState(newValue) {
      states[currentIndex] = newValue;
      render();
    }

    stateIndex++;

    return [states[currentIndex], setState];
  }

  let effects = [];
  let effectIndex = 0;

  function useEffect(callback, dependencies) {
    const oldDependencies = effects[effectIndex];
    let hasChanged = true;

    if (oldDependencies) {
      hasChanged = dependencies.some((dep, i) => !Object.is(dep, oldDependencies[i]));
    }

    if (hasChanged) {
      callback();
    }

    effects[effectIndex] = dependencies;
    effectIndex++;
  }

  function jsx(tag, props, ...children) {
    if (typeof tag === 'function') {
      return tag({ ...props, children });
    }
    return { tag, props: props || {}, children };
  }

  function createElement(node) {
    if (typeof node === 'string' || typeof node === 'number') {
      return document.createTextNode(String(node));
    }

    const element = document.createElement(node.tag);

    for (let [name, value] of Object.entries(node.props)) {
      if (name.startsWith('on') && typeof value === 'function') {
        element.addEventListener(name.slice(2).toLowerCase(), value);
      } else if (name === 'className') {
        element.className = value;
      } else if (name === 'id') {
        element.id = value;
      } else {
        element.setAttribute(name, value);
      }
    }

    for (let child of node.children.flat()) {
      if (typeof child === 'string' || typeof child === 'number') {
        element.appendChild(document.createTextNode(String(child)));
      } else {
        element.appendChild(createElement(child));
      }
    }
    return element;
  }

  // virtual DOM diffing
  function diff(oldNode, newNode, element) {
    // If one node doesn't exist, replace entirely
    if (!oldNode) {
      return createElement(newNode);
    }
    if (!newNode) {
      element.remove();
      return null;
    }
    
    // If nodes are text and different, update text
    if (typeof oldNode === 'string' || typeof oldNode === 'number') {
      if (typeof newNode === 'string' || typeof newNode === 'number') {
        if (oldNode !== newNode) {
          element.textContent = String(newNode);
        }
        return element;
      } else {
        // Replace text with element
        const newElement = createElement(newNode);
        element.parentNode.replaceChild(newElement, element);
        return newElement;
      }
    }
    
    // If tag names are different, replace entirely
    if (oldNode.tag !== newNode.tag) {
      const newElement = createElement(newNode);
      element.parentNode.replaceChild(newElement, element);
      return newElement;
    }
    
    // Update props
    updateProps(element, oldNode.props, newNode.props);
    
    // Diff children
    const oldChildren = oldNode.children.flat();
    const newChildren = newNode.children.flat();
    const maxLength = Math.max(oldChildren.length, newChildren.length);
    
    for (let i = 0; i < maxLength; i++) {
      const oldChild = oldChildren[i];
      const newChild = newChildren[i];
      const childElement = element.childNodes[i];
      
      if (!newChild) {
        // Remove extra old children
        if (childElement) {
          childElement.remove();
        }
      } else if (!oldChild) {
        // Add new children
        element.appendChild(createElement(newChild));
      } else {
        // Diff existing children
        if (childElement) {
          diff(oldChild, newChild, childElement);
        }
      }
    }
    
    return element;
  }
  
  // Update element properties
  function updateProps(element, oldProps, newProps) {
    // Remove old props that don't exist in new props
    for (let name in oldProps) {
      if (!(name in newProps)) {
        if (name.startsWith('on')) {
          element.removeEventListener(name.slice(2).toLowerCase(), oldProps[name]);
        } else if (name === 'className') {
          element.className = '';
        } else if (name === 'id') {
          element.id = '';
        } else {
          element.removeAttribute(name);
        }
      }
    }
    
    // Add or update new props
    for (let name in newProps) {
      if (oldProps[name] !== newProps[name]) {
        if (name.startsWith('on') && typeof newProps[name] === 'function') {
          if (oldProps[name]) {
            element.removeEventListener(name.slice(2).toLowerCase(), oldProps[name]);
          }
          element.addEventListener(name.slice(2).toLowerCase(), newProps[name]);
        } else if (name === 'className') {
          element.className = newProps[name];
        } else if (name === 'id') {
          element.id = newProps[name];
        } else {
          element.setAttribute(name, newProps[name]);
        }
      }
    }
  }

  function render() {
    stateIndex = 0;
    effectIndex = 0;
    const root = document.getElementById('root');
    const newVTree = App();
    
    if (!currentVTree) {
      // First render
      root.innerHTML = '';
      root.appendChild(createElement(newVTree));
    } else {
      // Use diffing for updates
      diff(currentVTree, newVTree, root.firstChild);
    }
    
    currentVTree = newVTree;
  }

  return { useState, useEffect, jsx, createElement, render };
})();

const { useState, useEffect, jsx,createElement, render } = SimpleReact;
