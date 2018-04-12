import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.css']
})
export class EditDialogComponent {
	firebase = window['firebase']
	goals;
	goal: string;

	constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

	ngOnInit() {
		this.firebase.database()
			.ref('goals')
			.once('value')
			.then(data => data.val())
			.then(data => {
				this.goals = Object.keys(data)
					.map(k => ({
						label: data[k].label,
						goals: Object.keys(data[k].goals)
							.map(j => data[k].goals[j].name),
					}));
			});
	}

	saveSettings(): void {
		if (this.goal) {
			const ref = this.data.request['type'] === 'assignment'
				? `assignments/${this.data.request['id']}/goal`
				: `requests/${this.data.id}/goal`;
			this.firebase.database()
				.ref(ref)
				.set(this.goal);
				this.dialogRef.close();
		} else {
			this.dialogRef.close();
		}
	}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
