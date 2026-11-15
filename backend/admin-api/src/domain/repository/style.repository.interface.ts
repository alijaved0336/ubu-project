import { IStyle } from '@domain/model/style.interface';

export interface IStyleRepository {
  findAll: () => Promise<IStyle[]>;
}
