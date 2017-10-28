import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'request-card',
  templateUrl: './request-card.component.html',
  styleUrls: ['./request-card.component.css']
})
export class RequestCardComponent {
	@Input() requestData: object;
	@Input() id: number;

	constructor(private router: Router) {}

	assignPerson = (id) => {
		this.router.navigate(['/person/', id, 'assign']);
	};
}
