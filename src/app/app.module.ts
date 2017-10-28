import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule }   from '@angular/forms';

import { 	MdCardModule,
					MdTabsModule,
					MdToolbarModule,
					MdIconModule,
					MdMenuModule,
					MdButtonModule,
					MdChipsModule,
					MdInputModule,
					MdProgressBarModule
				} from '@angular/material';
import 'hammerjs';


import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { PersonCardComponent } from './person-card/person-card.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { RequestCardComponent } from './request-card/request-card.component';
import { AssignmentComponent } from './assignment/assignment.component';
import { PeopleComponent } from './people/people.component';
import { LoginComponent } from './login/login.component';
import { AssignPersonComponent } from './assign-person/assign-person.component';

const appRoutes: Routes = [
	{ path: '', component: DashboardComponent },
	{ path: 'person/:id', component: ProfileComponent },
	{ path: 'person/:id/assign', component: AssignmentComponent },
	{ path: 'person/:id/assign/:coachId', component: AssignPersonComponent },
	{ path: 'people', component: PeopleComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PersonCardComponent,
    DashboardComponent,
    ProfileComponent,
    RequestCardComponent,
    AssignmentComponent,
    PeopleComponent,
    LoginComponent,
    AssignPersonComponent
  ],
  imports: [
    BrowserModule,
		RouterModule.forRoot(appRoutes),
		HttpModule,
		BrowserAnimationsModule,
		MdCardModule,
		MdTabsModule,
		MdToolbarModule,
		MdIconModule,
		MdMenuModule,
		MdButtonModule,
		MdChipsModule,
		MdInputModule,
		MdProgressBarModule,
		FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
