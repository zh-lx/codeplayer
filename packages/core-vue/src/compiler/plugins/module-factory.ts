import { Hooks } from '@/compiler/type'
import { compileModulesForPreview } from '@/compiler/module'

export default function(hooks: Hooks) {
  hooks.hook('compile-module', compileModulesForPreview)
}