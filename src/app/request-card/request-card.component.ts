import { Component, Input, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';

@Component({
  selector: 'request-card',
  templateUrl: './request-card.component.html',
  styleUrls: ['./request-card.component.css']
})
export class RequestCardComponent {
	@Input() requestData: object;
	@Input() id: number;
	firebase = window['firebase'];

	constructor(
		private router: Router,
		public dialog: MatDialog) {}

	ngOnInit() {}

	assignPerson = (id) => {
		this.router.navigate(['/person/', id, 'assign']);
	};

	openDialog = () => {
		let dialogRef = this.dialog.open(EditDialogComponent, {
			width: '250px',
			data: {
				id: this.id,
				request: this.requestData
			}
		});
	}
}
