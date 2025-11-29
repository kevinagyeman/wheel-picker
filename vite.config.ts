import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/wheel-picker.ts'),
            name: 'WheelPicker',
            fileName: 'wheel-picker',
            formats: ['es', 'umd']
        },
        rollupOptions: {
            external: [],
            output: { globals: {} }
        }
    }
})
