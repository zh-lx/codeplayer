import './index.css';

export function renderIframeTip(errors: (string | Error)[], el: HTMLElement) {
  const errorsContainer = document.createElement('div');
  errorsContainer.classList.add('errors-container');

  errors.forEach((error) => {
    const item = document.createElement('p');
    item.innerText = error.toString();
    errorsContainer.append(item);
  });

  el.append(errorsContainer);
}
