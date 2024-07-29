import { IEvents, IForm } from '../types';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';

export class Form<T> extends Component<IForm> {
	protected _submit: HTMLButtonElement;
	protected _errors: HTMLElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this._submit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

		this.container.addEventListener('submit', (evt: Event) => {
			evt.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
	};

	set isValid(value: boolean) {
		this.setDisabled(this._submit, !value);
	};

	set errors(value: string) {
		this.setText(this._errors, value);
	};

	render(state: Partial<T> & IForm) {
		const { isValid, errors, ...inputs } = state;
		super.render({ isValid, errors });
		Object.assign(this, inputs);
		return this.container;
	};
};
