import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { BadRequestException } from '@nestjs/common';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: {
            getMovies: jest.fn(),
            getMovieById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  describe('getAllMovies', () => {
    it('should return a list of movies for a valid page number', async () => {
      const result = [
        {
          id: '1',
          title: 'Test Movie 1',
          description: 'Test Description 1',
          duration: 120,
          releaseYear: 2001,
          imageUrl: 'test1.com',
          genreId: 1
        },
        {
          id: '2',
          title: 'Test Movie 2',
          description: 'Test Description 2',
          duration: 90,
          releaseYear: 2002,
          imageUrl: 'test2.com',
          genreId: 2
        }
      ];
      jest.spyOn(service, 'getMovies').mockImplementation(async () => result);
    
      expect(await controller.getAllMovies(1)).toBe(result);
    });

    it('should throw an error for an invalid page number', async () => {
      jest.spyOn(service, 'getMovies').mockImplementation(async () => {
        throw new BadRequestException();
      });

      await expect(controller.getAllMovies(-1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getMovieById', () => {
    it('should return a movie for a valid id', async () => {
      const result = {
        id: '1',
        title: 'Test Movie',
        description: 'Test Description',
        duration: 90,
        imageUrl: 'test.com',
        releaseYear: 2000,
        genreId: 1
      };
      jest
        .spyOn(service, 'getMovieById')
        .mockImplementation(async () => result);

      expect(await controller.getMovieById('1')).toBe(result);
    });
  });
});
