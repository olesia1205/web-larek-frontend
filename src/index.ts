import './scss/styles.scss';

import { AppState } from './components/AppState';
import { EventEmitter } from './components/base/EventEmitter';
import { Page } from './components/Page';
import { Card } from './components/Card';
import { WebLarekAPI } from './components/WebLarekAPI';
import { IProduct } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const events = new EventEmitter();
const appData = new AppState({}, events);
const api = new WebLarekAPI(CDN_URL, API_URL);

const page = new Page(document.body, events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');

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
