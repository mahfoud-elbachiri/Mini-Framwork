import { jsx, useRouter } from '../../framework/index.js';

function NotFound() {
  const { navigate } = useRouter();

  return jsx('div', { className: 'not-found' }, [
    jsx('div', { className: 'not-found-content' }, [
      jsx('h1', {}, '404'),
      jsx('h2', {}, 'Page Not Found'),
      jsx('p', {}, 'The page you are looking for might have been removed or is temporarily unavailable.'),
      jsx('button', {
        className: 'back-button',
        onclick: () => navigate('#/all')
      }, 'Back to Todos')
    ])
  ]);
}

export { NotFound }; 