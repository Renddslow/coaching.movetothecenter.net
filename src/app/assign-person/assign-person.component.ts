import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-assign-person',
  templateUrl: './assign-person.component.html',
  styleUrls: ['./assign-person.component.css']
})
export class AssignPersonComponent implements OnInit {

  firebase = window['firebase'];
  sub: any;

  constructor(private http: Http, private router: ActivatedRoute, private nav: Router) {}

  ngOnInit() {
    this.sub = this.router.params.subscribe((params) => {
      const personId = params['id'];
      const coachId = params['coachId'];
      this.firebase.database()
        .ref(`people/${personId}`)
        .once('value')
        .then(res => res.val())
        .then(person => {
          return this.firebase.database()
            .ref(`people/${coachId}`)
            .once('value')
            .then(res => ({person, coach: res.val()}))
        })
        .then(({person, coach}) => {
          this.firebase.database()
            .ref(`requests/${personId}`)
            .once('value')
            .then(res => res.val())
            .then(request => {
              this.firebase.database()
                .ref(`requests/${personId}`)
                .remove();
              const assignmentData = {
                personId: personId,
                firstName: person.firstName,
                lastName: person.lastName,
                image: person.image || '',
                coach: {
                  id: coachId,
                  firstName: coach.firstName,
                  lastName: coach.lastName,
                  image: coach.image || '',
                  email: coach.email
                },
                status: 'PENDING',
                assigned: moment().unix(),
                history: request.history
              };
              console.log({ person, coach });
              this.http.post('https://api.flatlandchurch.com/v2/emails/coachingAssignments?key=202f1c42-7054-46ee-8ca2-ddc85f9c789b', {
                person,
                coach
              }).subscribe(res => {
                // Apppppparrently observers only work if you're subscribed? Idk, I could look it up but I won't
                console.log('Notification sent!');
              });
              console.log(assignmentData);
              return this.firebase.database()
                .ref(`assignments/${moment().unix()}`)
                .set(assignmentData);
            })
        })
        .then(() => {
          this.nav.navigate(['/person/', personId]);
        });
    });
  }

}
