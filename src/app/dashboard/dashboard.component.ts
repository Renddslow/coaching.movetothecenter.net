import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import {equal} from 'assert';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  firebase = window['firebase'];
  requests = [];
  pendings = [];
  user = JSON.parse(localStorage.getItem('user') || '{}');

  constructor(private http: Http, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    if (this.user.isAdmin) {
      this.firebase.database()
        .ref('requests')
        .on('value', res => {
          const notifications = JSON.parse(window.localStorage.getItem('notifications') || '{}');

          const data = res.val();
          this.requests = Object.keys(data || {}).map(key => {
            const person = data[key];
            person.id = key;
            person.type = 'REQUEST';
            return person;
          });

          this.requests.forEach(r => {
            const notificationDoesNotExist = !Boolean(notifications[r.id]);
            const notificationExistsAndIsSeen = notifications[r.id] && notifications[r.id]['seen'];
            if (notificationDoesNotExist && !notificationExistsAndIsSeen) {
              notifications[r.id] = {
                seen: false,
                message: `${r.firstName} ${r.lastName} has requested coaching`
              };
            }
          });
          window.localStorage.setItem('notifications', JSON.stringify(notifications));

          this.requests.map(r => {
            const notifs = JSON.parse(window.localStorage.getItem('notifications') || '{}');
            r.hasBadge = notifs[r['id']] && !notifs[r['id']].seen;
          });

          this.cleanNotificationStorage(this.requests);

          this.requests.sort((a, b) => {
            if (a.firstName < b.firstName) {
              return -1;
            }
            if (a.firstName > b.firstName) {
              return 1;
            }
            return 0;
          });
        });
      this.firebase.database()
        .ref('assignments')
        .orderByChild('status')
        .equalTo('PENDING')
        .on('value', res => {
          const data = res.val();
          this.pendings = Object.keys(data || {}).map(key => {
            const person = data[key];
            person.id = person.personId;
            person.assignmentId = key;
            person.type = 'ASSIGNMENT';
            return person;
          });
          this.pendings.sort((a, b) => {
            if (a.firstName < b.firstName) {
              return -1;
            }
            if (a.firstName > b.firstName) {
              return 1;
            }
            return 0;
          });
        });
    } else {
      this.firebase.database()
        .ref('assignments')
        .orderByChild('coach/id')
        .equalTo(this.user.uid || this.firebase.auth().currentUser.uid)
        .on('value', res => {
          const data = res.val();
          this.pendings = Object.keys(data || {}).map(key => {
            const person = data[key];
            person.id = person.personId;
            person.assignmentId = key;
            person.type = 'ASSIGNMENT';
            return person;
          });
          this.pendings.sort((a, b) => {
            if (a.firstName < b.firstName) {
              return -1;
            }
            if (a.firstName > b.firstName) {
              return 1;
            }
            return 0;
          });
        })
    }
  };

  cleanNotificationStorage = requests => {
    const oldKeys = [];
    const notifs = JSON.parse(window.localStorage.getItem('notifications') || '{}');
    Object.keys(notifs)
      .forEach(key => {
        const existingRequest = requests.find(r => r.id === key);
        if (!existingRequest) {
          oldKeys.push(key);
        }
      });
    oldKeys.forEach(k => {
      delete notifs[k];
    });
    window.localStorage.setItem('notifications', JSON.stringify(notifs));
  };

}
