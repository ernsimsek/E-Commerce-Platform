import { List_Product_Image } from "./list_product_image";

export class List_Product {
  id: string = '';
  name: string = '';
  stock: number = 0;
  price: number = 0;
  createdDate: Date = new Date();
  updatedDate: Date = new Date();
  productImageFiles?: List_Product_Image[];
  imagePath?: string;
  description: string = '';
  brand: string = '';
  type: string = '';
}

