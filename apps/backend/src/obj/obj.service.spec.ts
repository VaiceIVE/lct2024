import { Test, TestingModule } from '@nestjs/testing';
import { ObjService } from './obj.service';

describe('ObjService', () => {
  let service: ObjService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ObjService],
    }).compile();

    service = module.get<ObjService>(ObjService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
