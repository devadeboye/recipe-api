import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { EnvConfiguration } from 'src/config/enums/env.configuration';
import {
  FetchRecipeResponse,
  RecipeInformation,
} from 'src/recipe/interfaces/recipe.interface';

@Injectable()
export class SpoonacularService {
  private apiKey: string;
  private baseUrl: string;

  public constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.apiKey = this.configService.get(EnvConfiguration.SPOONACULAR_API_KEY)!;
    this.baseUrl = this.configService.get(
      EnvConfiguration.SPOONACULAR_BASE_URL,
    )!;
  }

  private async get<T>(url: string): Promise<T> {
    const { data } = await firstValueFrom(
      this.httpService.get(url + `&apiKey=${this.apiKey}`),
    );
    return data;
  }

  private async post<T, R>(url: string, payload: T): Promise<R> {
    const { data } = await firstValueFrom(
      this.httpService.post(url + `&apiKey=${this.apiKey}`, payload),
    );
    return data;
  }

  public async fetchRecipes(query: string): Promise<FetchRecipeResponse> {
    const url = `${this.baseUrl}/recipes/complexSearch?${query}&number=20`;
    const recipeList = await this.get<FetchRecipeResponse>(url);
    return recipeList;
  }

  public async fetchRecipeInformation(
    recipeId: number,
  ): Promise<RecipeInformation> {
    const url = `${this.baseUrl}/recipes/${recipeId}/information?`;
    const recipeInfo = await this.get<RecipeInformation>(url);
    return recipeInfo;
  }
}
