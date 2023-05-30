import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DialogHeaderComponent } from 'src/app/core/components/dialog-header/dialog-header.component';
import { CurrentStoreInfoService } from 'src/app/core/services/currentStore/current-store-info.service';
import {
  CategoryI,
  CreateCategoryRequestI,
  ProductsService,
} from 'src/app/core/services/products/products.service';
import { toastAlert } from 'src/app/core/utils/toastAlert';
import { AppState } from 'src/app/store/models/state.model';
import {
  StoreInfoModel,
  UserStoreInfoModel,
} from 'src/app/store/models/userStoreInfo.models';

@Component({
  selector: 'app-category-creation-modal',
  templateUrl: './category-creation-modal.component.html',
  styleUrls: ['./category-creation-modal.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    DialogHeaderComponent,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
  ],
})
export class CategoryCreationModalComponent implements OnInit {
  userStoreInfoState$: Observable<UserStoreInfoModel> | undefined;
  userStoreInfoState: UserStoreInfoModel | undefined;
  currentStoreInfo: StoreInfoModel | undefined;
  categoryForm: FormGroup;

  constructor(
    private modalController: ModalController,
    private productsService: ProductsService,
    private store: Store<AppState>,
    private currentStoreInfoService: CurrentStoreInfoService,
    private formBuilder: FormBuilder,
    private toastController: ToastController
  ) {
    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
    });
  }

  ngOnInit() {
    this.userStoreInfoState$ = this.store.select(
      (store) => store.userStoreInfo
    );
    this.userStoreInfoState$?.subscribe(
      (userStoreInfo) => (this.userStoreInfoState = userStoreInfo)
    );
    this.currentStoreInfoService.getCurrentStoreInfo().subscribe((reponse) => {
      this.currentStoreInfo = reponse;
    });
  }

  onCloseCategoryCreationModal = (data?: { created: CategoryI }) => {
    this.modalController.dismiss(data);
  };
  onCreateCategory() {
    if (!this.currentStoreInfo?._id) {
      return;
    }
    const categoryRequest: CreateCategoryRequestI = {
      storeId: this.currentStoreInfo?._id,
      ...this.categoryForm.value,
    };
    this.productsService.createStoreCategory(categoryRequest).subscribe(
      (response) => {
        console.log(response);
        //@ts-ignore
        if (response.message === 'Success') {
          toastAlert(this.toastController, 'Category created successfully');
          //@ts-ignore
          this.onCloseCategoryCreationModal({ created: response.body });
        }
      },
      (error) => {
        console.log(error);
        toastAlert(this.toastController, error.error.message);
      }
    );
  }
}
