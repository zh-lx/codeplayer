import { css } from 'lit';

export const style = css`
  :host {
    --border-color: #ddd;
  }
  .code-sandbox {
    display: flex;
    position: relative;
    height: 100%;
    width: 100%;
    border: 1px solid var(--border-color);
  }

  .split-pane-left {
    position: relative;
    border-right: 1px solid var(--border-color);
  }
  .code-editor-container {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .split-pane-right {
    position: relative;
  }

  .dragger {
    position: absolute;
    z-index: 3;
    top: 0;
    bottom: 0;
    right: -5px;
    width: 10px;
    cursor: ew-resize;
  }

  code-editor {
    flex: 1;
    overflow: hidden;
  }
`;
