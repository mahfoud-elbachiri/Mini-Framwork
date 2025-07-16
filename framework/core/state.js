let states = [];
let stateIndex = 0;
let _isRendering = false;
let _renderCallback = null;

export function setRenderCallback(callback) {
  _renderCallback = callback;
}

function setRendering(value) {
  _isRendering = value;
}

function isRendering() {
  return _isRendering;
}

function useState(initialValue) {
  const currentIndex = stateIndex;
  states[currentIndex] = states[currentIndex] !== undefined ? states[currentIndex] : initialValue;

  function setState(newValue) {
    const nextValue = typeof newValue === 'function' ? newValue(states[currentIndex]) : newValue;
    if (!Object.is(states[currentIndex], nextValue)) {
      states[currentIndex] = nextValue;
      if (!isRendering() && _renderCallback) {
        _renderCallback();
      }
    }
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

export { useState, useEffect, isRendering, setRendering };
export function resetIndexes() {
  stateIndex = 0;
  effectIndex = 0;
} 