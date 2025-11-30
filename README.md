# Easy Picker

An easy-to-use date and time picker component built with vanilla JavaScript/TypeScript. Framework-agnostic and works with React, Vue, Angular, Svelte, or any other frontend framework.

## Features

- Simple select-based interface
- Multiple picker modes: Date, DateTime, Time
- **Configurable return formats** (Date object, ISO string, timestamp, date-string)
- **Timezone-safe** date handling (prevents off-by-one day issues)
- Fully typed with TypeScript
- Framework-agnostic (works with vanilla JS and all frameworks)
- Zero dependencies
- Responsive and mobile-friendly
- Dark mode support
- Customizable date ranges
- Custom styling support (Tailwind, Bootstrap, etc.)

## Installation

```bash
npm install @kevinagyeman/easy-picker
```

## Usage

### Vanilla JavaScript/TypeScript

```typescript
import EasyPicker from '@kevinagyeman/easy-picker'
import '@kevinagyeman/easy-picker/dist/style.css'

// Create a date picker
const picker = new EasyPicker({
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
import { useEffect, useRef, useState } from 'react'
import EasyPicker from '@kevinagyeman/easy-picker'
import '@kevinagyeman/easy-picker/dist/style.css'

function DatePickerComponent() {
  const [date, setDate] = useState(new Date())
  const containerRef = useRef<HTMLDivElement>(null)
  const pickerRef = useRef<EasyPicker | null>(null)

  useEffect(() => {
    if (containerRef.current) {
      pickerRef.current = new EasyPicker({
        container: containerRef.current,
        format: 'date',
        initialDate: date,
        onChange: setDate
      })
    }

    return () => {
      pickerRef.current?.destroy()
    }
  }, [])

  // Sync picker when external state changes
  useEffect(() => {
    pickerRef.current?.update(date)
  }, [date])

  return (
    <div>
      <div ref={containerRef}></div>
      <button onClick={() => setDate(new Date())}>Reset to Today</button>
    </div>
  )
}
```

### Vue

```vue
<template>
  <div ref="pickerContainer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import EasyPicker from '@kevinagyeman/easy-picker'
import '@kevinagyeman/easy-picker/dist/style.css'

const pickerContainer = ref(null)
let picker = null

onMounted(() => {
  picker = new EasyPicker({
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
import EasyPicker from '@kevinagyeman/easy-picker'
import '@kevinagyeman/easy-picker/dist/style.css'

@Component({
  selector: 'app-date-picker',
  template: '<div #pickerContainer></div>'
})
export class DatePickerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('pickerContainer') pickerContainer!: ElementRef
  private picker?: EasyPicker

  ngAfterViewInit() {
    this.picker = new EasyPicker({
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
interface EasyPickerOptions {
  // Container element or CSS selector
  container: HTMLElement | string

  // Initial date to display
  initialDate?: Date

  // Minimum selectable date
  minDate?: Date

  // Maximum selectable date
  maxDate?: Date

  // Callback fired when date changes
  onChange?: (value: Date | string | number) => void

  // Picker format: 'date', 'datetime', or 'time'
  format?: 'date' | 'datetime' | 'time'

  // Locale for month names (default: 'en-US')
  locale?: string

  // Custom CSS class for select elements (e.g., Tailwind classes)
  selectClassName?: string

  // Custom CSS class for wrapper elements
  wrapperClassName?: string

  // Return format for date values (default: 'date')
  // 'date' - JavaScript Date object
  // 'iso' - ISO 8601 string (e.g., "2025-03-15T12:00:00.000Z")
  // 'timestamp' - Unix timestamp in milliseconds
  // 'date-string' - Date-only string (e.g., "2025-03-15")
  returnFormat?: 'date' | 'iso' | 'timestamp' | 'date-string'
}
```

### Methods

#### `getDate(): Date | string | number`
Returns the currently selected date in the format specified by `returnFormat`.

```typescript
const currentDate = picker.getDate()
// Returns Date object by default
// Or ISO string, timestamp, or date-string based on returnFormat option
```

