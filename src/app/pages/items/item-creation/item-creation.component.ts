import { Component, OnInit } from '@angular/core';
import {
  CheckboxCustomEvent,
  IonicModule,
  ModalController,
  PopoverController,
} from '@ionic/angular';
import { CategorySelectionModalComponent } from '../category-selection-modal/category-selection-modal.component';
import { CategoryI } from 'src/app/core/services/products/products.service';
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
  ],
})
export class ItemCreationComponent implements OnInit {
  canDismiss = false;

  presentingElement: Element | null = null;
  selectedCategoryIds: string[] = [];
  selectedCategories: CategoryI[] = [];
  selectedCategoriesString: string = '';
  productForm: FormGroup;
  sameUnits: boolean = true;
  isMobile: boolean = false;
  gstPercentage!: string;
  taxPopover: any;
  public screenState$: Observable<ScreenModel> | undefined;

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    public popoverController: PopoverController,
    private store: Store<AppState>
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
    });
  }
  ngOnInit() {
    this.presentingElement = document.querySelector('.ion-page');
    console.log('inits');
    this.screenState$ = this.store.select((store) => store.screen);
    this.screenState$.subscribe((screen) => (this.isMobile = screen.isMobile));
  }

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

    modal.onDidDismiss().then((modalData) => {});
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
