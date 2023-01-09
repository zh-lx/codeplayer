interface SplitterElements {
  el: HTMLElement;
  container: HTMLElement;
  left: HTMLElement;
  right: HTMLElement;
}

interface SplitterState {
  split: number; // 左边拖动区域所占百分比
  isDrag: boolean; // 当前是否正在拖动中
  startPosition: number; // 起始拖动的鼠标位置
  startSplit: number; // 起始拖动时左边区域所占百分比
  isVertical: boolean; // 是否垂直布局
}

interface SplitterOptions {
  elements: SplitterElements;
  isVertical?: boolean;
}

// 左右拖动布局
export default class Splitter {
  state: SplitterState;
  elements: SplitterElements;
  constructor(options: SplitterOptions) {
    const { elements, isVertical } = options;
    this.elements = elements;
    this.state = {
      isVertical: !!isVertical,
      split: 50,
      isDrag: false,
      startPosition: 0,
      startSplit: 0,
    };
    this.init();
  }

  init() {
    this.initSplit();
    this.elements.el.addEventListener('mousedown', this.dragStart);
    this.elements.container.addEventListener('mousemove', this.dragMove);
    this.elements.container.addEventListener('mouseup', this.dragEnd);
    this.elements.container.addEventListener('mouseleave', this.dragEnd);
  }

  computedSplitBound() {
    return this.state.split < 20
      ? 20
      : this.state.split > 80
      ? 80
      : this.state.split;
  }

  dragStart = (e: MouseEvent) => {
    this.state.isDrag = true;
    this.state.startPosition = this.state.isVertical ? e.pageY : e.pageX;
    this.state.startSplit = this.computedSplitBound();
    this.elements.container.style.userSelect = 'none';
    this.elements.container.style.cursor = this.state.isVertical
      ? 'ns-resize'
      : 'ew-resize';
    const mask = document.querySelector('.code-sandbox-iframe-mask');
    mask?.classList.remove('code-sandbox-iframe-mask-hidden');
  };

  dragMove = (e: MouseEvent) => {
    if (this.state.isDrag) {
      const position = this.state.isVertical ? e.pageY : e.pageX;
      const totalSize = this.state.isVertical
        ? this.elements.container.offsetHeight
        : this.elements.container.offsetWidth;
      const dp = position - this.state.startPosition;
      this.state.split = this.state.startSplit + ~~((dp / totalSize) * 100);
      this.elements.left.style[this.state.isVertical ? 'height' : 'width'] =
        this.computedSplitBound() + '%';
      this.elements.right.style[this.state.isVertical ? 'height' : 'width'] =
        100 - this.computedSplitBound() + '%';
    }
  };

  dragEnd = () => {
    this.state.isDrag = false;
    this.elements.container.style.userSelect = 'initial';
    this.elements.container.style.cursor = 'initial';
    const mask = document.querySelector('.code-sandbox-iframe-mask');
    mask?.classList.add('code-sandbox-iframe-mask-hidden');
  };

  initSplit() {
    this.elements.left.style[this.state.isVertical ? 'height' : 'width'] =
      this.computedSplitBound() + '%';
    this.elements.right.style[this.state.isVertical ? 'height' : 'width'] =
      100 - this.computedSplitBound() + '%';
  }
}
