import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { OnboardingService } from '../../services/onboarding/onboarding.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/models/state.model';
import {
  StoreInfoModel,
  UserStoreInfoModel,
} from 'src/app/store/models/userStoreInfo.models';
import { Observable } from 'rxjs';
import { CurrentStoreInfoService } from '../../services/currentStore/current-store-info.service';
import { CameraService } from '../../services/camera/camera.service';
import { ScreenModel } from 'src/app/store/models/screen.models';
import * as Tesseract from 'tesseract.js';
import { createWorker } from 'tesseract.js';
export interface VerifyGSTINResponseI {
  ntcrbs: string;
  adhrVFlag: string;
  lgnm: string;
  stj: string;
  dty: string;
  cxdt: string;
  gstin: string;
  nba: string[];
  ekycVFlag: string;
  cmpRt: string;
  rgdt: string;
  ctb: string;
  pradr: {
    adr: string;
    addr: {
      flno: string;
      lg: string;
      loc: string;
      pncd: string;
      bnm: string;
      city: string;
      lt: string;
      stcd: string;
      bno: string;
      dst: string;
      st: string;
    };
  };
  sts: string;
  tradeNam: string;
  isFieldVisitConducted: string;
  ctj: string;
  einvoiceStatus: string;
  lstupdt: string;
  adadr: any[];
  ctjCd: string;
  errorMsg: null | string;
  stjCd: string;
}
@Component({
  selector: 'app-onboarding-modal',
  templateUrl: './onboarding-modal.component.html',
  styleUrls: ['./onboarding-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule, FormsModule, CommonModule],
})
export class OnboardingModalComponent implements OnInit {
  @Input() isModalOpen: boolean | undefined;

  isGstEnabled: boolean = true;
  userStoreInfoState$: Observable<UserStoreInfoModel> | undefined;
  userStoreInfoState: UserStoreInfoModel | undefined;
  currentStoreInfo: StoreInfoModel | undefined;
  verifyGstinResponse: VerifyGSTINResponseI | undefined;
  public screenState$: Observable<ScreenModel> | undefined;
  worker: Tesseract.Worker | undefined;
  workerReady: boolean = false;
  gstinForm: FormGroup;
  image: string | undefined;
  ocrResult: string = '';
  captureProgress = 0;
  nonGSTForm: FormGroup;

  ngOnInit() {
    this.userStoreInfoState$ = this.store.select(
      (store) => store.userStoreInfo
    );
    this.userStoreInfoState$?.subscribe(
      (userStoreInfo) => (this.userStoreInfoState = userStoreInfo)
    );
    this.currentStoreInfoService.getCurrentStoreInfo().subscribe((reponse) => {
      console.log(reponse);
      this.currentStoreInfo = reponse;
    });
    this.screenState$ = this.store.select((store) => store.screen);
  }

  // setOpen(isOpen: boolean) {
  //   this.isModalOpen = isOpen;
  // }

  constructor(
    private formBuilder: FormBuilder,
    private onboardingService: OnboardingService,
    private store: Store<AppState>,
    private modalController: ModalController,
    private currentStoreInfoService: CurrentStoreInfoService,
    private cameraService: CameraService,
    private toastController: ToastController
  ) {
    this.loadWorker();
    this.gstinForm = this.formBuilder.group({
      gstNumber: ['', Validators.required],
    });
    this.nonGSTForm = this.formBuilder.group({
      name: ['', Validators.required],
    });
  }

  async closeModel() {
    const close: string = 'Modal Removed';
    await this.modalController.dismiss(close);
  }

  async loadWorker() {
    //@ts-ignore
    this.worker = await createWorker({
      logger: (progress) => {
        console.log(progress);
        if ((progress.status = 'recognizing text')) {
          this.captureProgress = parseInt('' + progress.progress * 100);
        }
      },
    });

    await this.worker.load();
    await this.worker.loadLanguage('eng');
    await this.worker.initialize('eng');
    this.workerReady = true;
  }

  extractGSTNumber(text: string) {
    const regex = /\b[A-Za-z0-9]{15}\b/g;
    const matches = text.match(regex);

    if (matches && matches.length > 0) {
      return matches[0];
    } else {
      this.alert('Could not recognize GST number correctly', 'top', 1500)
      return '';
    }
  }

  async recognizeImage(
    image:
      | string
      | HTMLImageElement
      | HTMLCanvasElement
      | HTMLVideoElement
      | CanvasRenderingContext2D
      | Blob
      | ImageData
      | Buffer
      | undefined
  ) {
    if (!this.worker || !image) {
      return;
    }
    const result = await this.worker?.recognize(image);
    this.ocrResult = result.data.text;
    this.gstinForm.setValue({gstNumber:this.extractGSTNumber(this.ocrResult)})
    console.log(this.ocrResult)
  }

  async alert(
    message: string,
    position: 'top' | 'middle' | 'bottom',
    duration: number
  ) {
    const toast = await this.toastController.create({
      message,
      duration,
      position,
    });
    await toast.present();
  }

  onGSTEnabledChanged(event: any) {
    const selectedValue = event.detail.value;
    this.isGstEnabled = selectedValue;
  }

  async getPhoto() {
    const photo = await this.cameraService.getPhoto();
    this.recognizeImage(photo.dataUrl);
    console.log(photo);
  }

  onboardGSTStore() {
    if (
      !this.currentStoreInfo ||
      !this.currentStoreInfo._id ||
      !this.verifyGstinResponse
    ) {
      return;
    }
    this.onboardingService
      .onboardGSTStore(this.currentStoreInfo._id, this.verifyGstinResponse)
      .subscribe((response) => {
        //@ts-ignore
        if(response.body.modifiedCount > 0){
          this.closeModel()
        }
      });
  }

  submitForm() {
    if (this.gstinForm.valid) {
      if (!this.currentStoreInfo || !this.currentStoreInfo._id) {
        return;
      }
      this.onboardingService
        .verifyGSTIN(
          this.currentStoreInfo._id,
          this.gstinForm.get('gstNumber')?.value
        )
        .subscribe(
          (response) => {
            console.log(response);
            //@ts-ignore
            this.verifyGstinResponse = response.body;
          },
          (error) => {
            console.log(error.error.message);
            const errors: ValidationErrors = { error: error.error.message };
            this.gstinForm.setErrors(errors);
            this.alert(error.error.message, 'top', 1500);
          }
        );
      this.gstinForm.reset();
    }
  }
}
