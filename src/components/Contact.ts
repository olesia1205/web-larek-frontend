import { IEvents, IOrderForm } from '../types';
import { ensureElement } from '../utils/utils';
import { Form } from './Form';

export class Contact extends Form<IOrderForm> {
	protected _email: HTMLElement;
	protected _phone: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._email = ensureElement<HTMLInputElement>('.email', this.container);
		this._phone = ensureElement<HTMLInputElement>('.phone', this.container);
		this._button = this.container.querySelector('.contacts__button');

		if (this._email) {
			this._email.addEventListener('input', (evt: InputEvent) => {
				const target = evt.target as HTMLInputElement;
				const value = target.value;
				if (value !== '') {
					events.emit('contacts:change', { field: 'email', value: value });
				} else {
					events.emit('email:null', { field: 'email', value: value });
					this.setDisabled(this._button, true);
				};
			});
		};

		if (this._phone) {
			this._phone.addEventListener('input', (evt: InputEvent) => {
				const target = evt.target as HTMLInputElement;
				const value = target.value;
				if (value !== '') {
					events.emit('contacts:change', { field: 'phone', value: value });
				} else {
					events.emit('phone:null', { field: 'phone', value: value });
					this.setDisabled(this._button, true);
				};
			});
		};
	};

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	};

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	};
};
