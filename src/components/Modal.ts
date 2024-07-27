import { IEvents, IModalData } from '../types';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';

export class Modal extends Component<IModalData> {
	protected _content: HTMLElement;
	protected _closeButton: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._content = ensureElement<HTMLElement>('.modal__content', container);
		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);

		this._content.addEventListener('click', (event) => event.stopPropagation());
		this._closeButton.addEventListener('click', this.closeModal.bind(this));
		this.container.addEventListener('click', this.closeModal.bind(this));
	};

	openModal() {
		this.toggleClass(this.container, 'modal_active', true);
		this.events.emit('modal:open');
	};

	closeModal() {
		this.toggleClass(this.container, 'modal_active', false);
		this.events.emit('modal:close');
	};

	render(data: IModalData): HTMLElement {
		super.render(data);
		this.openModal();
		return this.container;
	};

	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	};
};
