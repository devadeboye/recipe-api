import { SearchFilterDto } from 'src/utils/dtos/search.dto';

export class RecipeSearchDto extends SearchFilterDto {
  public cheap?: boolean;
  public dairyFree?: boolean;
  public glutenFree?: boolean;
  public ketogenic?: boolean;
  public vegan?: boolean;
  public vegetarian?: boolean;
  public veryHealthy?: boolean;
  public veryPopular?: boolean;
}
