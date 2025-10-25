import { Component, OnInit, signal} from '@angular/core';
import { EmailListService } from '../service/email-list.service';
import { email } from '../model/email';
import { DatePipe } from '@angular/common'; 
import { FormsModule } from '@angular/forms'


@Component({
  selector: 'app-email-list',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule
  ],
  templateUrl: './email-list.html',
  styleUrl: './email-list.css'
})

export class EmailList implements OnInit{

  emails!: email[];
  dateToday!: Date;
  filteredEmails!: email[];

  senderFilter!: string ;
  keywordFilter!: string ;

  constructor(private emailService: EmailListService) {}

  ngOnInit(): void {
      this.getEmail();
      this.getDateToday();
  }

  getEmail() {
    this.emailService.getTodaysEmail().subscribe(
      {
        next: (data) => {
          this.emails = data,
          this.filteredEmails = data
        },
        error: (err) => console.error('Erreur lors du chargement des emails', err)
      }
    )
  }

  getDateToday() {
    this.emailService.getDateToday().subscribe(
      {
        next: (data) => this.dateToday = data,
      }
    )
  }

  clean(sender: string): string {
    if(!sender) return '?';
    const match = sender.match(/"?([^"<]+)"?\s*(<.*>)?/);
    return match ? match[1].trim() : sender;
  }

  getSenderInitial(sender: string): string {
    const clean = this.clean(sender);
    return clean.charAt(0).toUpperCase();
  }

  private norm(v: string | null | undefined): string {
    return (v ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '');
  }

   filterEmails() {
    const senderTerm = this.norm(this.senderFilter)
    const keywordTerm = this.norm(this.keywordFilter)

    if(!senderTerm && !keywordTerm) {
      this.filteredEmails = [...this.emails];
      return;
    }

    this.filteredEmails = this.emails.filter((mail) => {
      const sender = this.norm(this.clean(mail.sender));
      const subject = this.norm(mail.subject ?? '');

      const matchSender = !senderTerm || sender.includes(senderTerm);
      const matchKeyword = !keywordTerm || subject.includes(keywordTerm) || sender.includes(keywordTerm)

      return matchSender &&  matchKeyword;
    });
  }

  refreshList() {
    this.senderFilter = '';
    this.keywordFilter = '';
    this.filteredEmails = [...this.emails];
  }


}
