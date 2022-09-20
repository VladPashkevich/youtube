// import {
//   Injectable,
//   CanActivate,
//   ExecutionContext,
//   HttpException,
// } from '@nestjs/common';
// import { Request } from 'express';
// import mongoose from 'mongoose';

// @Injectable()
// export class MongoIdGuard implements CanActivate {
//   /* constructor() {} */
//   canActivate(context: ExecutionContext): boolean {
//     const req: Request = context.switchToHttp().getRequest();
//     (param: string) => {
//       const id = req.params?.[param] ? req.params?.[param] : req.body?.[param];
//       try {
//         new mongoose.Types.ObjectId(id);
//         return true;
//       } catch (e) {
//         throw new HttpException(
//           {
//             errorsMessages: [{ message: 'Invalid id', field: 'id' }],
//           },
//           400,
//         );
//       }
//     };
//     return true;
//   }
// }

import {
  ArgumentMetadata,
  BadRequestException,
  HttpException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';

@Injectable()
export class ValidateMongoId implements PipeTransform<string> {
  transform(value: string): string {
    // Optional casting into ObjectId if wanted!
    if (ObjectId.isValid(value)) {
      if (String(new ObjectId(value)) === value) return value;
      //     throw new HttpException(
      //       {
      //         errorsMessages: [{ message: 'Invalid id', field: 'id' }],
      //       },
      //       400,
      //     );
      //   }
      //   throw new HttpException(
      //     {
      //       errorsMessages: [{ message: 'Invalid id', field: 'id' }],
      //     },
      //     400,
      //   );
      // }
      throw new BadRequestException([{ message: 'Invalid id', field: 'id' }]);
    }
    throw new BadRequestException([{ message: 'Invalid id', field: 'id' }]);
  }
}
