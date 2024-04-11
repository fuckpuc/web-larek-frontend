import './scss/styles.scss';
import { CardAPI } from './components/larekApi';
import { CDN_URL, API_URL } from './utils/constants';
import { AppState } from './components/AppData';
import { EventEmitter } from './components/base/events';
import { CatalogChangeEvent } from './components/AppData';
import { Modal } from './components/common/modal';
import { Page } from './components/page';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { CatalogItem } from './components/card';
import { Basket } from './components/common/Basket';
import { LotItem } from './components/AppData';
import { Order } from './components/ordering/order';
import { IOrderForm } from './types';
import { ContactsForm } from './components/ordering/contacts';
import { Success } from './components/ordering/success';
//

const events = new EventEmitter();
const api = new CardAPI(CDN_URL, API_URL);

// Модель данных приложения
const appData = new AppState({}, events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
//
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new ContactsForm(cloneTemplate(contactsTemplate), events);

// Получаем лоты с сервера
api
	.getLotList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(` ошибка ${err}`);
	});

// Изменились элементы каталога
events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new CatalogItem(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price,
			description: item.description,
		});
	});
});

// Открыть лот
events.on('card:select', (item: LotItem) => {
	appData.setPreview(item);

	const showItem = (item: LotItem) => {
		const card = new CatalogItem(cloneTemplate(cardPreviewTemplate), {
			onClick: () => {
				if (!appData.itemExists(item)) {
					events.emit('item.add', item);
					modal.close();
				} else {
					events.emit('item.remove', item);
					modal.close();
				}
			},
		});

		const isInBasket = appData.itemExists(item);
		// Обновляем текст кнопки в зависимости от этого
		card.setButtonText(isInBasket ? 'Удалить из корзины' : 'В корзину');

		modal.render({
			content: card.render({
				title: item.title,
				image: item.image,
				category: item.category,
				price: item.price,
				description: item.description,
			}),
		});
	};

	if (item) {
		api
			.getLotItem(item.id)
			.then(() => {
				showItem(item);
			})
			.catch((err) => {
				console.error(err);
			});
	} else {
		modal.close();
	}
});

events.on('item.add', (item: LotItem) => {
	appData.addItemToBasket(item);
});

events.on('item.remove', (item: LotItem) => {
	appData.removeItemFromBasket(item);
});

events.on('basketInfo:changed', () => {
	page.counter = appData.count();
	basket.total = appData.getTotal();
	basket.items = appData.basket.map((item, index) => {
		const card = new CatalogItem(cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('item.remove', item),
		});
		return card.render({
			title: item.title,
			price: item.price,
			index: index,
		});
	});
});

events.on('bucket:open', () => {
	modal.render({
		content: createElement<HTMLElement>('div', {}, [basket.render()]),
	});
});

events.on('order:open', () => {
	appData.clearFormData();
	modal.render({
		content: order.render({
			// payment: '',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

//кнопка далле в форме "оплаты и адресса"
events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('contacts:submit', () => {
	appData.order.total = appData.getTotal();
	appData.confirmBasketItem();
	api
		.orderLots(appData.order)
		.then(() => {
			const success = new Success(
				cloneTemplate(successTemplate),
				appData.getTotal(),
				{
					onClick: () => {
						modal.close();
						appData.clearBasket();
						appData.clearFormData();
						page.counter = appData.basket.length;
					},
				}
			);

			modal.render({
				content: success.render({}),
			});
		})
		.then(() => {
			appData.clearFormData();
			appData.clearBasket();
		})
		.catch((err) => {
			console.error(err);
		});
});

// events.on(/^order\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
//     appData.setOrderField(data.field, data.value);
// });

events.on(
	'order.address:change',
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setContactField(data.field, data.value);
	}
);

events.on('paymentMethod:changed', () => {
	appData.order.payment = order.paymentMethod;
	appData.paymentField();
});

// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
	const { address, payment, email, phone } = errors;
	order.valid = !address && !payment;
	order.errors = Object.values({ address, payment }).filter(Boolean).join('; ');
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ phone, email }).filter(Boolean).join('; ');
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.locked = false;
});
