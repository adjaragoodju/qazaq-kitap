import { Injectable, UnauthorizedException } from '@nestjs/common';

import { Request } from 'express';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { Book } from '@prisma/client';


@Injectable()
export class BooksService {
  constructor(private readonly prismaService: PrismaService) {}

  public async getBooks(): Promise<Book[]> {
  
    const books = await this.prismaService.book.findMany({
      include: {
        author: true,
        genre: {select: {name: true}}
      }
    })

    return books;
  }

  public async getBookId(id: string): Promise<Book | null> {
    const book = await this.prismaService.book.findUnique({
      where: {
        id: id,
      },
      include: {
        author: true,
        genre: {select: {name: true}}
      }
    });
    return book ? book : null;
  }
}
