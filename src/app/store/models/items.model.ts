import { ProductI } from 'src/app/core/services/products/products.service';

export interface ItemsModel {
  itemsList: Array<ProductI>;
  selectedItem: ProductI | undefined;
}
