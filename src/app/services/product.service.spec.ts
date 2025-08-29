import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { HTTP_INTERCEPTORS, HttpStatusCode } from "@angular/common/http";

import { environment } from './../../environments/environment';

import { TokenInterceptor } from "../interceptors/token.interceptor";

import { CreateProductDTO, Product, UpdateProductDTO } from "../models/product.model";
import { generateOneProduct, generateManyProducts } from "../models/product.mock";

import { ProductsService } from "./product.service";
import { TokenService } from "./token.service";

describe("ProductsService", () => {
  let productsService: ProductsService;
  let httpController: HttpTestingController;
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProductsService,
        TokenService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true
        }
      ]
    });
    productsService = TestBed.inject(ProductsService);
    httpController = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(() => {
    httpController.verify();
  });

  it("should be created", () => {
    expect(productsService).toBeTruthy();
  });

  describe('tests for getAllSimple', () => {
    it('should return a product list', (doneFn) => {
      // Arrange
      const mockData: Product[] = generateManyProducts(2);
      spyOn(tokenService, 'getToken').and.returnValue('123');

      // Act
      productsService.getAllSimple()
        .subscribe({
          next: (data) => {
            // Assert
            expect(data.length).toEqual(mockData.length);
            expect(data).toEqual(mockData);
            doneFn();
          }
        });

      // http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      const headers = req.request.headers;
      expect(headers.get('Authorization')).toEqual('Bearer 123');
      req.flush(mockData);
    });
  });

  describe('tests for getAll', () => {
    it('should return a product list', (doneFn) => {
      // Arrange
      const mockData: Product[] = generateManyProducts(3);

      // Act
      productsService.getAll()
        .subscribe({
          next: (data) => {
            // Assert
            expect(data.length).toEqual(mockData.length);
            // expect(data).toEqual(mockData);
            doneFn();
          }
        });

      // http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
    });

    it('should return product list with taxes', (doneFn) => {
      // Arrange
      const mockData: Product[] = [
        {
          ...generateOneProduct({ price: 100 }), // 100 * .19 = 19
        },
        {
          ...generateOneProduct({ price: 200 }), // 200 * .19 = 38
        },
        {
          ...generateOneProduct({ price: 0 }), // 0 * .19 = 0
        },
        {
          ...generateOneProduct({ price: -100 }), // negative = 0
        }
      ];

      // Act
      productsService.getAll()
        .subscribe({
          next: (data) => {
            // Assert
            expect(data.length).toEqual(mockData.length);
            expect(data[0].taxes).toEqual(19);
            expect(data[1].taxes).toEqual(38);
            expect(data[2].taxes).toEqual(0);
            expect(data[3].taxes).toEqual(0);
            doneFn();
          }
        });

      // http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
    });

    it('should send query params with limit 10 and offset 3', (doneFn) => {
      // Arrange
      const mockData: Product[] = generateManyProducts(3);
      const limit = 10;
      const offset = 3;

      // Act
      productsService.getAll(limit, offset)
        .subscribe({
          next: (data) => {
            // Assert
            expect(data.length).toEqual(mockData.length);
            // expect(data).toEqual(mockData);
            doneFn();
          }
        });

      // http config
      const url = `${environment.API_URL}/api/v1/products?limit=${limit}&offset=${offset}`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      const params = req.request.params;
      expect(params.get('limit')).toEqual(`${limit}`);
      expect(params.get('offset')).toEqual(`${offset}`);
    });
  });

  describe('tests for create', () => {
    it('should return a new product', (doneFn) => {
      // Arrange
      const mockData = generateOneProduct();
      const dto: CreateProductDTO = {
        title: 'new Product',
        price: 100,
        images: ['img'],
        description: 'bla bla bla',
        categoryId: 12
      }
      // Act
      productsService.create({...dto})
        .subscribe({
          next: (data) => {
            // Assert
            expect(data).toEqual(mockData);
            doneFn();
          }
        });

      // http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      expect(req.request.body).toEqual(dto);
      expect(req.request.method).toEqual('POST');
    });
  });

  describe('tests for update', () => {
    it('should update a product', (doneFn) => {
      // Arrange
      const mockData = generateOneProduct();
      const dto: UpdateProductDTO = {
        title: 'updated Product'
      }
      const productId = '1';
      // Act
      productsService.update(productId, {...dto})
        .subscribe({
          next: (data) => {
            // Assert
            expect(data).toEqual(mockData);
            doneFn();
          }
        });

      // http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(dto);
      req.flush(mockData);
    })
  });

  describe('test for delete', () => {
    it('should delete a product', (doneFn) => {
      // Arrange
      const mockData = true;
      const productId = '1';
      // Act
      productsService.delete(productId)
        .subscribe({
          next: (data) => {
            // Assert
            expect(data).toEqual(mockData);
            doneFn();
          }
        });

      // http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('DELETE');
      req.flush(mockData);
    });
  });

  describe('test for getOne', () => {
    it('should return a product', (doneFn) => {
      // Arrange
      const mockData = generateOneProduct();
      const productId = '1';
      // Act
      productsService.getOne(productId)
        .subscribe({
          next: (data) => {
            // Assert
            expect(data).toEqual(mockData);
            doneFn();
          }
        });

      // http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(mockData);
    });

    it('should return the right msg when the status code is 409', (doneFn) => {
      // Arrange
      const productId = '1';
      const msgError = '409 message';
      const mockError = {
        status: HttpStatusCode.Conflict,
        statusText: msgError
      };
      // Act
      productsService.getOne(productId)
        .subscribe({
          error: (error) => {
            // Assert
            expect(error).toEqual('Algo esta fallando en el server');
            doneFn();
          }
        });

      // http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(msgError, mockError);
    });

    it('should return the right msg when the status code is 404', (doneFn) => {
      // Arrange
      const productId = '1';
      const msgError = '404 message';
      const mockError = {
        status: HttpStatusCode.NotFound,
        statusText: msgError
      };
      // Act
      productsService.getOne(productId)
        .subscribe({
          error: (error) => {
            // Assert
            expect(error).toEqual('El producto no existe');
            doneFn();
          }
        });

      // http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(msgError, mockError);
    });

    it('should return the right msg when the status code is 401', (doneFn) => {
      // Arrange
      const productId = '1';
      const msgError = '401 message';
      const mockError = {
        status: HttpStatusCode.Unauthorized,
        statusText: msgError
      };
      // Act
      productsService.getOne(productId)
        .subscribe({
          error: (error) => {
            // Assert
            expect(error).toEqual('No estas permitido');
            doneFn();
          }
        });

      // http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(msgError, mockError);
    });

    it('should return the default error msg', (doneFn) => {
      // Arrange
      const productId = '1';
      const msgError = '405 message';
      const mockError = {
        status: HttpStatusCode.MethodNotAllowed,
        statusText: msgError
      };
      // Act
      productsService.getOne(productId)
        .subscribe({
          error: (error) => {
            // Assert
            expect(error).toEqual('Ups algo salio mal');
            doneFn();
          }
        });

      // http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(msgError, mockError);
    });
  });
});
