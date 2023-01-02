import './code-sandbox.css';
import { ReplStore, StoreOptions } from '../core/store';
import { createCodeMirror } from './codemirror';
import { createSandbox } from './sandbox';

export const createCodeSandbox = (el: HTMLElement, options?: StoreOptions) => {
  const codeSandbox = document.createElement('div');
  codeSandbox.innerHTML = `
  <div class="code-sandbox-split-pane" id="__split-pane">
    <div class="code-sandbox-split-pane-left" id="__split-pane-left">
      <div id="__editor">
        <div id="__file-selector"></div>
        <div id="__code-editor"></div>
      </div>
      <div class="code-sandbox-dragger" id="__dragger"></div>
    </div>
    <div class="code-sandbox-split-pane-right" id="__split-pane-right"></div>
  </div>
  `;
  el.append(codeSandbox);

  const store = new ReplStore(options);

  // create Mirror
  const left = codeSandbox.querySelector('#__code-editor') as HTMLElement;
  createCodeMirror(left, {
    store,
  });

  // create sandbox
  const right = codeSandbox.querySelector('#__split-pane-right') as HTMLElement;
  createSandbox(right, store);

  // drag event
  let dragger = codeSandbox.querySelector('#__dragger') as HTMLElement;
  let container = codeSandbox.querySelector('#__split-pane') as HTMLElement;
  let split = 50;
  let isDrag = false;
  let startPosition = 0;
  let startSplit = 0;
  let isVertical = false;

  let getSplitBound = () => {
    return split < 20 ? 20 : split > 80 ? 80 : split;
  };

  const setPaneSplit = () => {
    left.style[isVertical ? 'height' : 'width'] = getSplitBound() + '%';
    right.style[isVertical ? 'height' : 'width'] = 100 - getSplitBound() + '%';
  };

  // 拖拽开始
  function dragStart(e: MouseEvent) {
    isDrag = true;
    startPosition = isVertical ? e.pageY : e.pageX;
    startSplit = getSplitBound();
    container.style.userSelect = 'none';
    container.style.cursor = isVertical ? 'ns-resize' : 'ew-resize';
  }

  function dragMove(e: MouseEvent) {
    if (isDrag) {
      const position = isVertical ? e.pageY : e.pageX;
      const totalSize = isVertical
        ? container.offsetHeight
        : container.offsetWidth;
      const dp = position - startPosition;
      split = startSplit + ~~((dp / totalSize) * 100);
      setPaneSplit();
    }
  }

  function dragEnd() {
    isDrag = false;
    container.style.userSelect = 'initial';
    container.style.cursor = 'initial';
  }

  dragger.addEventListener('mousedown', dragStart);
  container.addEventListener('mousemove', dragMove);
  container.addEventListener('mouseup', dragEnd);
  container.addEventListener('mouseleave', dragEnd);

  const resizeSplitPane = () => {};
};
