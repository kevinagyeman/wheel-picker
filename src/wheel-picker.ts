import './wheel-picker.css'

export interface WheelPickerOptions {
  container: HTMLElement | string
  initialDate?: Date
  minDate?: Date
  maxDate?: Date
  onChange?: (date: Date) => void
  format?: 'date' | 'datetime' | 'time'
  locale?: string
}

interface WheelColumn {
  element: HTMLElement
  values: (string | number)[]
  selectedIndex: number
  scrollTop: number
  isScrolling: boolean
}

export class WheelPicker {
  private container: HTMLElement
  private options: Required<WheelPickerOptions>
  private picker: HTMLElement | null = null
  private columns: WheelColumn[] = []
  private currentDate: Date
  private itemHeight = 40
  private visibleItems = 5

  constructor(options: WheelPickerOptions) {
    const containerElement = typeof options.container === 'string'
      ? document.querySelector(options.container) as HTMLElement
      : options.container

    if (!containerElement) {
      throw new Error('Container element not found')
    }

    this.container = containerElement
    this.currentDate = options.initialDate || new Date()

    this.options = {
      container: containerElement,
      initialDate: this.currentDate,
      minDate: options.minDate || new Date(1900, 0, 1),
      maxDate: options.maxDate || new Date(2100, 11, 31),
      onChange: options.onChange || (() => {}),
      format: options.format || 'date',
      locale: options.locale || 'en-US'
    }

    this.init()
  }

  private init(): void {
    this.render()
    this.updateColumns()
  }

  private render(): void {
    this.picker = document.createElement('div')
    this.picker.className = 'wheel-picker'

    const columnsContainer = document.createElement('div')
    columnsContainer.className = 'wheel-picker-columns'

    const columnConfigs = this.getColumnConfigs()

    columnConfigs.forEach((config, index) => {
      const columnWrapper = document.createElement('div')
      columnWrapper.className = 'wheel-picker-column-wrapper'

      const column = document.createElement('div')
      column.className = 'wheel-picker-column'
      column.dataset.columnIndex = String(index)

      const values = config.values
      const selectedIndex = values.indexOf(config.selected)

      this.columns.push({
        element: column,
        values: values,
        selectedIndex: selectedIndex >= 0 ? selectedIndex : 0,
        scrollTop: 0,
        isScrolling: false
      })

      values.forEach((value, valueIndex) => {
        const item = document.createElement('div')
        item.className = 'wheel-picker-item'
        item.textContent = String(value)
        item.dataset.index = String(valueIndex)
        column.appendChild(item)
      })

      columnWrapper.appendChild(column)
      columnsContainer.appendChild(columnWrapper)

      this.attachColumnEvents(column, index)
    })

    const highlight = document.createElement('div')
    highlight.className = 'wheel-picker-highlight'

    this.picker.appendChild(columnsContainer)
    this.picker.appendChild(highlight)
    this.container.appendChild(this.picker)

    this.scrollToSelected()
  }

