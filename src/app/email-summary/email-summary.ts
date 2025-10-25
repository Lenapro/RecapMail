import { Component, OnInit } from '@angular/core';
import { EmailListService } from '../service/email-list.service';

@Component({
  selector: 'app-email-summary',
  imports: [],
  templateUrl: './email-summary.html',
  styleUrl: './email-summary.css'
})
export class EmailSummary implements OnInit{

  summary!: String;

  constructor(private emailListService: EmailListService) {}

  ngOnInit(): void {
      this.getSummary();
  }

  getSummary() {
    this.emailListService.getSummary().subscribe({
      next: (text) => this.summary = text,
      error: (err) => console.log("une erreur s'est produite lors du chargement du résumé", err)

    })
  }

}
