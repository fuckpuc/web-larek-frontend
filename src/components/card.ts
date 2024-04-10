import {Component} from "./base/Component";
// import {ILot, LotStatus} from "../types";
import { ensureElement} from "../utils/utils";
import { IBasketItem } from "../types";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICard<T> {
    title: string;
    description?: string | string[];
    image: string;
    category: string;
    price: number | null;
    index?: number;
}

export class Card<T> extends Component<ICard<T>> {
    protected _title: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _description?: HTMLElement;
    protected _button?: HTMLButtonElement;
    protected _category: HTMLElement;
	protected _price: HTMLElement;
    protected _index: HTMLElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._image = container.querySelector(`.${blockName}__image`);
        this._category = container.querySelector(`.${blockName}__category`);
		this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
        this._button = container.querySelector(`.${blockName}__button`);
        this._description = container.querySelector(`.${blockName}__description`);
        this._index = container.querySelector('.basket__item-index');

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    get title(): string {
        return this._title.textContent || '';
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }

    set updatedValue(value: number) {
        this.setText(this._index, value + 1);
    }

    set description(value: string | string[]) {
        if (Array.isArray(value)) {
            this._description.replaceWith(...value.map(str => {
                const descTemplate = this._description.cloneNode() as HTMLElement;
                this.setText(descTemplate, str);
                return descTemplate;
            }));
        } else {
            this.setText(this._description, value);
        }
    }
}



// interface ICatalogItemActions extends ICardActions {
//     onSelect: () => void;
// }

export class CatalogItem extends Card<ICatalogItemData> {
    protected _category: HTMLElement;
    protected _price: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super('card', container, actions);
        this._category = container.querySelector('.card__category');
        this._price = ensureElement<HTMLElement>('.card__price', container);
    }

    set category(value: string) {
        this.setText(this._category, value);
        const categoryValue = categoryOfItems[value]
        this._category.classList.add(categoryValue);
    }
    

    get category(): string {
        return this._category.textContent || '';
    }

    set price(value: string) {
        this.setText(this._price, `${value} синапсов`);
        if(value === null) {
            this.setText(this._price, `Бесценно`);
        }
    }

    get price(): string {
        return this._price.textContent || '';
    }

}

const categoryOfItems: Record<string, string> = {
    'кнопка': 'card__category_button',
    'дополнительное': 'card__category_additional',
    'другое': 'card__category_other',
    'хард-скил': 'card__category_hard',
    'софт-скил': 'card__category_soft'
}

interface ICatalogItemData {
    title: string;
    description?: string | string[];
    image: string;
    category: string;
    price: number | null;
}