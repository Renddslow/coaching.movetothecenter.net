import { Component, Input } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';

@Component({
  selector: 'person-card',
  templateUrl: './person-card.component.html',
  styleUrls: ['./person-card.component.css']
})
export class PersonCardComponent {
  @Input() person: object;

  firebase = window['firebase'];
  user = JSON.parse(localStorage.getItem('user') || '{}');

  constructor(private router: Router, private http: Http) {}

  sendReminder = (element, email) => {
    element.disabled = true;
    element.textContent = 'SENT';
  };

  assignPerson = (id) => {
    this.markRequestAsSeen(id);
    this.router.navigate(['/person/', id, 'assign']);
  };

  viewProfile = (id) => {
    this.markRequestAsSeen(id);
    this.router.navigate(['/person/', id])
  };

  assignPersonTo = (pbcId, coachId) => {
    this.markRequestAsSeen(pbcId);
    this.router.navigate(['/person/', pbcId, 'assign', coachId]);
  };

  acceptAssignment = (assignmentId) => {
    this.markRequestAsSeen(assignmentId);
    this.firebase.database()
      .ref(`assignments/${assignmentId}`)
      .once('value')
      .then(assignment => {
        const data = assignment.val();
        data.status = 'ACTIVE';
        this.firebase.database()
          .ref(`assignments/${assignmentId}`)
          .set(data);
      });
  };

  markRequestAsSeen = id => {
    const notifs = JSON.parse(window.localStorage.getItem('notifications') || '{}');
    notifs[id]['seen'] = true;
    window.localStorage.setItem('notifications', JSON.stringify(notifs));
  };

}
