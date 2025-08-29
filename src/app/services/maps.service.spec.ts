import { TestBed } from '@angular/core/testing';
import { MapsService } from './maps.service';

describe('MapsService', () => {
  let mapService: MapsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ MapsService ]
    });
    mapService = TestBed.inject(MapsService);
  });

  it('should be created', () => {
    expect(mapService).toBeTruthy();
  });

  describe('test for getCurrentPosition', () => {
    it('should save the center position', () => {
      //Arrange
      spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake((successFn) => {
        const mockGeolocation: GeolocationPosition = {
          coords: {
            accuracy: 0,
            altitude: 0,
            altitudeAccuracy: 0,
            heading: 0,
            latitude: 1000,
            longitude: 2000,
            speed: 0,
          } as GeolocationCoordinates,
          timestamp: 0,
          toJSON: () => {},
        } as GeolocationPosition;
        successFn(mockGeolocation);
      });
      // Act
      mapService.getCurrentPosition();
      // Assert
      expect(mapService.center.lat).toEqual(1000);
      expect(mapService.center.lng).toEqual(2000);
    });

    it('should save the center position new', () => {
      //Arrange
      const mockGeolocation: GeolocationPosition = {
        coords: {
          accuracy: 0,
          altitude: 0,
          altitudeAccuracy: 0,
          heading: 0,
          latitude: 1000,
          longitude: 2000,
          speed: 0,
        } as GeolocationCoordinates,
        timestamp: 0,
        toJSON: () => {},
      } as GeolocationPosition;

      spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake(callback => {
        callback(mockGeolocation);
      });

      // Act
      mapService.getCurrentPosition();
      // Assert
      expect(mapService.center.lat).toEqual(1000);
      expect(mapService.center.lng).toEqual(2000);
    });
  });
});
