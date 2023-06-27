import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  constructor() {}

  convertToJson(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        const data: string = e.target.result;
        const workbook: XLSX.WorkBook = XLSX.read(data, { type: 'binary' });
        const worksheet: XLSX.WorkSheet =
          workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
        });

        // Get the header row from the worksheet
        const headerRow: any[] = jsonData[0];

        // Create an array to store the final JSON data
        const result: any[] = [];

        // Loop through the remaining rows and create objects with key-value pairs
        for (let i = 1; i < jsonData.length; i++) {
          const row: any[] = jsonData[i];
          const obj: any = {};

          // Map each column value to its corresponding header
          for (let j = 0; j < headerRow.length; j++) {
            const key: string = headerRow[j];
            const value: any = row[j];
            obj[key] = value;
          }

          result.push(obj);
        }

        resolve(result);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsBinaryString(file);
    });
  }
}
