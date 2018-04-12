import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule }   from '@angular/forms';
import { SimplemdeModule, SIMPLEMDE_CONFIG } from 'ng2-simplemde';

import { 	MatCardModule,
					MatTabsModule,
					MatToolbarModule,
					MatIconModule,
					MatMenuModule,
					MatButtonModule,
					MatChipsModule,
					MatInputModule,
					MatProgressBarModule,
					MatDialogModule,
					MatSelectModule,
					MatTooltipModule
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
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';
import { NotesDialogComponent } from './notes-dialog/notes-dialog.component';
import { NoteCardComponent } from './note-card/note-card.component';

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
    AssignPersonComponent,
    EditDialogComponent,
    NotesDialogComponent,
    NoteCardComponent
  ],
  imports: [
    BrowserModule,
		RouterModule.forRoot(appRoutes),
		HttpModule,
		BrowserAnimationsModule,
		MatCardModule,
		MatTabsModule,
		MatToolbarModule,
		MatIconModule,
		MatMenuModule,
		MatButtonModule,
		MatChipsModule,
		MatInputModule,
		MatProgressBarModule,
		FormsModule,
		MatDialogModule,
		MatSelectModule,
		MatTooltipModule,
		SimplemdeModule.forRoot({
			provide: SIMPLEMDE_CONFIG,
			useValue: {}
		}),
  ],
	entryComponents: [
		EditDialogComponent,
		NotesDialogComponent
	],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
