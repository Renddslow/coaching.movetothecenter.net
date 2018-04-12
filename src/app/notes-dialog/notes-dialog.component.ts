import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as moment from 'moment';
import { clone } from 'lodash';
import * as marked from 'marked';

marked.setOptions({
	renderer: new marked.Renderer(),
	gfm: true,
	tables: true,
	breaks: true,
	pedantic: false,
	sanitize: true,
	smartLists: true,
	smartypants: true,
	xhtml: false
});

@Component({
  selector: 'app-notes-dialog',
  templateUrl: './notes-dialog.component.html',
  styleUrls: ['./notes-dialog.component.css']
})
export class NotesDialogComponent implements OnInit {

	firebase = window['firebase'];
	editType = 'Add';
	note = {}
	date;
	oldContentValue: string;
	oldPrivacySetting: string;
	buttonDisabled = false;
	canEdit = false;

	// remember to timeseries uuid instead of v4

	constructor(
    public dialogRef: MatDialogRef<NotesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
		if (this.data.new) {
			this.editType = 'Add';
			this.date = moment().unix();
			this.note = {
				content: '',
				created: this.date,
				history: {
					[this.date]: {
						creator: this.data.creator,
						action: 'CREATED',
						content: ''
					}
				},
				privacy: {
					creator: this.data.creator,
					level: 'CREATOR_ONLY'
				}
			}
		} else {
			this.editType = 'Edit';
			this.date = moment().unix();
			this.note = this.data.note;
			this.oldContentValue = clone(this.data.note['content']);
			this.oldPrivacySetting = clone(this.data.note['privacy']['level']);
			this.note['history'][this.date] = {
				editor: this.data.editor,
				action: 'EDITOR',
				content: ''
			};
			const isAdmin = JSON.parse(window.localStorage.getItem('user') || '{}')['isAdmin']
			const isCreator = this.note['privacy']['creator'] === this.firebase.auth().currentUser.uid;
			this.canEdit = isAdmin || isCreator;

			if (!this.canEdit) {
				this.editType = 'View';
			}
		}
  }

	saveNote() {
		this.note['history'][this.date]['content'] = this.note['content'];
		let id: string;
		if (!this.data.new) {
			id = this.note['id'];
			delete this.note['id'];
		} else {
			id = this.data.id;
		}
		this.firebase.database()
			.ref(`people/${this.data.personId}/notes/${id}`)
			.set(this.note);
		this.dialogRef.close();
	}

	deleteNote() {
		const date = moment().unix();
		const id = this.note['id']
		this.firebase.database()
			.ref(`people/${this.data.personId}/notes/${id}/deleted`)
			.set(date);
		this.firebase.database()
			.ref(`people/${this.data.personId}/notes/${id}/history/${date}`)
			.set({
				editor: this.data.editor,
				action: 'DELETED'
			});
		this.dialogRef.close();
	}

	toMarkdown = content => marked(content);

}
