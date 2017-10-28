import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.css']
})
export class AssignmentComponent implements OnInit {

	firebase = window['firebase'];
	sub: any;
	person = {};
	coaches = [];
	personId: string;

  constructor(private http: Http, private router: ActivatedRoute) {}

  ngOnInit() {
		this.sub = this.router.params.subscribe((params) => {
			this.personId = params['id'];
			this.firebase.database().ref(`people/${this.personId}`)
				.on('value', res => {
					this.person = res.val();
				});
		});

		this.firebase.database()
			.ref('people')
			.orderByChild('isCoach')
			.equalTo(true)
			.on('value', res => {
				const data = res.val();
				this.coaches = Object.keys(data).map(key => {
					const coach = data[key];
					coach.id = key;
					coach.type = 'COACH';
					coach.pbcId = this.personId;
					return coach;
				});
			});
  }

	searchCoaches(searchTerm: HTMLInputElement) {
		if (searchTerm.value === '') {
			this.firebase.database()
				.ref('people')
				.orderByChild('isCoach')
				.equalTo(true)
				.on('value', res => {
					const data = res.val();
					this.coaches = Object.keys(data).map(key => {
						const coach = data[key];
						coach.id = key;
						coach.type = 'COACH';
						coach.pbcId = this.personId;
						return coach;
					});
				});
		}
		this.coaches = this.coaches.filter(coach => {
			if (coach.firstName.includes(searchTerm.value)) {
				return coach;
			}
		});
	}

}
