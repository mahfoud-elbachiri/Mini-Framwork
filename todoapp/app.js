import { jsx, useRouter } from '../framework/index.js';
import { TodoApp } from './components/TodoApp.js';
import { NotFound } from './components/NotFound.js';
import { InfoAside } from './components/InfoAside.js';

function App() {
  const { getParams, navigate } = useRouter();
  const route = getParams();
  
  // Handle empty route or invalid routes - redirect to 'all'
  if (!route || !['all', 'active', 'completed'].includes(route)) {
    navigate('#/all');
    return null;
  }

  // Show TodoApp for all routes (we no longer need to check route validity here)
  return jsx('div', { id: 'root' }, [
    jsx(InfoAside),
    jsx(TodoApp)
  ]);
}

export { App }; 