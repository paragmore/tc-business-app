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
import { IonicModule, ModalController } from '@ionic/angular';
import { OnboardingService } from '../../services/onboarding/onboarding.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/models/state.model';
import { StoreInfoModel, UserStoreInfoModel } from 'src/app/store/models/userStoreInfo.models';
import { Observable } from 'rxjs';
import { CurrentStoreInfoService } from '../../services/currentStore/current-store-info.service';

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
  currentStoreInfo: StoreInfoModel | undefined
  verifyGstinResponse: VerifyGSTINResponseI | undefined = {
    ntcrbs: 'TRD:TWD',
    adhrVFlag: 'No',
    lgnm: 'Raymond Consumer Care Limited',
    stj: 'State - Bihar,Division - Patna East,Circle - Patna City East',
    dty: 'Regular',
    cxdt: '',
    gstin: '10AAJCR2207E1Z2',
    nba: ['Wholesale Business', 'Warehouse / Depot'],
    ekycVFlag: 'No',
    cmpRt: 'NA',
    rgdt: '24/03/2020',
    ctb: 'Public Limited Company',
    pradr: {
      adr: 'Ward No - 56, Near Maa Santoshi Computer, Krishna Niketan School Road , Jakariyapur, Bari - Pahari - Agamkuan, Patna, Bihar, 800007',
      addr: {
        flno: '',
        lg: '',
        loc: ' Bari - Pahari - Agamkuan',
        pncd: ' 800007',
        bnm: ' Krishna Niketan School Road ',
        city: '',
        lt: '',
        stcd: ' Bihar',
        bno: '0',
        dst: ' Patna',
        st: ' Jakariyapur',
      },
    },
    sts: 'Active',
    tradeNam: 'Raymond Consumer Care Limited',
    isFieldVisitConducted: 'No',
    ctj: 'Commissionerate - PATNA I,Division - PATNA EAST DIVISION,Range - DEEDARGANJ RANGE (Jurisdictional Office)',
    einvoiceStatus: 'No',
    lstupdt: '',
    adadr: [],
    ctjCd: '',
    errorMsg: null,
    stjCd: '',
  };
  onGSTEnabledChanged(event: any) {
    const selectedValue = event.detail.value;
    this.isGstEnabled = selectedValue;
  }

  ngOnInit() {
    this.userStoreInfoState$ = this.store.select(
      (store) => store.userStoreInfo
    );
    this.userStoreInfoState$?.subscribe(
      (userStoreInfo) => (this.userStoreInfoState = userStoreInfo)
    );
   this.currentStoreInfoService.getCurrentStoreInfo().subscribe((reponse)=>{
    console.log(reponse)
    this.currentStoreInfo = reponse
   })
  }

  // setOpen(isOpen: boolean) {
  //   this.isModalOpen = isOpen;
  // }

  gstinForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private onboardingService: OnboardingService,
    private store: Store<AppState>,
    private modalController: ModalController,
    private currentStoreInfoService: CurrentStoreInfoService
  ) {
    this.gstinForm = this.formBuilder.group({
      gstNumber: ['', Validators.required],
    });
  }

  async closeModel() {
    const close: string = 'Modal Removed';
    await this.modalController.dismiss(close);
  }

  onboardGSTStore(){
    if (!this.currentStoreInfo || !this.currentStoreInfo._id || ! this.verifyGstinResponse) {
      return;
    }
    this.onboardingService.onboardGSTStore(this.currentStoreInfo._id, this.verifyGstinResponse).subscribe((response)=> console.log(response))
  }

  submitForm() {
    if (this.gstinForm.valid) {
      if (!this.currentStoreInfo ||!this.currentStoreInfo._id) {
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
          }
        );
    }
  }
}
