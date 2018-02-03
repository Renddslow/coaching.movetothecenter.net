import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
	firebase = window['firebase']

  navLinks = [
		"/people"
	];

	logout() {
		this.firebase.auth().signOut();
	}
}
