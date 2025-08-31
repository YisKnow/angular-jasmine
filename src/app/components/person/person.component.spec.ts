import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Person } from '../../models/person.model';

import { PersonComponent } from './person.component';

describe('PersonComponent', () => {
  let component: PersonComponent;
  let fixture: ComponentFixture<PersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should the name be "Jesús"', () => {
    component.person = new Person('Jesús', 'Atao', 28, 75, 1.75);
    expect(component.person.name).toEqual('Jesús');
  });

  it('should have <p> with "Mi altura es {person.height}"', () => {
    // Arrange
    component.person = new Person('Jesús', 'Atao', 28, 75, 1.75);
    const expectMsg = `Mi altura es: ${component.person.height}`;
    const personElement: HTMLElement = fixture.nativeElement;
    const p = personElement.querySelector('p');
    //Act
    fixture.detectChanges();
    // Assert
    expect(p?.textContent).toEqual(expectMsg);
  });

  it('should have <p> with "Mi altura es {person.height}" with debugElement', () => {
    // Arrange
    component.person = new Person('Jesús', 'Atao', 28, 75, 1.75);
    const expectMsg = `Mi altura es: ${component.person.height}`;
    const personDebug: DebugElement = fixture.debugElement;
    const personElement: HTMLElement = personDebug.nativeElement;
    const p = personElement.querySelector('p');
    //Act
    fixture.detectChanges();
    // Assert
    expect(p?.textContent).toEqual(expectMsg);
  });

  it('should have <h3> with "Hola, {person.name}" with debugElement and byCss', () => {
    // Arrange
    component.person = new Person('Jesús', 'Atao', 28, 75, 1.75);
    const expectMsg = `Hola, ${component.person.name}`;
    const personDebug: DebugElement = fixture.debugElement;
    const h3Debug: DebugElement = personDebug.query(By.css('h3'));
    const h3Element: HTMLElement = h3Debug.nativeElement;
    //Act
    fixture.detectChanges();
    // Assert
    expect(h3Element?.textContent).toEqual(expectMsg);
  });

  it('should have <p> with "Mi altura es {person.height}" with debugElement and byCss', () => {
    // Arrange
    component.person = new Person('Jesús', 'Atao', 28, 75, 1.75);
    const personDebug: DebugElement = fixture.debugElement;
    const pDebug: DebugElement = personDebug.query(By.css('p'));
    const pElement: HTMLElement = pDebug.nativeElement;
    //Act
    fixture.detectChanges();
    // Assert
    expect(pElement?.textContent).toContain(component.person.height.toString());
  });

  it('should display a text with IMC when call calcIMC', () => {
    // Arrange
    const expectMsg = 'overweight level 3';
    component.person = new Person('Juan', 'Perez', 30, 120, 1.65);
    const button: HTMLElement = fixture.debugElement.query(By.css('button.btn-imc')).nativeElement;
    // Act
    component.calcIMC();
    fixture.detectChanges();
    // Assert
    expect(button.textContent).toContain(expectMsg);
  });

  it('should display a text with IMC when do click', () => {
    // Arrange
    const expectMsg = 'overweight level 3';
    component.person = new Person('Juan', 'Perez', 30, 120, 1.65);
    const buttonDebug: DebugElement = fixture.debugElement.query(By.css('button.btn-imc'));
    const buttonElement: HTMLElement = buttonDebug.nativeElement;
    // Act
    // buttonElement.click();
    buttonDebug.triggerEventHandler('click', null);
    fixture.detectChanges();
    // Assert
    expect(buttonElement.textContent).toContain(expectMsg);
  });

  it('should raise selected event when do click', () => {
    // Arrange
    const expectPerson = new Person('Juan', 'Perez', 30, 120, 1.65);
    component.person = expectPerson;
    const buttonDebug: DebugElement = fixture.debugElement.query(By.css('button.btn-choose'));

    let selectedPerson: Person | undefined;
    component.onSelected
      .subscribe((person: Person) => {
        selectedPerson = person;
      });
    // Act
    buttonDebug.triggerEventHandler('click', null);
    fixture.detectChanges();
    // Assert
    expect(selectedPerson).toEqual(expectPerson);
  });
});

@Component({
  template: `<app-person [person]="person" (onSelected)="onSelected($event)"></app-person>`
})
class HostComponent {
  person = new Person('Daniel', 'Atao', 15, 56, 1.78);
  selectedPerson: Person | undefined;

  onSelected(person: Person) {
    this.selectedPerson = person;
  }
}

describe('PersonComponent from HostComponent', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostComponent, PersonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display person name', () => {
    // Arrange
    const expectName = component.person.name;
    const h3Debug: DebugElement = fixture.debugElement.query(By.css('app-person h3'));
    const h3Element: HTMLElement = h3Debug.nativeElement;
    // Act
    fixture.detectChanges();
    // Assert
    expect(h3Element.textContent).toContain(expectName);
  });

  it('should raise selected event when clicked', () => {
    // Arrange
    const buttonDebug: DebugElement = fixture.debugElement.query(By.css('app-person .btn-choose'));
    // Act
    buttonDebug.triggerEventHandler('click', null);
    fixture.detectChanges();
    // Assert
    expect(component.selectedPerson).toEqual(component.person);
  });
});
