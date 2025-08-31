import { Person } from './person.model';

describe('Test for Person', () => {
  let person: Person;
  beforeEach(() => {
    person = new Person('Jesús', 'Atao', 29, 120, 1.75);
  });

  it('attrs', () => {
    expect(person.name).toEqual('Jesús');
    expect(person.lastName).toEqual('Atao');
    expect(person.age).toEqual(29);
    expect(person.weight).toEqual(120);
    expect(person.height).toEqual(1.75);
  });

  describe('test for calcIMC', () => {
    it('should return a string: overweight level 2', () => {
      // Arrange
      person.weight = 120;
      person.height = 1.78;
      // Act
      const rta = person.calcIMC();
      // Assert
      expect(rta).toEqual('overweight level 2');
    });

    it('should return a string: not found', () => {
      // Arrange
      person.weight = -10;
      person.height = 1.78;
      // Act
      const rta = person.calcIMC();
      // Assert
      expect(rta).toEqual('not found');
    });

    it('should return a string: down', () => {
      // Arrange
      person.weight = 40;
      person.height = 1.78;
      // Act
      const rta = person.calcIMC();
      // Assert
      expect(rta).toEqual('down');
    });

    it('should return a string: normal', () => {
      // Arrange
      person.weight = 70;
      person.height = 1.78;
      // Act
      const rta = person.calcIMC();
      // Assert
      expect(rta).toEqual('normal');
    });

    it('should return a string: overweight', () => {
      // Arrange
      person.weight = 80;
      person.height = 1.78;
      // Act
      const rta = person.calcIMC();
      // Assert
      expect(rta).toEqual('overweight');
    });

    it('should return a string: overweight level 1', () => {
      // Arrange
      person.weight = 90;
      person.height = 1.78;
      // Act
      const rta = person.calcIMC();
      // Assert
      expect(rta).toEqual('overweight level 1');
    });

    it('should return a string: overweight level 3', () => {
      // Arrange
      person.weight = 150;
      person.height = 1.78;
      // Act
      const rta = person.calcIMC();
      // Assert
      expect(rta).toEqual('overweight level 3');
    });
  });
});
