import { View } from '../base/view';
import { ensureElement } from '../../utils/utils';

interface success {
	total: number;
}

interface SuccessAction {
	onClick: () => void;
}

export class Success extends View<success> {
	protected _close: HTMLElement;
	protected _total: HTMLElement;

	constructor(value: number, container: HTMLElement, actions: SuccessAction) {
		const { onClick } = actions || {};
		super(container);
		this._total = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);
		this._close = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		);

		if (onClick) {
			this._close.addEventListener('click', onClick);
			this._total.textContent = `Списано ${value} синапсов`;
		}
	}
}
