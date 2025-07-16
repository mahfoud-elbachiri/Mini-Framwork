import { jsx, createElement } from './core/dom.js';
import { useState, useEffect, isRendering, setRendering, resetIndexes, setRenderCallback } from './core/state.js';
import { diff } from './core/diff.js';
import { useRouter } from './core/router.js';

let currentVTree = null;

function render() {
  setRendering(true);
  resetIndexes();
  const root = document.body
  const newVTree = App();
  
  if (!currentVTree) {
    root.innerHTML = '';
    root.appendChild(createElement(newVTree));
  } else {
    diff(currentVTree, newVTree, root.firstChild);
  }
  
  currentVTree = newVTree;
  setRendering(false);
}

// Set up the render callback
setRenderCallback(render);

export { 
  useState, 
  useEffect, 
  jsx, 
  createElement, 
  render, 
  useRouter 
}; 