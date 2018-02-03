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
	};
	forgotPassword = false;
	modalMessage = null;

	login = () => {
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
	};

	changeModal = forgot => {
		if (forgot) {
			this.forgotPassword = true;
		} else {
			this.forgotPassword = false;
		}
	};

	sentPasswordReset = () => {
		this.firebase
			.auth()
			.sendPasswordResetEmail(this.user.email, { url: 'https://portal.movetothecenter.net' })
			.then(() => {
				this.forgotPassword = false;
				this.modalMessage = 'Check your inbox for password reset instructions.';
			});
	}
}
