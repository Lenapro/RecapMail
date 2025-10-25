import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailSummary } from './email-summary';

describe('EmailSummary', () => {
  let component: EmailSummary;
  let fixture: ComponentFixture<EmailSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
