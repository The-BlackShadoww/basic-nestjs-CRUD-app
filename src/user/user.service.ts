import { Injectable, Inject } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DATABASE_CONNECTION } from '../db/database.module';
import { usersTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

@Injectable()
export class UserService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<any>,
  ) {}

  async create(dto: CreateUserDto) {
    const [user] = await this.db.insert(usersTable).values(dto).returning();
    return user;
  }

  findAll() {
    return this.db.select().from(usersTable);
  }

  async findOne(id: number) {
    const [user] = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id));
    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    const [user] = await this.db
      .update(usersTable)
      .set(dto)
      .where(eq(usersTable.id, id))
      .returning();
    return user;
  }

  async remove(id: number) {
    const [user] = await this.db
      .delete(usersTable)
      .where(eq(usersTable.id, id))
      .returning();
    return user;
  }
}
