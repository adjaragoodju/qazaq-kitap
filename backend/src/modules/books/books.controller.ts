import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';

import { BooksService } from './books.service';
import { Public } from '@/src/shared/decorators/public.decorator';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Public()
  @Get()
  public async findAll() {
    return this.booksService.getBooks();
  }

  @Public()
  @Get(':id')
  public async findOne(@Param('id') id: string) {
    return this.booksService.getBookId(id);
  }

  
}
