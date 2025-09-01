import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighlightDirective } from './highlight.directive';

@Component({
  template: `
    <h5 class="title" highlight>Hay un valor</h5>
    <h5 highlight="yellow">yellow</h5>
    <p highlight="blue">parrafo</p>
    <p>otro parrafo</p>
  `
})
class HostComponent {}

fdescribe('HighlightDirective', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostComponent, HighlightDirective ]
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

  it('should have three highlight elements', () => {
    const elements = fixture.debugElement.queryAll(By.directive(HighlightDirective));
    const elementsWithout = fixture.debugElement.queryAll(By.css('*:not([highlight])'));
    expect(elements.length).toBe(3);
    expect(elementsWithout.length).toBe(1);
  });

  it('should the elements be match with bgColor', () => {
    const elements = fixture.debugElement.queryAll(By.directive(HighlightDirective));
    expect(elements[0].nativeElement.style.backgroundColor).toBe('pink');
    expect(elements[1].nativeElement.style.backgroundColor).toBe('yellow');
    expect(elements[2].nativeElement.style.backgroundColor).toBe('blue');
    expect(elements.length).toBe(3);
  });

  it('should the elements be match with bgColor', () => {
    const elements = fixture.debugElement.queryAll(By.directive(HighlightDirective));
    expect(elements[0].nativeElement.style.backgroundColor).toBe('pink');
    expect(elements[1].nativeElement.style.backgroundColor).toBe('yellow');
    expect(elements[2].nativeElement.style.backgroundColor).toBe('blue');
    expect(elements.length).toBe(3);
  });

  it('should the h5.title be defaultColor', () => {
    const titleDebug = fixture.debugElement.query(By.css('h5.title'));
    const dir = titleDebug.injector.get(HighlightDirective);
    expect(titleDebug.nativeElement.style.backgroundColor).toBe(dir.defaultColor);
  })
});