  private getColumnConfigs(): Array<{ values: (string | number)[], selected: string | number }> {
    const { format, minDate, maxDate } = this.options
    const currentYear = this.currentDate.getFullYear()
    const currentMonth = this.currentDate.getMonth()
    const currentDay = this.currentDate.getDate()
    const currentHour = this.currentDate.getHours()
    const currentMinute = this.currentDate.getMinutes()

    const configs: Array<{ values: (string | number)[], selected: string | number }> = []

    if (format === 'date' || format === 'datetime') {
      // Month column
      const months = Array.from({ length: 12 }, (_, i) =>
        new Date(2000, i, 1).toLocaleDateString(this.options.locale, { month: 'long' })
      )
      configs.push({ values: months, selected: months[currentMonth] })

      // Day column
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
      const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
      configs.push({ values: days, selected: currentDay })

      // Year column
      const years = Array.from(
        { length: maxDate.getFullYear() - minDate.getFullYear() + 1 },
        (_, i) => minDate.getFullYear() + i
      )
      configs.push({ values: years, selected: currentYear })
    }

    if (format === 'datetime' || format === 'time') {
      // Hour column
      const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
      configs.push({ values: hours, selected: String(currentHour).padStart(2, '0') })

      // Minute column
      const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))
      configs.push({ values: minutes, selected: String(currentMinute).padStart(2, '0') })
    }

    return configs
  }

  private attachColumnEvents(column: HTMLElement, columnIndex: number): void {
    let startY = 0
    let startScrollTop = 0
    let momentumId: number | null = null
    let lastY = 0
    let lastTime = 0
    let velocity = 0

    const handleStart = (clientY: number) => {
      if (momentumId !== null) {
        cancelAnimationFrame(momentumId)
        momentumId = null
      }

      startY = clientY
      startScrollTop = this.columns[columnIndex].scrollTop
      lastY = clientY
      lastTime = Date.now()
      velocity = 0
      this.columns[columnIndex].isScrolling = true
    }

    const handleMove = (clientY: number) => {
      if (!this.columns[columnIndex].isScrolling) return

      const deltaY = startY - clientY
      const newScrollTop = startScrollTop + deltaY

      const now = Date.now()
      const timeDelta = now - lastTime
      if (timeDelta > 0) {
        velocity = (lastY - clientY) / timeDelta
      }
      lastY = clientY
      lastTime = now

      this.columns[columnIndex].scrollTop = newScrollTop
      this.updateColumnTransform(columnIndex)
    }

    const handleEnd = () => {
      this.columns[columnIndex].isScrolling = false

      const momentum = velocity * 20
      const targetScrollTop = this.columns[columnIndex].scrollTop + momentum

      this.animateToNearest(columnIndex, targetScrollTop)
    }

    column.addEventListener('mousedown', (e) => {
      e.preventDefault()
      handleStart(e.clientY)
    })

    column.addEventListener('mousemove', (e) => {
      handleMove(e.clientY)
    })

    column.addEventListener('mouseup', handleEnd)
    column.addEventListener('mouseleave', () => {
      if (this.columns[columnIndex].isScrolling) {
        handleEnd()
      }
    })

    column.addEventListener('touchstart', (e) => {
      handleStart(e.touches[0].clientY)
    }, { passive: true })

    column.addEventListener('touchmove', (e) => {
      handleMove(e.touches[0].clientY)
    }, { passive: true })

    column.addEventListener('touchend', handleEnd, { passive: true })
  }

  private updateColumnTransform(columnIndex: number): void {
    const column = this.columns[columnIndex]
    const items = column.element.querySelectorAll('.wheel-picker-item')

    items.forEach((item, index) => {
      const offset = index * this.itemHeight - column.scrollTop
      const centerOffset = offset - (this.itemHeight * (this.visibleItems - 1) / 2)
      const distance = Math.abs(centerOffset)
      const scale = Math.max(0.7, 1 - distance / (this.itemHeight * 3))
      const opacity = Math.max(0.3, 1 - distance / (this.itemHeight * 2.5))

      const htmlItem = item as HTMLElement
      htmlItem.style.transform = `translateY(${offset}px) scale(${scale})`
      htmlItem.style.opacity = String(opacity)

      if (distance < this.itemHeight / 2) {
        htmlItem.classList.add('selected')
      } else {
        htmlItem.classList.remove('selected')
      }
    })
  }

  private animateToNearest(columnIndex: number, targetScrollTop: number): void {
    const column = this.columns[columnIndex]
    const maxScroll = (column.values.length - 1) * this.itemHeight
    const clampedTarget = Math.max(0, Math.min(maxScroll, targetScrollTop))

    const nearestIndex = Math.round(clampedTarget / this.itemHeight)
    const nearestScrollTop = nearestIndex * this.itemHeight

    const animate = () => {
      const diff = nearestScrollTop - column.scrollTop

      if (Math.abs(diff) < 0.5) {
        column.scrollTop = nearestScrollTop
        column.selectedIndex = nearestIndex
        this.updateColumnTransform(columnIndex)
        this.onDateChange()
        return
      }

      column.scrollTop += diff * 0.15
      this.updateColumnTransform(columnIndex)
      requestAnimationFrame(animate)
    }

    animate()
  }

  private scrollToSelected(): void {
    this.columns.forEach((column, index) => {
      column.scrollTop = column.selectedIndex * this.itemHeight
      this.updateColumnTransform(index)
    })
  }

  private updateColumns(): void {
    const { format } = this.options

    if (format === 'date' || format === 'datetime') {
      const monthIndex = this.columns[0].selectedIndex
      const year = this.columns[2].values[this.columns[2].selectedIndex] as number
      const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()

      const dayColumn = this.columns[1]
      const currentDayValue = dayColumn.values[dayColumn.selectedIndex]

      if (dayColumn.values.length !== daysInMonth) {
        const newDays = Array.from({ length: daysInMonth }, (_, i) => i + 1)
        dayColumn.values = newDays

        dayColumn.element.innerHTML = ''
        newDays.forEach((day, index) => {
          const item = document.createElement('div')
          item.className = 'wheel-picker-item'
          item.textContent = String(day)
          item.dataset.index = String(index)
          dayColumn.element.appendChild(item)
        })

        if (currentDayValue && typeof currentDayValue === 'number' && currentDayValue <= daysInMonth) {
          dayColumn.selectedIndex = currentDayValue - 1
        } else {
          dayColumn.selectedIndex = daysInMonth - 1
        }

        dayColumn.scrollTop = dayColumn.selectedIndex * this.itemHeight
        this.updateColumnTransform(1)
      }
    }
  }

  private onDateChange(): void {
    const { format } = this.options
    let newDate: Date

    if (format === 'date' || format === 'datetime') {
      const monthIndex = this.columns[0].selectedIndex
      const day = this.columns[1].values[this.columns[1].selectedIndex] as number
      const year = this.columns[2].values[this.columns[2].selectedIndex] as number

      if (format === 'datetime') {
        const hour = parseInt(this.columns[3].values[this.columns[3].selectedIndex] as string)
        const minute = parseInt(this.columns[4].values[this.columns[4].selectedIndex] as string)
        newDate = new Date(year, monthIndex, day, hour, minute)
      } else {
        newDate = new Date(year, monthIndex, day)
      }
    } else {
      const hour = parseInt(this.columns[0].values[this.columns[0].selectedIndex] as string)
      const minute = parseInt(this.columns[1].values[this.columns[1].selectedIndex] as string)
      newDate = new Date()
      newDate.setHours(hour, minute, 0, 0)
    }

    this.currentDate = newDate
    this.updateColumns()
    this.options.onChange(newDate)
  }

  public getDate(): Date {
    return this.currentDate
  }

  public setDate(date: Date): void {
    this.currentDate = date

    const { format } = this.options

    if (format === 'date' || format === 'datetime') {
      this.columns[0].selectedIndex = date.getMonth()
      this.columns[1].selectedIndex = date.getDate() - 1

      const yearValue = date.getFullYear()
      const yearIndex = this.columns[2].values.indexOf(yearValue)
      if (yearIndex >= 0) {
        this.columns[2].selectedIndex = yearIndex
      }

      if (format === 'datetime') {
        const hourValue = String(date.getHours()).padStart(2, '0')
        const minuteValue = String(date.getMinutes()).padStart(2, '0')
        this.columns[3].selectedIndex = this.columns[3].values.indexOf(hourValue)
        this.columns[4].selectedIndex = this.columns[4].values.indexOf(minuteValue)
      }
    } else {
      const hourValue = String(date.getHours()).padStart(2, '0')
      const minuteValue = String(date.getMinutes()).padStart(2, '0')
      this.columns[0].selectedIndex = this.columns[0].values.indexOf(hourValue)
      this.columns[1].selectedIndex = this.columns[1].values.indexOf(minuteValue)
    }

    this.scrollToSelected()
    this.updateColumns()
  }

  public destroy(): void {
    if (this.picker) {
      this.container.removeChild(this.picker)
      this.picker = null
      this.columns = []
    }
  }
}

export default WheelPicker