#### `getRawDate(): Date`
Always returns the current date as a JavaScript Date object, regardless of `returnFormat`.

```typescript
const rawDate = picker.getRawDate()
// Always returns a Date object
```

#### `setDate(date: Date): void`
Programmatically sets the picker to a specific date.

```typescript
picker.setDate(new Date(2025, 5, 15))
```

#### `update(date: Date): void`
Updates the picker's date from external state (e.g., form state). Unlike `setDate()`, this is designed for syncing with external state and won't trigger `onChange`.

```typescript
// Perfect for form integration
const formState = { date: new Date() };
picker.update(formState.date);
```

**Use `update()` when:**
- Syncing with form/component state
- Resetting the picker
- Responding to external state changes

**Use `setDate()` when:**
- Programmatically changing the date
- Initial setup

#### `destroy(): void`
Removes the picker from the DOM and cleans up event listeners.

```typescript
picker.destroy()
```

## Picker Formats

### Date Picker
Shows month, day, and year columns.

```typescript
new EasyPicker({
  container: '#picker',
  format: 'date'
})
```

### DateTime Picker
Shows month, day, year, hour, and minute columns.

```typescript
new EasyPicker({
  container: '#picker',
  format: 'datetime'
})
```

### Time Picker
Shows hour and minute columns only.

```typescript
new EasyPicker({
  container: '#picker',
  format: 'time'
})
```

## Return Formats

Control how date values are returned in the `onChange` callback and `getDate()` method:

### Date Object (default)
```typescript
new EasyPicker({
  container: '#picker',
  format: 'date',
  returnFormat: 'date', // default
  onChange: (date) => {
    console.log(date) // Date object: Mon Mar 15 2025 12:00:00 GMT...
  }
})
```

### ISO String
```typescript
new EasyPicker({
  container: '#picker',
  format: 'date',
  returnFormat: 'iso',
  onChange: (isoString) => {
    console.log(isoString) // "2025-03-15T12:00:00.000Z"
    // Perfect for APIs and databases
  }
})
```

### Unix Timestamp
```typescript
new EasyPicker({
  container: '#picker',
  format: 'date',
  returnFormat: 'timestamp',
  onChange: (timestamp) => {
    console.log(timestamp) // 1710504000000
    // Number of milliseconds since Unix epoch
  }
})
```

### Date String (YYYY-MM-DD)
```typescript
new EasyPicker({
  container: '#picker',
  format: 'date',
  returnFormat: 'date-string',
  onChange: (dateString) => {
    console.log(dateString) // "2025-03-15"
    // Perfect for HTML input type="date" or simple date storage
  }
})
```

**Note:** When using `format: 'date'`, dates are set to noon (12:00) to prevent timezone-related issues where the date shifts by one day when converted between timezones.

## Styling

### Using Framework CSS (Tailwind, Bootstrap, etc.)

Pass custom classes via the `selectClassName` option:

```typescript
// Tailwind CSS
new EasyPicker({
  container: '#picker',
  format: 'date',
  selectClassName: 'px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500',
  wrapperClassName: 'mx-2'
})

// Bootstrap
new EasyPicker({
  container: '#picker',
  format: 'date',
  selectClassName: 'form-select',
  wrapperClassName: 'mb-3'
})
```

### Custom CSS

Override the default styles in your own CSS:

```css
.easy-picker-select {
  /* Your custom select styles */
  border: 2px solid #0071e3;
  border-radius: 12px;
}

.easy-picker-select:focus {
  outline: none;
  box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.2);
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

## Changelog

### v1.1.0 (Latest)
- ✨ Added `returnFormat` option to choose output format (date, iso, timestamp, date-string)
- ✨ Added `getRawDate()` method to always get Date object
- 🐛 Fixed timezone bug by setting date picker to noon (prevents day shifting)
- 📝 Updated TypeScript types for `onChange` callback

### v1.0.0
- 🎉 Initial release
- Date, DateTime, and Time picker modes
- Framework-agnostic vanilla JS/TypeScript
- Custom styling support
- Dark mode support

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
