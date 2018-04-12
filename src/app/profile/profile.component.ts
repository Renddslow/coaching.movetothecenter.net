import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

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

  constructor(private http: Http, private router: ActivatedRoute) {}

  ngOnInit() {
    this.sub = this.router.params.subscribe((params) => {
      this.personId = params['id'];
      this.firebase.database().ref(`people/${this.personId}`)
        .on('value', res => {
          this.person = res.val();
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
        })
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
  }

}
