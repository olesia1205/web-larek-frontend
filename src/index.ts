import './scss/styles.scss';

import { AppState } from './components/AppState';
import { EventEmitter } from './components/base/EventEmitter';
import { Page } from './components/Page';
import { Modal } from './components/Modal';
import { Card } from './components/Card';
import { WebLarekAPI } from './components/WebLarekAPI';
import { IProduct } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const events = new EventEmitter();
const appData = new AppState({}, events);
const api = new WebLarekAPI(CDN_URL, API_URL);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');

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
