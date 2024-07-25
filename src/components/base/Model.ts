import { IEvents } from '../../types';

export abstract class Model<T> {
	constructor(data: Partial<T>, protected events: IEvents) {
		Object.assign(this, data);
	};

	onChange(event: string, payload?: object) {
		this.events.emit(event, payload ?? {});
	};
};
