import { Hookable } from 'hookable'

export type Hooks = Hookable<Record<string, any>, string>;

export type Plugin = (hooks: Hooks) => void;