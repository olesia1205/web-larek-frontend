import { IProduct } from '../types';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export class Card extends Component<IProduct> {
	protected _description: HTMLElement;
	protected _image: HTMLImageElement;
	protected _title: HTMLElement;
	protected _category: HTMLElement;
	protected _price: HTMLElement;
	protected _index: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _titleButton: string;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._description = container.querySelector(`.card__text`);
		this._image = container.querySelector(`.card__image`);
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._category = container.querySelector(`.card__category`);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._index = container.querySelector(`.basket__item-index`);
		this._button = container.querySelector(`.card__button`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			};
		};
	};

	set id(value: string) {
		this.container.dataset.id = value;
	};

	get id(): string {
		return this.container.dataset.id || '';
	};

	set description(value: string) {
		this.setText(this._description, value);
	};

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	};

	set title(value: string) {
		this.setText(this._title, value);
	};

	get title(): string {
		return this._title.textContent || '';
	};

	set category(value: string) {
		this.setText(this._category, value);
		switch (value) {
			case 'софт-скил':
				this.toggleClass(this._category, 'card__category_soft', true);
				break;
			case 'хард-скил':
				this.toggleClass(this._category, 'card__category_hard', true);
				break;
			case 'дополнительное':
				this.toggleClass(this._category, 'card__category_additional', true);
				break;
			case 'кнопка':
				this.toggleClass(this._category, 'card__category_button', true);
				break;
			default:
				this.toggleClass(this._category, 'card__category_other', true);
				break;
		};
	};

	set price(value: number | null) {
		this.setText(
			this._price,
			value ? `${value.toString()} синапсов` : 'Бесценно'
		);
		this.buttonVisibility(value);
	};

	get price(): number {
		return Number(this._price.textContent || '');
	};

	set index(value: string) {
		this.setText(this._index, value);
	};

	get index(): string {
		return this._index.textContent || '';
	};

	set titleButton(value: string) {
		this.setText(this._button, value);
	};

	buttonVisibility(value: number | null) {
		if (value === null) {
			if (this._button) {
				this.setDisabled(this._button, true);
			};
		};
	};
};
