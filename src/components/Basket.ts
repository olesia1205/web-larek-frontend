import { IBasket } from '../types';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { EventEmitter } from './base/EventEmitter';

export class Basket extends Component<IBasket> {
	protected _products: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._products = ensureElement<HTMLElement>('.basket__list', container);
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('addressForm:open');
			});
		};
		this.setDisabled(this._button, true);
	};

	set products(products: HTMLElement[]) {
		this._products.replaceChildren(...products);
	};

	set total(total: number) {
		this.setText(this._total, total.toString() + ' синапсов');
	};

	set selected(products: number) {
		const hasProducts = products > 0;
		this.setDisabled(this._button, !hasProducts);
	};
};
