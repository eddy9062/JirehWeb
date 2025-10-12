import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SavePurchaseDto } from '../../shared/models/save-purchase';

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://amazon-back-mfu7.onrender.com/purchase';

  save(savePurchaseDto: SavePurchaseDto): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(this.baseUrl, savePurchaseDto);
  }
}
