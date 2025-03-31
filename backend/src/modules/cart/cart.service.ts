import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { CreateCartDto } from './dto/create-cart.dto';

@Injectable()
export class CartService {
  constructor(private readonly prismaService: PrismaService) {}
  create(dto: CreateCartDto, req: Request) {
    if(!req.session.userId) {
      throw new UnauthorizedException()
    }
    return this.prismaService.cart.create({
      data: {
        bookId: dto.bookId,
        userId: req.session.userId
      }
    })
  }

  remove(id: string, req: Request) {
    if(!req.session.userId) {
      throw new UnauthorizedException()
    }
    return this.prismaService.cart.delete({
      where: {
        id: id,
        userId: req.session.userId
      }
    })
  }
}
