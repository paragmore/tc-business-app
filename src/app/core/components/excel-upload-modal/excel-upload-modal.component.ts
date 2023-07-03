import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { toastAlert } from '../../utils/toastAlert';
import { ExcelService } from '../../services/excel/excel.service';
import { DialogHeaderComponent } from '../dialog-header/dialog-header.component';

@Component({
  selector: 'app-excel-upload-modal',
  templateUrl: './excel-upload-modal.component.html',
  styleUrls: ['./excel-upload-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, DialogHeaderComponent],
})
export class ExcelUploadModalComponent implements OnInit {
  @Input() excelUploadModalInput!: ExcelUploadModalInputI;
  constructor(
    private toastController: ToastController,
    private excelService: ExcelService,
    private modalController: ModalController
  ) {}

  ngOnInit() {}
  onCloseExcelUploadModal() {
    this.modalController.dismiss();
  }

  downloadFile() {
    const downloadLink =
      'https://firebasestorage.googleapis.com/v0/b/taxcorner-9d897.appspot.com/o/sampleFiles%2FproductUploadSampleFile.xlsx?alt=media&token=5b4a4dd9-2f77-4977-aee1-ecab5176d241'; // Replace with your actual download link

    const anchor = document.createElement('a');
    anchor.href = downloadLink;
    anchor.download = 'sample-file.csv';
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  async handleFileInput(event: any) {
    const files: FileList = event.target.files;
    console.log(files);
    if (files.length > 1) {
      toastAlert(this.toastController, 'Please select only 1 file');
      console.log('Please select up to 5 files');
      return;
    }
    const file: File | null = files.item(0);
    if (!file) {
      return;
    }
    if (file.size <= 1 * 1024 * 1024) {
      console.log(file);
      const jsonData = await this.excelService.convertToJson(file);
      this.excelUploadModalInput.cta.onFileInput(jsonData);
      console.log(jsonData);
    } else {
      toastAlert(this.toastController, 'File size exceeds the limit of 1 MB');
      return;
    }
  }
}

export interface ExcelUploadModalInputI {
  header: string;
  cta: {
    text: string;
    onFileInput: (jsonData: Object) => void;
  };
  title: string;
  icon: string;
}
