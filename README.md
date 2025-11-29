# Wheel Picker

A wheel date picker component built with vanilla JavaScript/TypeScript. Framework-agnostic and works with React, Vue, Angular, Svelte, or any other frontend framework.

## Features

- Scrolling wheel interface
- Multiple picker modes: Date, DateTime, Time
- Smooth momentum scrolling
- Touch and mouse support
- Fully typed with TypeScript
- Framework-agnostic (works with vanilla JS and all frameworks)
- Zero dependencies
- Responsive and mobile-friendly
- Dark mode support
- Customizable date ranges

## Installation

```bash
npm install @kevinagyeman/wheel-picker
```

## Usage

### Vanilla JavaScript/TypeScript

```typescript
import WheelPicker from '@kevinagyeman/wheel-picker'
import '@kevinagyeman/wheel-picker/dist/style.css'

// Create a date picker
const picker = new WheelPicker({
  container: '#date-picker',
  format: 'date',
  initialDate: new Date(),
  onChange: (date) => {
    console.log('Selected date:', date)
  }
})
```

### React

```tsx
import { useEffect, useRef } from 'react'
import WheelPicker from '@kevinagyeman/wheel-picker'
import '@kevinagyeman/wheel-picker/dist/style.css'

function DatePickerComponent() {
  const containerRef = useRef<HTMLDivElement>(null)
  const pickerRef = useRef<WheelPicker | null>(null)

  useEffect(() => {
    if (containerRef.current) {
      pickerRef.current = new WheelPicker({
        container: containerRef.current,
        format: 'date',
        initialDate: new Date(),
        onChange: (date) => {
          console.log('Selected date:', date)
        }
      })
    }

    return () => {
      pickerRef.current?.destroy()
    }
  }, [])

  return <div ref={containerRef}></div>
}
```

### Vue

```vue
<template>
  <div ref="pickerContainer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import WheelPicker from '@kevinagyeman/wheel-picker'
import '@kevinagyeman/wheel-picker/dist/style.css'

const pickerContainer = ref(null)
let picker = null

onMounted(() => {
  picker = new WheelPicker({
    container: pickerContainer.value,
    format: 'date',
    initialDate: new Date(),
    onChange: (date) => {
      console.log('Selected date:', date)
    }
  })
})

onUnmounted(() => {
  picker?.destroy()
})
</script>
```

### Angular

```typescript
import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core'
import WheelPicker from '@kevinagyeman/wheel-picker'
import '@kevinagyeman/wheel-picker/dist/style.css'

@Component({
  selector: 'app-date-picker',
  template: '<div #pickerContainer></div>'
})
export class DatePickerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('pickerContainer') pickerContainer!: ElementRef
  private picker?: WheelPicker

  ngAfterViewInit() {
    this.picker = new WheelPicker({
      container: this.pickerContainer.nativeElement,
      format: 'date',
      initialDate: new Date(),
      onChange: (date) => {
        console.log('Selected date:', date)
      }
    })
  }

  ngOnDestroy() {
    this.picker?.destroy()
  }
}
```

## API

### Constructor Options

```typescript
interface WheelPickerOptions {
  // Container element or CSS selector
  container: HTMLElement | string

  // Initial date to display
  initialDate?: Date

  // Minimum selectable date
  minDate?: Date

  // Maximum selectable date
  maxDate?: Date

  // Callback fired when date changes
  onChange?: (date: Date) => void

  // Picker format: 'date', 'datetime', or 'time'
  format?: 'date' | 'datetime' | 'time'

  // Locale for month names (default: 'en-US')
  locale?: string
}
```

### Methods

#### `getDate(): Date`
Returns the currently selected date.

```typescript
const currentDate = picker.getDate()
```

#### `setDate(date: Date): void`
Programmatically sets the picker to a specific date.

```typescript
picker.setDate(new Date(2025, 5, 15))
```

#### `destroy(): void`
Removes the picker from the DOM and cleans up event listeners.

```typescript
picker.destroy()
```

## Picker Formats

### Date Picker
Shows month, day, and year columns.

```typescript
new WheelPicker({
  container: '#picker',
  format: 'date'
})
```

### DateTime Picker
Shows month, day, year, hour, and minute columns.

```typescript
new WheelPicker({
  container: '#picker',
  format: 'datetime'
})
```

### Time Picker
Shows hour and minute columns only.

```typescript
new WheelPicker({
  container: '#picker',
  format: 'time'
})
```

## Styling

The component comes with default styling, but you can customize it by overriding CSS variables or classes:

```css
.wheel-picker {
  /* Your custom styles */
}

.wheel-picker-item {
  /* Customize individual items */
}

.wheel-picker-highlight {
  /* Customize the selection highlight */
}
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development

```bash
# Install dependencies
npm install

# Run dev server with examples
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
