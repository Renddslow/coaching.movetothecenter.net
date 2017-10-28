import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {

	firebase = window['firebase'];
	searchTerm: string;
	people = [];

  constructor(private http: Http) { }

  ngOnInit() {
		this.firebase.database()
			.ref('people')
			.on('value', res => {
				const people = res.val();
				this.people = Object.keys(people).map(key => {
					const data = people[key];
					data.id = key;
					return data;
				});
				this.people.sort((a, b) => {
					if (a.firstName < b.firstName) {
						return -1;
					}
					if (a.firstName > b.firstName) {
						return 1;
					}
					return 0;
				});
			});
  }

	searchPeople = (searchTerm: HTMLInputElement) => {
		if (searchTerm.value === '') {
			this.firebase.database()
				.ref('people')
				.on('value', res => {
					const people = res.val();
					this.people = Object.keys(people).map(key => {
						const data = people[key];
						data.id = key;
						return data;
					});
					this.people.sort((a, b) => {
						if (a.firstName < b.firstName) {
							return -1;
						}
						if (a.firstName > b.firstName) {
							return 1;
						}
						return 0;
					});
				});
		}
		this.people = this.people.filter(person => {
			if (person.firstName.includes(searchTerm.value)) {
				return person;
			}
		});
	};

}
