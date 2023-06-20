import { Component, Input, OnInit } from '@angular/core';
import {
  CheckboxCustomEvent,
  IonicModule,
  ModalController,
  PopoverController,
  ToastController,
} from '@ionic/angular';
import { CategorySelectionModalComponent } from '../category-selection-modal/category-selection-modal.component';
import {
  CategoryI,
  CreateProductRequestI,
  DiscountI,
  ItemTypeEnum,
  ProductI,
  ProductsService,
  UpdateProductRequestI,
  VariantI,
} from 'src/app/core/services/products/products.service';
import { DiscountsModalComponent } from '../discounts-modal/discounts-modal.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaxPopoverComponent } from '../tax-popover/tax-popover.component';
import { ScreenModel } from 'src/app/store/models/screen.models';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/store/models/state.model';
import { Store } from '@ngrx/store';
import { DialogHeaderComponent } from 'src/app/core/components/dialog-header/dialog-header.component';
import { VariantCreationModalComponent } from '../variant-creation-modal/variant-creation-modal.component';
import { VariantSeperatorPipe } from 'src/app/core/pipes/variant-seperator.pipe';
import { CurrentStoreInfoService } from 'src/app/core/services/currentStore/current-store-info.service';
import { StoreInfoModel } from 'src/app/store/models/userStoreInfo.models';
import { toastAlert } from 'src/app/core/utils/toastAlert';
import { DiscountsListComponent } from '../discounts-list/discounts-list.component';
import { VariantsListComponent } from '../variants-list/variants-list.component';
import { MediaService } from 'src/app/core/services/media/media.service';
import { HsnCodeModalComponent } from '../hsn-code-modal/hsn-code-modal.component';

