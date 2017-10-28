import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
	firebase = window['firebase'];
	user = {
		email: null,
		password: null
	}

	login() {
		this.firebase
			.auth()
			.signInWithEmailAndPassword(this.user.email, this.user.password)
			.catch(error => {
				console.log(error);
			});
	}
}
