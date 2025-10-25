import { Component } from '@angular/core';
import { EmailList } from '../email-list/email-list';
import { EmailSummary } from '../email-summary/email-summary';
import { Header } from '../header/header';

@Component({
  selector: 'app-main-page',
  imports: [
    EmailList,
    EmailSummary,
    Header,
  ],
  templateUrl: './main-page.html',
  styleUrl: './main-page.css'
})
export class MainPage {

}
