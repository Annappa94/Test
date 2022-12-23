

export interface Invoice {
    status: boolean,
    data:Data[],
    apiTrackerID: String,
    message: String
}

export interface Data{
    customer: Customer,
    chainID: number,
    store_id: number,
    billing_user: String,
    details:Details
}
export interface Customer{
    address:any,
    email: String,
    name: String,
    phone: number
}

export interface  Details{
    order_id: String,
    invoice_number: 1,
    instructions: String,
    item_level_total_charges: number,
    item_level_total_taxes: number,
    order_level_total_charges: number,
    order_level_total_taxes: number,
    order_subtotal: number,
    order_total: number,
    payable_amount: number,
    total_charges: number,
    total_taxes: number,
    taxes: number,
    order_time: String
    order_date: String,
    items:Items[]
    payment:Payment[]
}

export interface Items{
    charges:Charges[],
    discount_total: number,
    product_id: number,
    price: number,
    quantity: number,
    discounts:Discounts[],
    taxes: Taxes[],
    title: String,
    total: number,
    total_with_tax: number,
    unit: String,
    brand: String,
    category: String,
    sub_category: String,
    barcode: String,
    sku: String,
    hsn_code: number
}
export interface Taxes{ 
    rate: number,
    title: String
}
export interface Charges{
    rate: number,
    title: String,
    id: number
}

export interface  Discounts{
    discount_title: String,
    discount_remarks: String,
    discount_value: number
}

export interface  Payment{
    payment_subid: number,
    payment_type: String,
    amount: number
}