import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getAuthHeaders } from '../../utils/authHeaders';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  constructor(private httpClient: HttpClient) {}
  baseUrl = false
    ? 'https://media-api.taxpayercorner.com'
    : 'http://localhost:8025';

  uploadProductImages(images: File[], storeId: string, isVariant: boolean) {
    const url = `${this.baseUrl}/media/upload/products/${storeId}?isVariant=${isVariant}`;
    const headers = getAuthHeaders();
    const formData = new FormData();
    images.map((image) => {
      formData.append(image.name, image);
    });
    return this.httpClient.post(url, formData, { headers: headers });
  }
}
