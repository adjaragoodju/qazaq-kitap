import { Controller,  Post, Body, Param, Delete, Req } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { Request } from 'express';


@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  create(@Body() createFavoriteDto: CreateFavoriteDto, @Req() req: Request) {
    return this.favoritesService.create(createFavoriteDto, req);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.favoritesService.remove(id, req);
  }
}
