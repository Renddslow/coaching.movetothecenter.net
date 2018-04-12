import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.css']
})
export class NoteCardComponent {
	@Input() note;
	firebase = window['firebase'];

	ngOnInit() {
		this.note['created'] = moment(this.note['created'] * 1000).format('MMM D, YYYY');
		const history = Object.keys(this.note['history']);
		const date = parseInt(history[history.length - 1], 10);
		this.note['lastModified'] = moment(date * 1000).format('MMM D, YYYY');
		this.note['privacyMessage'] = this.getPrivacyMessage(this.note['privacy']['level']);
	}

	getPrivacyMessage = level => {
		switch(level) {
			case 'CREATOR_ONLY': return 'Only you can see this note';
			case 'ADMINS':
				if (this.note['privacy']['creator'] === this.firebase.auth().currentUser.uid) {
					return 'You and all admins can see this note';
				} else {
					return 'All admins can see this note';
				}
			case 'COACHES': return 'All coaches can see this note';
		}
	}
}
