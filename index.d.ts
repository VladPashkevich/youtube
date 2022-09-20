import { UserRequestType } from 'src/users/Types/usersTypes';

// declare global {
//   declare namespace Express {
//     export interface RequestWithUser {
//       user: UserRequestType | null;
//     }
//   }
// }

export type RequestWithUser = Request & { user: UserRequestType | null };
