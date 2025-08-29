import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";

import { environment } from './../../environments/environment';

import { AuthService } from './auth.service';
import { TokenService } from "./token.service";
import { Auth } from "../models/auth.model";

describe('AuthService', () => {
  let authService: AuthService;
  let httpController: HttpTestingController;
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        TokenService
      ]
    });
    authService = TestBed.inject(AuthService);
    httpController = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  describe('test for login', () => {
    it('should return a token', (doneFn) => {
      // Arrange
      const mockData: Auth = {
        access_token: '121212'
      }
      const email = 'test@example.com';
      const password = '1212';

      // Act
      authService.login(email, password)
        .subscribe({
          next: (data) => {
            // Assert
            expect(data).toEqual(mockData);
            doneFn();
          }
        });

      // http config
      const url = `${environment.API_URL}/api/v1/auth/login`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
    });

    it('should call to saveToken', (doneFn) => {
      // Arrange
      const mockData: Auth = {
        access_token: '121212'
      }
      const email = 'test@example.com';
      const password = '1212';
      spyOn(tokenService, 'saveToken').and.callThrough();

      // Act
      authService.login(email, password)
        .subscribe({
          next: (data) => {
            // Assert
            expect(data).toEqual(mockData);
            expect(tokenService.saveToken).toHaveBeenCalledTimes(1);
            expect(tokenService.saveToken).toHaveBeenCalledWith('121212');
            doneFn();
          }
        });

      // http config
      const url = `${environment.API_URL}/api/v1/auth/login`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
    });
  });
});
