import { ProductItem, Purchase, OrderInfo  } from '../types/index';
import { ApiResponse  }  from '../types/index';
import {  Api }  from './base/api';

export interface LarekApi {
    getLotList: () => Promise<ProductItem[]>;
    getLotItem: (id: string) => Promise<ProductItem>;
    orderLots: (order: Purchase) => Promise<OrderInfo>;
}

export class WebLarekAPI extends Api implements LarekApi {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getLotItem(id: string): Promise<ProductItem> {
        return this.get(`/product/${id}`).then(
            (item: ProductItem) => ({
                ...item,
                image: this.cdn + item.image,
            })
        );
    }

    getLotList(): Promise<ProductItem[]> {
        return this.get('/product').then((data: ApiResponse<ProductItem>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

    orderLots(order: Purchase): Promise<OrderInfo> {
        return this.post('/order', order).then(
            (data: OrderInfo) => data
        );
    }
}