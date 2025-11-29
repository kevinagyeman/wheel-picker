import path from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/wheel-picker.ts'),
            name: 'WheelPicker',
            fileName: (format) => `wheel-picker.${format === 'es' ? 'js' : 'umd.js'}`,
            formats: ['es', 'umd']
        },
        rollupOptions: {
            external: [],
            output: {
                globals: {},
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name === 'style.css') return 'style.css'
                    return assetInfo.name || ''
                }
            }
        },
        cssCodeSplit: false
    },
    plugins: [
        dts({
            include: ['src/wheel-picker.ts'],
            rollupTypes: true
        })
    ]
})
