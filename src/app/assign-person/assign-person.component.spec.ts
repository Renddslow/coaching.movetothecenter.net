import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignPersonComponent } from './assign-person.component';

describe('AssignPersonComponent', () => {
  let component: AssignPersonComponent;
  let fixture: ComponentFixture<AssignPersonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignPersonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
