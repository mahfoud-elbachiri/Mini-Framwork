function Quote({ text, author }) {
  return jsx('div', { className: 'quote' }, [
    jsx('p', {}, text),
    jsx('footer', {})
  ]);
  
}

function InfoAside() {
  return jsx('aside', { className: 'about' }, [
    jsx('h4', {}, 'About Todo App'),
    jsx(Quote, { 
      text: "What you do today can improve all your tomorrows.",
      author: "Ralph Marston"
    }),
    jsx('div', { className: 'speech-bubble' }, [
      jsx('p', {}, [
        'This todo app is built with a custom mini-framework made by ',
        jsx('a', { href: 'https://learn.zone01oujda.ma/git/melbachi' }, '@elbachi'),
        ' and ',
        jsx('a', { href: 'https://learn.zone01oujda.ma/git/ajebbari' }, '@ajebbari')
      ]),
      jsx('p', {}, 'Features:'),
      jsx('ul', {}, [
        jsx('li', {}, 'Create, toggle, and delete todos'),
        jsx('li', {}, 'Filter by status (All/Active/Completed)'),
        jsx('li', {}, 'Local state management'),
        jsx('li', {}, 'Responsive design')
      ])
    ])
  ]);
} 