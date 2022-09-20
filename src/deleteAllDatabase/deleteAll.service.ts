import { Injectable } from '@nestjs/common';
import { DeleteRepository } from './deleteAll.repository';

@Injectable()
export class DeleteService {
  constructor(protected deleteRepository: DeleteRepository) {
    this.deleteRepository = deleteRepository;
  }
  async deleteUsers(): Promise<boolean> {
    return this.deleteRepository.deleteAlls();
  }
}
