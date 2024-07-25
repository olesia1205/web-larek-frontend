import { IAppState, IOrder, IOrderForm, IProduct } from '../types';
import { Model } from './base/Model';

export class AppState extends Model<IAppState> {
	basket: IProduct[] = [];
	order: IOrder = {
		payment: '',
		address: '',
		email: '',
		phone: '',
		total: 0,
		items: [],
	};
	catalog: IProduct[];
	preview: string | null;

	addToBasket(item: IProduct) {
		this.basket.push(item);
		this.changeBasket();
	};

	removeFromBasket(item: IProduct) {
		this.basket = this.basket.filter((product) => product !== item);
		this.changeBasket();
	};

	clearBasket() {
		this.basket = [];
		this.changeBasket();
		this.order = {
			payment: '',
			address: '',
			email: '',
			phone: '',
			total: 0,
			items: [],
		};
	};

	getTotalPrice() {
		return this.basket.reduce((sum, next) => sum + (next.price ?? 0), 0);
	};

	setCatalog(products: IProduct[]) {
		this.catalog = products;
		this.onChange('larek:changed', { catalog: this.catalog });
	};

	setPreview(product: IProduct) {
		this.preview = product.id;
		this.onChange('preview:changed', product);
	};

	changeBasket() {
		this.onChange('counter:changed', this.basket);
		this.onChange('basket:changed', this.basket);
	};

	setAddress(field: keyof IOrderForm, value: string) {
		this.order[field] = value;
		if (this.order.payment && !!this.order.address) {
			this.events.emit('address:exist', this.order);
		};
	};

	setContact(field: keyof IOrderForm, value: string) {
		this.order[field] = value;
		if (this.order.email && this.order.phone) {
			this.events.emit('contact:exist', this.order);
		};
	};
};
