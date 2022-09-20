import { Controller, Delete, HttpCode } from '@nestjs/common';
import { DeleteService } from './deleteAll.service';

@Controller('testing')
export class DeleteController {
  constructor(protected deleteService: DeleteService) {}
  @Delete('/all-data')
  @HttpCode(204)
  deleteAllDataBase() {
    return this.deleteService.deleteUsers();
  }
}
