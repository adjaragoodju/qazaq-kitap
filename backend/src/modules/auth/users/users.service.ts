import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { hash } from 'argon2';
import { User } from '@prisma/client';


@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  public async create(dto: CreateUserDto): Promise<{user: Pick<User, 'username' | 'email'>}> {
    const { email, username, password } = dto;

    const isUsernameExists = await this.prismaService.user.findUnique({
      where: { username: username },
    });

    if (isUsernameExists) {
      throw new ConflictException('This username is already taken');
    }

    const isEmailExists = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });

    if (isEmailExists) {
      throw new ConflictException('This email is already taken');
    }

   const {username: newUserName, email: newUserEmail} =  await this.prismaService.user.create({
      data: {
        username: username,
        email: email,
        password: await hash(password),
      },
    });

    return {user: {username: newUserName, email:newUserEmail}};
  }

  public async findById(id: string): Promise<User> {
    const user = await this.prismaService.user.findUniqueOrThrow({
      where: { id: id },
      include: {
        Favorite:{include: {Book: {include: {genre:true, author: true}}}},
        Cart: {include: {Book: {include: {genre:true, author: true}}}},
      }
    });
    return user;
  }

  public async findByLogin(login: string): Promise<User | null> {
    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [
          {
            email: { equals: login },
          },
          {
            username: { equals: login },
          },
        ],
      },
    });
    return user;
  }
}
