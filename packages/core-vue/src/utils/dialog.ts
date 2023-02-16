let dialogRef: HTMLDivElement | null = null;

export const dialog = (options: {
  title?: string;
  content?: string;
  confirmText?: string;
  cancelText?: string;
}) => {
  if (dialogRef) {
    dialogRef.remove();
    dialogRef = null;
  }
  dialogRef = document.createElement('div');
  dialogRef.innerHTML = `
<div class="code-sandbox-dialog-mask">
  <div class="code-sandbox-dialog">
    <h4 class="code-sandbox-dialog-title">${options.title}</h4>
    <div class="code-sandbox-dialog-close">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"/></svg>
    </div>
    <p class="code-sandbox-dialog-content">${options.content}</p>
    <div class="code-sandbox-dialog-buttons">
      <button class="code-sandbox-dialog-button-cancel">${
        options.cancelText || '取消'
      }</button>
      <button class="code-sandbox-dialog-button-confirm">${
        options.confirmText || '确认'
      }</button>
    </div>
  </div>
</div>`;
  // messageRef.innerText = text;
  // messageRef.classList.add('code-sandbox-message');
  // messageRef.classList.add('code-sandbox-message-' + options?.type || 'info');
  document.body.append(dialogRef);
};
