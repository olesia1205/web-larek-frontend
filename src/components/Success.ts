import { ISuccessActions, ISuccessModal } from '../types';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';

export class Success extends Component<ISuccessModal> {
	protected _close: HTMLButtonElement;
	protected _totalPrice: HTMLElement;

	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);

		this._close = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			container
		);
		this._totalPrice = ensureElement<HTMLElement>(
			'.order-success__description',
			container
		);

		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		};
	};

	set totalPrice(value: string) {
		this.setText(this._totalPrice, `Списано ${value} синапсов`);
	};
};
