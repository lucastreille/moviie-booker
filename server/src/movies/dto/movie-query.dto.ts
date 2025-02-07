export enum MovieSortOption {
    POPULARITY_DESC = 'popularity.desc',
    POPULARITY_ASC = 'popularity.asc',
    RELEASE_DATE_DESC = 'release_date.desc',
    RELEASE_DATE_ASC = 'release_date.asc',
  }
  
export interface MovieQueryDto {
    page?: number;
    search?: string;
    sort?: MovieSortOption;
}