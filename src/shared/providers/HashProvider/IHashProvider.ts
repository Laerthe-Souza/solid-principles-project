import { ICompareDataDTO } from './dtos/ICompareDataDTO';

export interface IHashProvider {
  generateHash(password: string): Promise<string>;
  compareData(data: ICompareDataDTO): Promise<boolean>;
}
