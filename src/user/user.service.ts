import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  // CREATE
  async create(dto: CreateUserDto) {
    return this.prisma.user.create({ data: dto });
  }

  // READ ALL
  async findAll() {
    return this.prisma.user.findMany();
  }

  // READ ONE
  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  // UPDATE
  async update(id: number, dto: UpdateUserDto) {
    // First, check if user exists
    await this.findOne(id);

    return this.prisma.user.update({
      where: { id },
      data: dto,
    });
  }

  // DELETE
  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.user.delete({ where: { id } });
    return { success: true };
  }
}
