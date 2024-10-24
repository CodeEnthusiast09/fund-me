import { Base } from "./global";

export interface News extends Base {
  title: string;
  content: string;
  thumbnail: string;
  categoryId: number;
}

export interface NewsCategories extends Base {
  name: string;
}
