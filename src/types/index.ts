export type PaymentType = 'cash' | 'card'


export interface OrderInfo {
    id: string;
    total: number;
}

export type BasketProduct = Pick<ProductItem, 'id' | 'title' | 'price'> & {
    index?: number;
}

export type ApiResponse<Type> = {
    totalCount: number,
    items: Type[]
};


export const category: Record<string, string> =  {
    "другое": "_other",
    "дополнительное": "_additional",
    "софт-скил": "_soft",
    "хард-скил": "_hard",
    "кнопка": "_button",
}
 
export interface Bucket {
   items:BasketProduct[];
   order: Purchase;
   total: number;
}

export interface ProductItem {
    id: string;
    description?: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
    Button: boolean;
}

export interface OrderFormData {
    email: string;
    phone: string;
    address: string;
    payment: PaymentType;
    total: number;
}

export interface Purchase extends OrderFormData { 
    items: string[];
}

export type FormErrors = Partial<Record<keyof Purchase, string>>;


export interface AppData {
    catalog: ProductItem[];
    basket: BasketProduct[];
    preview: string | null;
    order: Purchase | null;
}