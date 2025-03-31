import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { Request } from 'express';
import { PrismaService } from '@/src/core/prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly prismaService: PrismaService) {}
  create(createFavoriteDto: CreateFavoriteDto, req: Request) {
    if(!req.session.userId) {
      throw new UnauthorizedException()
    }
    return this.prismaService.favorite.create({
      data: {
        bookId: createFavoriteDto.bookId,
        userId: req.session.userId
      }
    })
  }

  remove(id: string, req: Request) {
    if(!req.session.userId) {
      throw new UnauthorizedException()
    }
    return this.prismaService.favorite.delete({
      where: {
        id: id,
        userId: req.session.userId
      }
    })
  }
}
