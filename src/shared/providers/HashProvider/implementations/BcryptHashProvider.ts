import bcrypt from 'bcrypt';

import { ICompareDataDTO } from '../dtos/ICompareDataDTO';
import { IHashProvider } from '../IHashProvider';

export class BcryptHashProvider implements IHashProvider {
  async generateHash(data: string): Promise<string> {
    const hash = await bcrypt.hash(data, 8);

    return hash;
  }

  async compareData({ data, hash }: ICompareDataDTO): Promise<boolean> {
    const dataMatched = await bcrypt.compare(data, hash);

    return dataMatched;
  }
}
