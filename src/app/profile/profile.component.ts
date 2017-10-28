import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ActivatedRoute } from '@angular/router';

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
	request = {};
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
					this.request = res.val();
				});
			this.firebase.database()
				.ref(`assignments`)
				.orderByChild('personId')
				.equalTo(this.personId)
				.on('value', res => {
					const data = res.val();
					this.assignmentsPBC = Object.keys(data).map(key => {
						return data[key];
					});
				});
				this.firebase.database()
					.ref('assignments')
					.orderByChild('coach/id')
					.equalTo(this.personId)
					.on('value', res => {
						const data = res.val();
						this.coachingAssignments = Object.keys(data).map(key => {
							return data[key];
						});
					})
		});
	}

	callPhone = (phoneNumber) => {
		window.location.href = `tel:${phoneNumber}`;
	};

	openEmail = (emailAddress) => {
		window.location.href = `mailto:${emailAddress}`;
	};

}
