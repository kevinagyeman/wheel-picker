import "./easy-picker.css";

export interface EasyPickerOptions {
	container: HTMLElement | string;
	initialDate?: Date;
	minDate?: Date;
	maxDate?: Date;
	onChange?: (date: Date) => void;
	format?: "date" | "datetime" | "time";
	locale?: string;
}

export class EasyPicker {
	private container: HTMLElement;
	private options: Required<EasyPickerOptions>;
	private picker: HTMLElement | null = null;
	private currentDate: Date;
	private selects: HTMLSelectElement[] = [];

	constructor(options: EasyPickerOptions) {
		const containerElement =
			typeof options.container === "string"
				? (document.querySelector(options.container) as HTMLElement)
				: options.container;

		if (!containerElement) {
			throw new Error("Container element not found");
		}

		this.container = containerElement;
		this.currentDate = options.initialDate || new Date();

		this.options = {
			container: containerElement,
			initialDate: this.currentDate,
			minDate: options.minDate || new Date(1900, 0, 1),
			maxDate: options.maxDate || new Date(2100, 11, 31),
			onChange: options.onChange || (() => {}),
			format: options.format || "date",
			locale: options.locale || "en-US",
		};

		this.init();
	}

	private init(): void {
		this.render();
	}

	private render(): void {
		this.picker = document.createElement("div");
		this.picker.className = "easy-picker";

		const selectsContainer = document.createElement("div");
		selectsContainer.className = "easy-picker-selects";

		const { format } = this.options;

		if (format === "date" || format === "datetime") {
			// Month select
			const monthSelect = this.createSelect("month");
			const months = Array.from({ length: 12 }, (_, i) =>
				new Date(2000, i, 1).toLocaleDateString(this.options.locale, {
					month: "long",
				}),
			);
			months.forEach((month, index) => {
				const option = document.createElement("option");
				option.value = String(index);
				option.textContent = month;
				monthSelect.appendChild(option);
			});
			monthSelect.value = String(this.currentDate.getMonth());
			selectsContainer.appendChild(this.createSelectWrapper(monthSelect));
			this.selects.push(monthSelect);

			// Day select
			const daySelect = this.createSelect("day");
			this.updateDayOptions(daySelect);
			daySelect.value = String(this.currentDate.getDate());
			selectsContainer.appendChild(this.createSelectWrapper(daySelect));
			this.selects.push(daySelect);

			// Year select
			const yearSelect = this.createSelect("year");
			const years = Array.from(
				{
					length:
						this.options.maxDate.getFullYear() -
						this.options.minDate.getFullYear() +
						1,
				},
				(_, i) => this.options.minDate.getFullYear() + i,
			);
			years.forEach((year) => {
				const option = document.createElement("option");
				option.value = String(year);
				option.textContent = String(year);
				yearSelect.appendChild(option);
			});
			yearSelect.value = String(this.currentDate.getFullYear());
			selectsContainer.appendChild(this.createSelectWrapper(yearSelect));
			this.selects.push(yearSelect);
		}

		if (format === "datetime" || format === "time") {
			// Hour select
			const hourSelect = this.createSelect("hour");
			Array.from({ length: 24 }, (_, i) => i).forEach((hour) => {
				const option = document.createElement("option");
				option.value = String(hour);
				option.textContent = String(hour).padStart(2, "0");
				hourSelect.appendChild(option);
			});
			hourSelect.value = String(this.currentDate.getHours());
			selectsContainer.appendChild(this.createSelectWrapper(hourSelect));
			this.selects.push(hourSelect);

			// Minute select
			const minuteSelect = this.createSelect("minute");
			Array.from({ length: 60 }, (_, i) => i).forEach((minute) => {
				const option = document.createElement("option");
				option.value = String(minute);
				option.textContent = String(minute).padStart(2, "0");
				minuteSelect.appendChild(option);
			});
			minuteSelect.value = String(this.currentDate.getMinutes());
			selectsContainer.appendChild(this.createSelectWrapper(minuteSelect));
			this.selects.push(minuteSelect);
		}

		this.picker.appendChild(selectsContainer);
		this.container.appendChild(this.picker);

		this.attachEvents();
	}

	private createSelect(name: string): HTMLSelectElement {
		const select = document.createElement("select");
		select.className = "easy-picker-select";
		select.dataset.field = name;
		return select;
	}

	private createSelectWrapper(select: HTMLSelectElement): HTMLElement {
		const wrapper = document.createElement("div");
		wrapper.className = "easy-picker-select-wrapper";
		wrapper.appendChild(select);
		return wrapper;
	}

	private updateDayOptions(daySelect: HTMLSelectElement): void {
		const monthSelect = this.selects[0];
		const yearSelect = this.selects[2];

		if (!monthSelect || !yearSelect) {
			// Initial render - use current date
			const daysInMonth = new Date(
				this.currentDate.getFullYear(),
				this.currentDate.getMonth() + 1,
				0,
			).getDate();
			for (let i = 1; i <= daysInMonth; i++) {
				const option = document.createElement("option");
				option.value = String(i);
				option.textContent = String(i);
				daySelect.appendChild(option);
			}
			return;
		}

		const month = parseInt(monthSelect.value);
		const year = parseInt(yearSelect.value);
		const daysInMonth = new Date(year, month + 1, 0).getDate();
		const currentValue = parseInt(daySelect.value) || 1;

		daySelect.innerHTML = "";
		for (let i = 1; i <= daysInMonth; i++) {
			const option = document.createElement("option");
			option.value = String(i);
			option.textContent = String(i);
			daySelect.appendChild(option);
		}

		daySelect.value = String(Math.min(currentValue, daysInMonth));
	}

	private attachEvents(): void {
		this.selects.forEach((select) => {
			select.addEventListener("change", () => {
				const { format } = this.options;

				// Update day options when month or year changes
				if (
					(format === "date" || format === "datetime") &&
					(select.dataset.field === "month" || select.dataset.field === "year")
				) {
					this.updateDayOptions(this.selects[1]);
				}

				this.onDateChange();
			});
		});
	}

	private onDateChange(): void {
		const { format } = this.options;
		let newDate: Date;

		if (format === "date" || format === "datetime") {
			const month = parseInt(this.selects[0].value);
			const day = parseInt(this.selects[1].value);
			const year = parseInt(this.selects[2].value);

			if (format === "datetime") {
				const hour = parseInt(this.selects[3].value);
				const minute = parseInt(this.selects[4].value);
				newDate = new Date(year, month, day, hour, minute);
			} else {
				newDate = new Date(year, month, day);
			}
		} else {
			// time format
			const hour = parseInt(this.selects[0].value);
			const minute = parseInt(this.selects[1].value);
			newDate = new Date();
			newDate.setHours(hour, minute, 0, 0);
		}

		this.currentDate = newDate;
		this.options.onChange(newDate);
	}

	public getDate(): Date {
		return this.currentDate;
	}

	public setDate(date: Date): void {
		this.currentDate = date;

		const { format } = this.options;

		if (format === "date" || format === "datetime") {
			this.selects[0].value = String(date.getMonth());
			this.selects[1].value = String(date.getDate());
			this.selects[2].value = String(date.getFullYear());

			if (format === "datetime") {
				this.selects[3].value = String(date.getHours());
				this.selects[4].value = String(date.getMinutes());
			}
		} else {
			this.selects[0].value = String(date.getHours());
			this.selects[1].value = String(date.getMinutes());
		}
	}

	public destroy(): void {
		if (this.picker) {
			this.container.removeChild(this.picker);
			this.picker = null;
			this.selects = [];
		}
	}
}

export default EasyPicker;
