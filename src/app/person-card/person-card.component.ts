import { Component, Input } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import * as moment from 'moment';
import {assign} from 'rxjs/util/assign';

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
    if (notifs[id]) {
      notifs[id]['seen'] = true;
    }
    window.localStorage.setItem('notifications', JSON.stringify(notifs));
  };

  declineAssignment = assignmentId => {
    this.markRequestAsSeen(assignmentId);
    this.firebase.database()
      .ref(`assignments/${assignmentId}`)
      .once('value')
      .then(assignment => assignment.val())
      .then(assignment => {
        const declined = moment().unix();
        const historyEntry = {
          coach: assignment.coach,
          declined,
          reason: '',
          assigned: assignment['assigned']
        };
        const newRequest = {
          firstName: assignment['firstName'],
          lastName: assignment['lastName']
        };
        if (assignment['image']) {
          newRequest['image'] = assignment['image'];
        }
        let history = {};
        if (assignment['history']) {
          history = assignment['history'];
        }
        history[declined] = historyEntry;
        newRequest['history'] = history;

        this.firebase.database()
          .ref(`requests/${assignment['personId']}`)
          .set(newRequest);

        this.firebase.database()
          .ref(`assignments/${assignmentId}`)
          .remove();
      });
  };

}
