import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPDB, IPDocument } from '../../infrastructure/db';
@Injectable()
export class Mistake429guard implements CanActivate {
  constructor(
    @InjectModel(IPDB.name)
    private IPModel: Model<IPDocument>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const point = req.method + req.originalUrl;
    const ip = req.ip;
    const newCrud = {
      point: point,
      ip: ip,
      data: new Date(),
    };
    await this.IPModel.insertMany(newCrud);

    const fromData = new Date();
    fromData.setSeconds(fromData.getSeconds() - 10);
    const totalCount = await this.IPModel.countDocuments({
      point: point,
      ip: ip,
      data: { $gt: fromData },
    });

    if (totalCount > 5) {
      throw new UnauthorizedException();
    } else {
      return true;
    }
  }
}
