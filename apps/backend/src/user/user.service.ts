import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ){}

  async create(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create(createUserDto);
    return await this.userRepository.save(newUser)
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number, selectOptions = {}) {
    return await this.userRepository.findOne({where: {id: id}, select: selectOptions});
  }

  async findOneByUsername(username: string, selectOptions = {}) {
    return await this.userRepository.findOne({where: {username: username}, select: selectOptions});
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.userRepository.update({id: id}, updateUserDto);
  }

  async remove(id: number) {
    return await this.userRepository.delete({id: id});
  }
}
