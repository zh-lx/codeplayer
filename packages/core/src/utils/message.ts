let messageRef: HTMLDivElement | null = null;

export const message = (
  text: string,
  options?: { duration?: number; type?: 'info' | 'success' | 'danger' }
) => {
  if (messageRef) {
    messageRef.remove();
    messageRef = null;
  }
  messageRef = document.createElement('div');
  messageRef.innerText = text;
  messageRef.classList.add('codeplayer-message');
  messageRef.classList.add('codeplayer-message-' + options?.type || 'info');
  document.body.append(messageRef);
  setTimeout(() => {
    if (messageRef) {
      messageRef.remove();
      messageRef = null;
    }
  }, options?.duration || 3000);
};
