import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { of, defer } from 'rxjs';

import { generateManyProducts } from '../../models/product.mock';

import { ProductsService } from '../../services/product.service';
import { ValueService } from '../../services/value.service';

import { ProductComponent } from '../product/product.component';

import { ProductsComponent } from './products.component';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productService: jasmine.SpyObj<ProductsService>;
  let valueService: jasmine.SpyObj<ValueService>;

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductsService', ['getAll']);
    const valueServiceSpy = jasmine.createSpyObj('ValueService', ['getPromiseValue']);

    await TestBed.configureTestingModule({
      declarations: [ ProductsComponent, ProductComponent ],
      providers: [
        { provide: ProductsService, useValue: productServiceSpy },
        { provide: ValueService, useValue: valueServiceSpy }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductsService) as jasmine.SpyObj<ProductsService>;
    valueService = TestBed.inject(ValueService) as jasmine.SpyObj<ValueService>;

    const productsMock = generateManyProducts(3);
    productService.getAll.and.returnValue(of(productsMock));
    fixture.detectChanges(); // ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(productService.getAll).toHaveBeenCalled();
  });

  describe('test for getAllProducts', () => {
    it('should return product list from service', () => {
      // Arrange
      const productsMock = generateManyProducts(10);
      productService.getAll.and.returnValue(of(productsMock));
      const countPrev = component.products.length;

      // Act
      // component.ngOnInit();
      component.getAllProducts();
      fixture.detectChanges();
      const products = component.products;

      // Assert
      expect(products.length).toEqual(productsMock.length + countPrev);
    });

    it('should change the status "loading" => "success"', fakeAsync(() => {
      // Arrange
      const productsMock = generateManyProducts(10);
      productService.getAll.and.returnValue(defer(() => Promise.resolve(productsMock)));

      // Act
      component.getAllProducts();
      fixture.detectChanges();

      // Assert
      expect(component.status).toBe('loading');
      tick(); // Ejecuta las tareas pendientes por resolverse que sea asincrono. exec, obs, setTimeout, promise
      fixture.detectChanges();
      expect(component.status).toBe('success');
    }));

    it('should change the status "loading" => "error"', fakeAsync(() => {
      // Arrange
      productService.getAll.and.returnValue(defer(() => Promise.reject(new Error('error'))));

      // Act
      // CHALLENGE: Don't call method directly, call to call across the clicks events
      component.getAllProducts();
      fixture.detectChanges();

      // Assert
      expect(component.status).toBe('loading');
      tick(4000); // Ejecuta las tareas pendientes por resolverse que sea asincrono. exec, obs, setTimeout, promise
      fixture.detectChanges();
      expect(component.status).toBe('error');
    }));
  });

  describe('test for callPromise', () => {
    it('should call to promise', async () => {
      // Arrange
      const mockMsg = 'my mock string';
      valueService.getPromiseValue.and.returnValue(Promise.resolve(mockMsg));
      // Act
      await component.callPromise();
      fixture.detectChanges();
      // Assert
      expect(component.rta).toEqual(mockMsg);
      expect(valueService.getPromiseValue).toHaveBeenCalled();
    });

    it('should show "my mock string" in <p> when btn was clicked', fakeAsync(() => {
      // Arrange
      const mockMsg = 'my mock string';
      valueService.getPromiseValue.and.returnValue(Promise.resolve(mockMsg));
      const btnDebug = fixture.debugElement.query(By.css('.btn-promise'));
      // Act
      btnDebug.triggerEventHandler('click', null);
      tick();
      fixture.detectChanges();
      const rtaDebug = fixture.debugElement.query(By.css('p.rta'));
      // Assert
      expect(component.rta).toEqual(mockMsg);
      expect(valueService.getPromiseValue).toHaveBeenCalled();
      expect(rtaDebug.nativeElement.textContent).toEqual(mockMsg);
    }));
  });
});
