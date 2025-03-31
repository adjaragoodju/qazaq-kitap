import { Controller,  Post, Body, Param, Delete, Req } from '@nestjs/common';

import { Request } from 'express';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';


@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  create(@Body() dto: CreateCartDto, @Req() req: Request) {
    return this.cartService.create(dto, req);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.cartService.remove(id, req);
  }
}
