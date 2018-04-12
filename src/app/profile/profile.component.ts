import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { MatDialog } from '@angular/material';

import { NotesDialogComponent } from '../notes-dialog/notes-dialog.component';
import * as uuid from 'uuid/v1';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  firebase = window['firebase'];
  sub: any;
  personId: string;
  person: object;
  request;
  assignmentsPBC = [];
  coachingAssignments = [];
  notes = [];

  constructor(private http: Http, private router: ActivatedRoute, public dialog: MatDialog) {}

  ngOnInit() {
    this.sub = this.router.params.subscribe((params) => {
      this.personId = params['id'];
      this.firebase.database().ref(`people/${this.personId}`)
        .on('value', res => {
          this.person = res.val();
          this.notes = Object.keys(this.person['notes'])
            .map(key => {
              const data = this.person['notes'][key];
              data['id'] = key;
              return data;
            })
            .filter(data => !data['deleted'])
            .filter(data => {
              const userIsCreator = data['privacy']['creator'] === this.firebase.auth().currentUser.uid;
              const privacyLevel = data['privacy']['level'];

              const user = JSON.parse(window.localStorage.getItem('user') || '{}');
              const userIsAdminOrCoach = user['isCoach'] && user['isAdmin'];

              switch (privacyLevel) {
                case 'CREATOR_ONLY': return userIsCreator;
                case 'ADMINS': return user['isAdmin'];
                case 'COACHES': return userIsAdminOrCoach;
              }
            });
          this.notes.sort((a, b) => {
            if (a['created'] > b['created']) {
              return -1;
            }
            if (a['created'] < b['created']) {
              return 1;
            }
            return 0;
          })
        });
      this.firebase.database()
        .ref(`requests/${this.personId}`)
        .on('value', res => {
          if (res.val()) {
            this.request = this.formatTimes(res.val());
            this.request['type'] = 'request';
          }
        });
      this.firebase.database()
        .ref(`assignments`)
        .orderByChild('personId')
        .equalTo(this.personId)
        .on('value', res => {
          if (res.val()) {
            const data = res.val();
            this.assignmentsPBC = Object.keys(data)
              .map(key => {
                const assignments = data[key];
                assignments['id'] = key;
                assignments['type'] = 'assignment';
                return assignments;
              })
              .map(this.formatTimes);
          }
        });
      this.firebase.database()
        .ref('assignments')
        .orderByChild('coach/id')
        .equalTo(this.personId)
        .on('value', res => {
          if (res.val()) {
            const data = res.val();
            this.coachingAssignments = Object.keys(data)
              .map(key => {
                const assignments = data[key];
                assignments['id'] = key;
                assignments['type'] = 'assignment';
                return assignments;
              })
              .map(this.formatTimes);
          }
        });
    });
  }

  callPhone = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  openEmail = (emailAddress) => {
    window.location.href = `mailto:${emailAddress}`;
  };

  formatTimes = data => {
    if (data['started']) {
      data['started'] = moment.unix(data['started']).format('MMMM d, YYYY');
    }
    if (data['completed']) {
      data['completed'] = moment.unix(data['completed']).format('MMMM d, YYYY');
    }
    if (data['assigned']) {
      data['assigned'] = moment.unix(data['assigned']).format('MMMM d, YYYY');
    }
    return data;
  };

  addNote = () => {
    let dialogRef = this.dialog.open(NotesDialogComponent, {
      width: '80%',
      data: {
        new: true,
        id: uuid(),
        personId: this.personId,
        creator: this.firebase.auth().currentUser.uid
      }
    });
  };

  openNote = note => {
    let dialogRef = this.dialog.open(NotesDialogComponent, {
      width: '80%',
      data: {
        new: false,
        note,
        personId: this.personId,
        editor: this.firebase.auth().currentUser.uid
      }
    })
  };

}
