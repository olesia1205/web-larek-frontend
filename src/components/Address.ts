import { IEvents, IOrderForm } from '../types';
import { ensureElement } from '../utils/utils';
import { Form } from './Form';

export class Address extends Form<IOrderForm> {
	protected _address: HTMLInputElement;
	protected _button: HTMLButtonElement;
	protected _buttons: HTMLButtonElement[];

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._buttons = Array.from(container.querySelectorAll('.button_alt'));
		this._address = ensureElement<HTMLInputElement>('.address', this.container);
		this._button = this.container.querySelector('.order__button');

		this._buttons.forEach((button) => {
			button.addEventListener('click', (evt: Event) => {
				evt.preventDefault();
				this.selected = button.name;
				events.emit('address:change', { field: 'payment', value: button.name });
			});
		});

		if (this._address) {
			this._address.addEventListener('input', (evt: InputEvent) => {
				const target = evt.target as HTMLInputElement;
				const value = target.value;
				if (value !== '') {
					events.emit('address:change', { field: 'address', value: value });
				} else {
					events.emit('address:null', { field: 'address', value: value });
					this.setDisabled(this._button, true);
				};
			});
		};
	};

	set selected(name: string) {
		this._buttons.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === name);
		});
	};

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value = value;
	};
};