@Component({
  selector: 'app-item-creation',
  templateUrl: './item-creation.component.html',
  styleUrls: ['./item-creation.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CategorySelectionModalComponent,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    DiscountsModalComponent,
    DialogHeaderComponent,
    VariantSeperatorPipe,
    DiscountsListComponent,
    VariantsListComponent,
  ],
})
export class ItemCreationComponent implements OnInit {
  @Input() editProduct: ProductI | undefined;
  @Input() type!: ItemTypeEnum;
  ItemTypeEnum = ItemTypeEnum;
  canDismiss = false;
  presentingElement: Element | null = null;
  selectedCategoryIds: string[] = [];
  selectedCategories: CategoryI[] = [];
  selectedCategoriesString: string = '';
  productForm: FormGroup;
  sameUnits: boolean = true;
  isMobile: boolean = false;
  gstPercentage!: string;
  currentStoreInfo: StoreInfoModel | undefined;
  taxPopover: any;
  public screenState$: Observable<ScreenModel> | undefined;
  variants: VariantI[] = [];
  discounts: DiscountI[] = [];
  UploadStatusEnum = UploadStatusEnum;
  productImages: ProductImageFileI[] = [];
  heroImage: ProductImageFileI | string | undefined;
  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    public popoverController: PopoverController,
    private store: Store<AppState>,
    private currentStoreInfoService: CurrentStoreInfoService,
    private productsService: ProductsService,
    private toastController: ToastController,
    private mediaService: MediaService
  ) {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      category: ['', Validators.required],
      unit: ['', Validators.required],
      sellsPrice: ['', Validators.required],
      purchasePrice: [''],
      taxIncluded: [true, Validators.required],
      hsnCode: [''],
      lowStock: [''],
      gstPercentage: [''],
    });
  }
  ngOnInit() {
    if (this.type === ItemTypeEnum.PRODUCT) {
      this.productForm.addControl(
        'quantity',
        this.formBuilder.control('', Validators.required)
      );
    }
    this.currentStoreInfoService.getCurrentStoreInfo().subscribe((response) => {
      this.currentStoreInfo = response;
    });
    this.presentingElement = document.querySelector('.ion-page');
    console.log(
      'inits',
      this.editProduct,
      this.editProduct?.category.map((cat) => cat.name).join(',')
    );
    this.screenState$ = this.store.select((store) => store.screen);
    this.screenState$.subscribe((screen) => (this.isMobile = screen.isMobile));
    const categoriesStr = this.editProduct?.category
      .map((cat) => cat.name)
      .join(',');
    const categoriesIdStr = this.editProduct?.category
      .map((cat) => cat._id)
      .join(',');
    this.productForm.patchValue({
      ...this.editProduct,
      unit: this.editProduct?.unit.name,
      category: categoriesIdStr,
    });
    if (this.editProduct?.category) {
      this.selectedCategories = this.editProduct?.category;
    }
    if (categoriesStr) {
      this.selectedCategoriesString = categoriesStr;
    }
    if (this.editProduct?.variants) {
      this.variants = this.editProduct?.variants;
    }
    if (this.editProduct?.discounts) {
      this.discounts = this.editProduct?.discounts;
    }
  }
  removeImage(image: ProductImageFileI) {
    if (this.heroImage === image) {
      this.heroImage = undefined;
    }
    const deleteIndex = this.productImages.findIndex(
      (pImages) => pImages.file.name === image.file.name
    );
    if (deleteIndex !== -1) {
      this.productImages.splice(deleteIndex, 1);
    }
  }

  selectHeroImage(image: ProductImageFileI | string) {
    if (this.heroImage === image) {
      this.heroImage = undefined;
      return;
    }
    this.heroImage = image;
  }

  formatDiscountValue(discount: any) {
    if (discount.type === 'amount') {
      // Prefix with '$'
      discount.value = '$' + discount.value;
    } else if (discount.type === 'percentage') {
      // Suffix with '%' and limit to 100
      const parsedValue = parseFloat(discount.value);
      if (!isNaN(parsedValue)) {
        discount.value = Math.min(parsedValue, 100) + '%';
      }
    }
  }

  onCloseProductCreationModal = () => {
    this.modalController.dismiss();
  };

  onSameUnitsToggled(event: any) {
    this.sameUnits = event.detail.checked;
    if (!this.sameUnits) {
      this.productForm.addControl(
        'purchaseUnitName',
        this.formBuilder.control('', Validators.required)
      );
      this.productForm.addControl(
        'purchaseUnitConversion',
        this.formBuilder.control('', Validators.required)
      );
    } else {
      this.productForm.removeControl('purchaseUnitName');
      this.productForm.removeControl('purchaseUnitConversion');
    }
    console.log(event.detail);
  }

  uploadProductImages(images: File[]) {
    if (!this.currentStoreInfo?._id) {
      return;
    }
    this.mediaService
      .uploadProductImages(images, this.currentStoreInfo?._id, false)
      .subscribe({
        next: (response) => {
          //@ts-ignore
          response.body.map((urlResponse) => {
            const image = this.productImages.find((image) => {
              console.log(
                image.file.name,
                urlResponse.fileName,
                image.file.name === urlResponse.fileName
              );
              return image.file.name === urlResponse.fileName;
            });
            console.log('image', image);
            if (!image) {
              return;
            }
            if (urlResponse.url[0]) {
              image.imageUrl = urlResponse.url[0];
              image.uploadStatus = UploadStatusEnum.SUCCESSFUL;
              return;
            } else {
              image.uploadStatus = UploadStatusEnum.FAILED;
            }
          });
          if (!this.editProduct?.heroImage) {
            this.heroImage = this.productImages.find(
              (img) => img.uploadStatus === UploadStatusEnum.SUCCESSFUL
            );
          }
          console.log('UPLOAD', this.productImages);
        },
        error: (err) => {},
        complete: () => {},
      });
  }

  handleFileInput(event: any) {
    const files: FileList = event.target.files;
    console.log(files);
    const imagesArray: File[] = [];
    if (files.length > 5) {
      toastAlert(this.toastController, 'Please select only up to 5 files');
      console.log('Please select up to 5 files');
      return;
    }
    for (let i = 0; i < files.length; i++) {
      const file: File | null = files.item(i);
      if (!file) {
        continue;
      }
      if (file.size <= 5 * 1024 * 1024) {
        imagesArray.push(file);
        let imgUrl = URL.createObjectURL(file);
        this.productImages.push({
          file: file,
          imageUrl: imgUrl,
          id: i.toString(),
          uploadStatus: UploadStatusEnum.UPLOADING,
        });
        console.log(this.productImages);
        console.log(file);
      } else {
        toastAlert(this.toastController, 'File size exceeds the limit of 5 MB');
        return;
      }
    }
    this.uploadProductImages(imagesArray);
  }

  async showTaxPopover(event: any) {
    console.log('s', this.isMobile);
    const taxPopoverOptions = {
      component: TaxPopoverComponent,
      componentProps: {
        selectedValue: this.gstPercentage,
      },
      translucent: true,
      event: event,
      breakpoints: this.isMobile ? [0, 0.8, 1] : undefined,
      initialBreakpoint: this.isMobile ? 0.8 : 1,
      cssClass: 'login-modal', // Add a CSS class for custom styling if needed
    };

    this.taxPopover = await this.modalController.create(taxPopoverOptions);
    await this.taxPopover.present();

    const { data } = await this.taxPopover.onDidDismiss();
    if (data && data.selectedValue) {
      this.gstPercentage = data.selectedValue;
      this.productForm.patchValue({ gstPercentage: this.gstPercentage });
    }
  }

  hideTaxPopover() {
    if (this.taxPopover) {
      this.taxPopover.dismiss();
    }
  }
  onTermsChanged(event: Event) {
    const ev = event as CheckboxCustomEvent;
    this.canDismiss = ev.detail.checked;
  }

  generateVariantCombinations(
    variantOptions: VariantOption[],
    currentCombination: VariantCombination[] = [],
    index: number = 0
  ): VariantCombination[][] {
    if (index === variantOptions.length) {
      // Base case: reached the end of variantOptions array, return the current combination
      return [currentCombination];
    }

    const variantOption = variantOptions[index];
    const combinations = [];
    const options = variantOption.options.split(',');
    // Generate combinations by combining each option with the remaining options
    for (const option of options) {
      const newCombination = [
        ...currentCombination,
        { name: variantOption.name, value: option },
      ];
      const remainingCombinations = this.generateVariantCombinations(
        variantOptions,
        newCombination,
        index + 1
      );
      combinations.push(...remainingCombinations);
    }

    return combinations;
  }

  async openHSNCodeModal(event: any) {
    const modal = await this.modalController.create({
      component: HsnCodeModalComponent,
      backdropDismiss: true,
      cssClass: 'login-modal',
      breakpoints: this.isMobile ? [0, 0.8, 1] : undefined,
      initialBreakpoint: this.isMobile ? 0.8 : 1,
    });

    return await modal.present();
  }

  async openVariantCreationModal() {
    const modal = await this.modalController.create({
      component: VariantCreationModalComponent,
      backdropDismiss: true,
      cssClass: 'login-modal',
      breakpoints: this.isMobile ? [0, 0.8, 1] : undefined,
      initialBreakpoint: this.isMobile ? 0.8 : 1,
    });
    console.log(modal);

    modal.onDidDismiss().then((modalData) => {
      if (modalData && modalData?.data?.variantOptions) {
        const variantCombinations = this.generateVariantCombinations(
          modalData?.data?.variantOptions
        );
        console.log(variantCombinations);
        variantCombinations.map((combination) => {
          const newVariant: VariantI = {
            properties: {},
            stockQuantity: 0,
          };
          combination.map(
            (option) =>
              (newVariant.properties = {
                ...newVariant.properties,
                [option.name]: option.value,
              })
          );
          this.variants.push(newVariant);
        });
      }
    });
    return await modal.present();
  }

  async createOrUpdateProduct() {
    console.log(this.productForm.value);
    if (!this.currentStoreInfo || !this.currentStoreInfo._id) {
      return;
    }
    const productFormValue = this.productForm.value as ProductFormValueI;
    console.log(productFormValue?.category);
    const category = productFormValue?.category
      ? typeof productFormValue?.category === 'string'
        ? productFormValue?.category?.split(',')
        : productFormValue?.category
      : [];
    const match =
      typeof productFormValue.gstPercentage === 'string'
        ? productFormValue.gstPercentage.match(/(\d+(\.\d+)?)/g)
        : undefined;
    const gstPercent = match ? parseFloat(match[0]) : undefined;
    if (this.editProduct?._id) {
      const updateProductPayload: UpdateProductRequestI = {
        productId: this.editProduct?._id,
        ...productFormValue,
        category,
        variants: this.variants,
        discounts: this.discounts,
        gstPercentage: gstPercent,
        images: this.productImages
          .filter((image) => image.uploadStatus === UploadStatusEnum.SUCCESSFUL)
          .map((img) => img.imageUrl),
        heroImage:
          typeof this.heroImage === 'string'
            ? this.heroImage
            : this.heroImage?.imageUrl,
      };
      this.updateProduct(updateProductPayload);
    } else {
      const createProductPayload: CreateProductRequestI = {
        storeId: this.currentStoreInfo._id,
        ...productFormValue,
        category,
        variants: this.variants,
        discounts: this.discounts,
        gstPercentage: gstPercent,
        images: this.productImages
          .filter((image) => image.uploadStatus === UploadStatusEnum.SUCCESSFUL)
          .map((img) => img.imageUrl),
        heroImage:
          typeof this.heroImage === 'string'
            ? this.heroImage
            : this.heroImage?.imageUrl,
            isService: this.type === ItemTypeEnum.SERVICE
      };
      this.createProduct(createProductPayload);
    }
  }

  async createProduct(createProductPayload: CreateProductRequestI) {
    this.productsService.createStoreProduct(createProductPayload).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        toastAlert(this.toastController, error.error.message);
      }
    );
  }

  async updateProduct(updateProductPayload: UpdateProductRequestI) {
    this.productsService.updateStoreProduct(updateProductPayload).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        toastAlert(this.toastController, error.error.message);
      }
    );
  }
  async openDiscountsModal() {
    console.log('idhar');
    const modal = await this.modalController.create({
      component: DiscountsModalComponent,
      backdropDismiss: true,
      cssClass: 'login-modal',
      breakpoints: this.isMobile ? [0, 0.8, 1] : undefined,
      initialBreakpoint: this.isMobile ? 0.8 : 1,
    });
    console.log(modal);

    modal.onDidDismiss().then((modalData) => {
      if (modalData?.data?.discount) {
        this.discounts = [...this.discounts, modalData.data.discount];
      }
    });
    return await modal.present();
  }

  async openCreateCategoryModal() {
    this.selectedCategoriesString = '';
    const modal = await this.modalController.create({
      component: CategorySelectionModalComponent,
      componentProps: { selectedCategories: this.selectedCategories },
      backdropDismiss: true,
      cssClass: 'login-modal',
    });
    modal.onDidDismiss().then((modelData) => {
      if (modelData !== null) {
        // this.modelData = modelData.data;
        console.log('Modal Data : ' + JSON.stringify(modelData.data));
        if (modelData?.data?.selected?.length > 0) {
          this.selectedCategories = modelData?.data?.selected;
        }
      }
      this.selectedCategories.map((category: CategoryI) => {
        this.selectedCategoryIds.push(category._id);
        this.productForm.patchValue({
          category: this.selectedCategoryIds.join(','),
        });
      });
      this.selectedCategoriesString = this.selectedCategories
        .map((selectedCategory) => selectedCategory.name)
        .join(',');
    });
    return await modal.present();
  }
}

interface VariantOption {
  name: string;
  options: string;
}

interface VariantCombination {
  name: string;
  value: string;
}

interface ProductFormValueI {
  name: string;
  description: string;
  category: string;
  unit: string;
  sellsPrice: number;
  purchasePrice: number;
  taxIncluded: boolean;
  hsnCode: string;
  quantity: number;
  lowStock: number;
  gstPercentage: string;
}

export enum UploadStatusEnum {
  SUCCESSFUL = 'SUCCESSFUL',
  FAILED = 'FAILED',
  UPLOADING = 'UPLOADING',
}

export interface ProductImageFileI {
  file: File;
  imageUrl: string;
  id: string;
  uploadStatus: UploadStatusEnum;
}
