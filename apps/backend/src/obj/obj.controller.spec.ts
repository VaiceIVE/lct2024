import { Test, TestingModule } from '@nestjs/testing';
import { ObjController } from './obj.controller';
import { ObjService } from './obj.service';

describe('ObjController', () => {
  let controller: ObjController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ObjController],
      providers: [ObjService],
    }).compile();

    controller = module.get<ObjController>(ObjController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
