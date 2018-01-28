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
			.then(() => {
				this.firebase.database()
					.ref(`people/${this.firebase.auth().currentUser.uid}`)
					.once('value')
					.then(res => {
						const data = res.val();
						data.uid = this.firebase.auth().currentUser.uid;
						localStorage.setItem('user', JSON.stringify(data));
					});
			})
			.catch(error => {
				console.log(error);
			});
	}
}
