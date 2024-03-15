import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { PrismaClient } from '@prisma/client';

describe('MoviesService', () => {
  let service: MoviesService;
  let prismaClientMock: any;

  beforeEach(async () => {
    prismaClientMock = {
      movie: {
        count: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: PrismaClient,
          useValue: prismaClientMock,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  describe('getMovies', () => {
    it('should return movies for a valid page', async () => {
      prismaClientMock.movie.count.mockResolvedValue(100); // Assuming there are 100 movies
      prismaClientMock.movie.findMany.mockResolvedValue(['movie1', 'movie2']); // Mock response

      const movies = await service.getMovies(3);
      expect(movies).toEqual(['movie1', 'movie2']);
      expect(prismaClientMock.movie.count).toHaveBeenCalled();
      expect(prismaClientMock.movie.findMany).toHaveBeenCalledWith({
        skip: 40,
        take: 60,
      });
    });

    it('should throw BadRequestException for an invalid page', async () => {
      prismaClientMock.movie.count.mockResolvedValue(5); // Only 5 movies available

      await expect(service.getMovies(0)).rejects.toThrow(BadRequestException);
      await expect(service.getMovies(-1)).rejects.toThrow(BadRequestException);
      await expect(service.getMovies(999999)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getMovieById', () => {
    it('should return a movie for a valid ID', async () => {
      prismaClientMock.movie.findUnique.mockResolvedValue({
        id: '1',
        name: 'Test Movie',
      });

      const movie = await service.getMovieById('1');
      expect(movie).toEqual({ id: '1', name: 'Test Movie' });
      expect(prismaClientMock.movie.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw BadRequestException for an invalid ID', async () => {
      prismaClientMock.movie.findUnique.mockResolvedValue(null);

      await expect(service.getMovieById('')).rejects.toThrow(BadRequestException);
      await expect(service.getMovieById('invalid-id')).rejects.toThrow(BadRequestException);
      await expect(service.getMovieById('999')).rejects.toThrow(BadRequestException);
    });
  });
});