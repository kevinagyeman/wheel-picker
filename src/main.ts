import WheelPicker from './wheel-picker'

// Date Picker
const datePicker = new WheelPicker({
  container: '#date-picker',
  format: 'date',
  initialDate: new Date(),
  onChange: (date) => {
    const output = document.getElementById('date-output')
    if (output) {
      output.innerHTML = `<strong>Selected:</strong> ${date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}`
    }
  }
})

// Trigger initial display
datePicker.setDate(new Date())

// DateTime Picker
const dateTimePicker = new WheelPicker({
  container: '#datetime-picker',
  format: 'datetime',
  initialDate: new Date(),
  onChange: (date) => {
    const output = document.getElementById('datetime-output')
    if (output) {
      output.innerHTML = `<strong>Selected:</strong> ${date.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`
    }
  }
})

dateTimePicker.setDate(new Date())

// Time Picker
const timePicker = new WheelPicker({
  container: '#time-picker',
  format: 'time',
  initialDate: new Date(),
  onChange: (date) => {
    const output = document.getElementById('time-output')
    if (output) {
      output.innerHTML = `<strong>Selected:</strong> ${date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })}`
    }
  }
})

timePicker.setDate(new Date())
