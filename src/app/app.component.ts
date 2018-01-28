import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
	firebase = window['firebase'];

	ngOnInit() {
		this.firebase.database()
			.ref(`people/${this.firebase.auth().currentUser.uid}`)
			.on('value', res => {
				const data = res.val();
				data.uid = this.firebase.auth().currentUser.uid;
				localStorage.setItem('user', JSON.stringify(data));
			});
	}

}
