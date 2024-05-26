import {presetUno, presetIcons, presetWebFonts, transformerDirectives, defineConfig} from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons(),
    presetWebFonts(),
  ],
  transformers: [
    transformerDirectives()
  ]
})