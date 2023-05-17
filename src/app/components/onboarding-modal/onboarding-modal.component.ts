import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-onboarding-modal',
  templateUrl: './onboarding-modal.component.html',
  styleUrls: ['./onboarding-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule, FormsModule, CommonModule],
})
export class OnboardingModalComponent implements OnInit {
  @Input() isModalOpen: boolean | undefined;

  isGstEnabled: boolean = false

  onGSTEnabledChanged(event: CustomEvent){
    const selectedValue = event.detail.value
    this.isGstEnabled = selectedValue
  }

  ngOnInit() {}

  // setOpen(isOpen: boolean) {
  //   this.isModalOpen = isOpen;
  // }

  businessForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.businessForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      businessType: [''],
      gstNumber:['', Validators.required],
      businessName: ['', Validators.required],
      authorization: [false],
      businessDomain: [''],
    });
  }

  submitForm() {
    if (this.businessForm.valid) {
      // TODO: handle form submission
      console.log(this.businessForm)
    }
  }
}
