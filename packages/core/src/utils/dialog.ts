let dialogRef: HTMLDivElement | null = null;

export const dialog = (options: {
  title?: string;
  content?: string;
  confirmText?: string;
  cancelText?: string;
  cancel?: () => void;
  confirm?: () => void;
}) => {
  if (dialogRef) {
    dialogRef.remove();
    dialogRef = null;
  }
  dialogRef = document.createElement('div');
  dialogRef.innerHTML = `
<div class="codeplayer-dialog-mask">
  <div class="codeplayer-dialog">
    <h4 class="codeplayer-dialog-title">${options.title}</h4>
    <div class="codeplayer-dialog-close" id="__codeplayer-dialog-close__">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"/></svg>
    </div>
    <p class="codeplayer-dialog-content">${options.content}</p>
    <div class="codeplayer-dialog-buttons">
      <button class="codeplayer-dialog-button-cancel" id="__codeplayer-dialog-button-cancel__">${
        options.cancelText || '取消'
      }</button>
      <button class="codeplayer-dialog-button-confirm" id="__codeplayer-dialog-button-confirm__">${
        options.confirmText || '确认'
      }</button>
    </div>
  </div>
</div>`;
  document.body.append(dialogRef);
  const closeIcon = document.querySelector(
    '#__codeplayer-dialog-close__'
  ) as HTMLDivElement;
  const cancelIcon = document.querySelector(
    '#__codeplayer-dialog-button-cancel__'
  ) as HTMLDivElement;
  const confirmIcon = document.querySelector(
    '#__codeplayer-dialog-button-confirm__'
  ) as HTMLDivElement;
  closeIcon.onclick = cancelIcon.onclick = () => {
    dialogRef?.remove();
    dialogRef = null;
    options.cancel && options.cancel();
  };
  confirmIcon.onclick = () => {
    dialogRef?.remove();
    dialogRef = null;
    options.confirm && options.confirm();
  };
};
