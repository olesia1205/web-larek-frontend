import './scss/styles.scss';

import { Address } from './components/Address';
import { AppState } from './components/AppState';
import { EventEmitter } from './components/base/EventEmitter';
import { Basket } from './components/Basket';
import { Page } from './components/Page';
import { Modal } from './components/Modal';
import { Card } from './components/Card';
import { WebLarekAPI } from './components/WebLarekAPI';
import { IOrderForm, IProduct } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const events = new EventEmitter();
const appData = new AppState({}, events);
const api = new WebLarekAPI(CDN_URL, API_URL);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');

const basket = new Basket(cloneTemplate(basketTemplate), events);
const addressForm = new Address(cloneTemplate(orderTemplate), events);

export type CatalogChangeEvent = {
	catalog: IProduct[];
};

events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

api
	.getProducts()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});

events.on('modal:open', () => {
  page.locked = true;
});

events.on('modal:close', () => {
  page.locked = false;
});  

events.on<CatalogChangeEvent>('larek:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
		});
	});
});

events.on('card:select', (item: IProduct) => {
	appData.setPreview(item);
});

events.on('preview:changed', (item: IProduct) => {
	const card = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			events.emit('product:selected', item);
			card.titleButton =
				appData.basket.indexOf(item) === -1 ? 'Купить' : 'Удалить из корзины';
		},
	});

	modal.render({
		content: card.render({
			description: item.description,
			image: item.image,
			title: item.title,
			category: item.category,
			price: item.price,
			titleButton:
				appData.basket.indexOf(item) === -1 ? 'Купить' : 'Удалить из корзины',
		}),
	});
});

events.on('product:selected', (item: IProduct) => {
	if (appData.basket.indexOf(item) === -1) {
		appData.addToBasket(item);
		events.emit('product:add', item);
	} else {
		appData.removeFromBasket(item);
		events.emit('product:remove', item);
	}
});

events.on('basket:open', () => {
	modal.render({ content: basket.render({}) });
});

events.on('basket:changed', (items: IProduct[]) => {
	basket.products = items.map((item, index) => {
		const card = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				events.emit('card:delete', item);
			},
		});

		return card.render({
			title: item.title,
			price: item.price,
			index: (index + 1).toString(),
		});
	});

	const total = appData.getTotalPrice();
	basket.total = total;
	appData.order.total = total;
	appData.order.items = appData.basket.map((item) => item.id);

	basket.selected = appData.basket.length;
});

events.on('card:delete', (item: IProduct) => appData.removeFromBasket(item));

events.on('counter:changed', () => {
	page.counter = appData.basket.length;
});

events.on('addressForm:open', () => {
	modal.render({
		content: addressForm.render({
			payment: '',
			address: '',
			isValid: false,
			errors: [],
		}),
	});
});

events.on(
	'address:change',
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setAddress(data.field, data.value);
	}
);

events.on('address:exist', () => {
	addressForm.isValid = true;
});

events.on(
	'address:null',
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setAddress(data.field, '');
	}
);