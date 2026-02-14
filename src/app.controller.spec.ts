import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthCheckService, PrismaHealthIndicator } from '@nestjs/terminus';
import { PrismaService } from './infra/database/prisma';

describe('AppController', () => {
  let controller: AppController;

  const mockHealthCheckService = {
    check: jest.fn().mockResolvedValue({ status: 'ok', info: { database: { status: 'up' } } }),
  };
  const mockPrismaHealth = { pingCheck: jest.fn() };
  const mockPrisma = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        { provide: HealthCheckService, useValue: mockHealthCheckService },
        { provide: PrismaHealthIndicator, useValue: mockPrismaHealth },
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  describe('getHello', () => {
    it('should return a welcome message', () => {
      const result = controller.getHello();
      expect(result).toContain('NestJS');
    });
  });

  describe('getHealth', () => {
    it('should call health.check', async () => {
      await controller.getHealth();
      expect(mockHealthCheckService.check).toHaveBeenCalled();
    });
  });
});
