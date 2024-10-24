import { Base } from "./global";

export interface Events extends Base {
  title: string;
  description: string;
  thumbnail: string;
  categoryId: number;
  location: string;
  datetime: string;
  registrationDeadline: string;
}
