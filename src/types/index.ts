/* eslint-disable @typescript-eslint/ban-types */
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export type EventName = string | RegExp;
export type Subscriber = Function;
export type EmitterEvent = {
	eventName: string;
	data: unknown;
};

export interface IEvents {
	on<T extends object>(event: EventName, callback: (data: T) => void): void;
	emit<T extends object>(event: string, data?: T): void;
	trigger<T extends object>(
		event: string,
		context?: Partial<T>
	): (data: T) => void;
}

export interface IProduct {
	// интерфейс для товара
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
	titleButton?: string;
	index?: string;
}

export interface IProductList {
	// интерфейс для списка товаров
	products: IProduct[];
	total: number;
}

export type TPayment = 'online' | 'cash'; // тип оплаты

export interface IOrderForm {
	// интерфейс для формы заказа
	payment: string;
	address: string;
	email: string;
	phone: string;
}

export interface IOrder extends IOrderForm {
	// интерфейс для заказа
	total: number | null;
	items: string[];
}

export interface IOrderData {
	// интерфейс для оформленного заказа
	id: string;
	total: number;
}

export interface IBasket {
	// интерфейс для корзины
	products: IProduct[];
	total: number | null;
}

export interface IWebLarekAPI {
	// интерфейс API клиента
	getProducts(): Promise<IProduct[]>;
	getProductById(id: string): Promise<IProduct>;
	postOrder(order: IOrder): Promise<IOrderData>;
}

export interface IBasketModel {
	// интерфейс модели данных корзины
	products: IProduct[];
	addToBasket(id: string): void;
	removeFromBasket(id: string): void;
	clearBasket(): void;
	getTotalPrice(): number;
}

export interface IOrderModel extends Partial<IOrder> {
	// интерфейс модели заказа
	addAddress(address: string): void;
	addPhone(phone: string): void;
	addEmail(email: string): void;
	addPayment(payment: TPayment): void;
}

export interface ICard extends IProduct {
	// интерфейс для карточки товара
	cardTemplate: HTMLTemplateElement;
	getProduct(): void;
}

export interface IModalData {
	// интерфейс для содержимого модального окна
	content: HTMLElement;
}

export interface ISuccessModal {
	// интерфейс для модального окна успешно созданного заказа
	totalPrice: number;
}

export interface IAppState {
	// интерфейс глобального состояния приложения
	basket: IProduct[];
	order: IOrder | null;
	catalog: IProduct[];
	preview: string | null;
}

export interface IPage {
	// интерфейс для главной страницы приложения
	catalog: HTMLElement[];
	basket: HTMLElement;
	counter: HTMLElement;
	locked: boolean;
}

export interface IForm {
	// интерфейс для структуры данных формы
	isValid: boolean;
	errors: string[];
}

export interface ISuccessActions {
	onClick(): void;
}
