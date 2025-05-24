import { Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { FavouriteService } from '../services/favourite.service';
import {
  TokenDataDecorator,
  UseToken,
} from 'src/utils/decorators/tokenData.decoration';
import { TokenDto } from 'src/auth/dtos/token.dto';
import { Favourite } from '../models/favourite.model';
import { JoiNumberValidationPipe } from 'src/utils/pipes/validation.pipe';
import { addFavouriteValidator } from '../validators/favourite.validator';

@Controller('favourite')
export class FavouriteController {
  public constructor(private readonly favouriteService: FavouriteService) {}

  @Post('/:recipe')
  @UseToken()
  public addFavourite(
    @Param('recipe', new JoiNumberValidationPipe(addFavouriteValidator))
    recipe: string,
    @TokenDataDecorator() tokenData: TokenDto,
  ): Promise<Favourite> {
    Logger.debug('Received request to add favourite');
    return this.favouriteService.addFavourite(tokenData.id, recipe);
  }

  @Get('')
  @UseToken()
  public fetchFavourites(
    @TokenDataDecorator() tokenData: TokenDto,
  ): Promise<Favourite[]> {
    Logger.log('Received request to fetch favourites');
    return this.favouriteService.fetchFavourites(tokenData.id);
  }
}
