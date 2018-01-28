import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

	firebase = window['firebase'];
	requests = [];
	pendings = [];
	user = JSON.parse(localStorage.user);

  constructor(private http: Http, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
		if (this.user.isAdmin) {
			this.firebase.database()
				.ref('requests')
				.on('value', res => {
					const data = res.val();
					this.requests = Object.keys(data || {}).map(key => {
						const person = data[key];
						person.id = key;
						person.type = 'REQUEST'
						return person;
					});
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
						person.type = 'ASSIGNMENT'
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
					.equalTo(this.user.uid)
					.on('value', res => {
						const data = res.json();
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

}
