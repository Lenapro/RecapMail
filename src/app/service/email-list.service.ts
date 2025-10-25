import { Injectable } from '@angular/core';
import { email } from '../model/email';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailListService {

  private jsonFile = '/mails-today.json'

  constructor(private http: HttpClient) {}

  // Récupération de la partie emails du fichier uniquement
  getTodaysEmail(): Observable<email[]> {
    return this.http.get<any>(this.jsonFile).pipe(
      map(data => data[0].emails.map((e: any) => new email (
        e.id,
        e.sender,
        e.subject,
        new Date(e.date)
      )))
    );
  }

  // Récupération du résumé de l'IA

  getSummary(): Observable<String> {
    return this.http.get<any>(this.jsonFile).pipe(
      map(data => data[0].summary)
    );
  }
  
  // Récupération de la date du jour

  getDateToday(): Observable<Date> {
    return this.http.get<any>(this.jsonFile).pipe(
      map(data => data[0].dateToday)
    );
  }
}
