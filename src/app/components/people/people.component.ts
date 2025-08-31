import { Component } from '@angular/core';

import { Person } from '../../models/person.model';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent {
  people: Person[] = [
    new Person('Juan', 'Perez', 30, 120, 1.65),
    new Person('Maria', 'Gomez', 25, 60, 1.55),
  ];
  selectedPerson: Person | null = null;

  choose(person: Person) {
    this.selectedPerson = person;
  }
}
