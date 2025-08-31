import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Person } from '../../models/person.model';

import { PersonComponent } from '../person/person.component';

import { PeopleComponent } from './people.component';

describe('PeopleComponent', () => {
  let component: PeopleComponent;
  let fixture: ComponentFixture<PeopleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeopleComponent, PersonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a list app-person components', () => {
    // Arrange
    component.people = [
      new Person('Juan', 'Perez', 30, 120, 1.65),
      new Person('Maria', 'Gomez', 25, 60, 1.55),
      new Person('Pedro', 'Lopez', 40, 180, 1.75)
    ];

    // Act
    fixture.detectChanges();
    const debugElement: DebugElement[] = fixture.debugElement.queryAll(By.directive(PersonComponent));
    // const debugElement: DebugElement[] = fixture.debugElement.queryAll(By.css('app-person'));

    // Assert
    // expect(debugElement.length).toBe(component.people.length);
    expect(debugElement.length).toBe(3);
  });

  it('should show a selected person', () => {
    // Arrange
    const people = [
      new Person('Peter', 'Parker', 24, 70, 1.7),
      new Person('Armando', 'Rivera', 24, 80, 1.8),
      new Person('Bruce', 'Wayne', 24, 80, 1.8),
    ];
    component.people = people;

    // Act
    fixture.detectChanges();
    const debugButtonList = fixture.debugElement.queryAll(
      By.css('app-person .btn-choose')
    );

    debugButtonList[0].triggerEventHandler('click', null);
    fixture.detectChanges();
    const debugPersonSelectedInfo = fixture.debugElement.queryAll(
      By.css('.selectedPerson ul li')
    );

    // Assert

    expect(debugPersonSelectedInfo[0].nativeElement.textContent).toContain(
      people[0].name
    );
    expect(debugPersonSelectedInfo[1].nativeElement.textContent).toContain(
      people[0].age
    );
  });

  it('should raise selected event when clicked', () => {
    // Arrange
    component.people = [
      new Person('Leonardo', 'Arias', 23, 1, 1),
      new Person('Valentina', 'Rodriguez', 12, 2, 3),
      new Person('Santiago', 'Dolores', 12, 2, 3),
    ];
    const idx = 1;
    //Act
    fixture.detectChanges();
    const debugElement = fixture.debugElement.queryAll(By.css('app-person'));
    const btnDe = debugElement[idx].query(By.css('.btn-choose'));
    btnDe.triggerEventHandler('click', null);
    fixture.detectChanges();
    //
    expect(component.selectedPerson).toEqual(component.people[idx]);
  });
});
