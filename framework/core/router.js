import { useState, useEffect } from './state.js';

let currentRoute = window.location.hash || '#/';
let routeCallbacks = [];

function useRouter() {
  const [route, setRoute] = useState(currentRoute);

  useEffect(() => {
    function handleHashChange() {
      const newRoute = window.location.hash || '#/';
      currentRoute = newRoute;
      setRoute(newRoute);
      routeCallbacks.forEach(callback => callback(newRoute));
    }

    // Replace addEventListener with direct property assignment
    window.onhashchange = handleHashChange;
    
    return () => {
      // Replace removeEventListener with null assignment
      window.onhashchange = null;
    };
  }, []);

  function navigate(path) {
    window.location.hash = path;
  }

  function getParams() {
    const hash = currentRoute.replace('#/', '');
    return hash;
  }

  return { route, navigate, getParams };
}

export { useRouter }; 