import mongoose from 'mongoose';

// type User = {
//   id: string;
//   accountData: {
//     email: string;
//     login: string;
//     passwordHash: string;
//     passwordSalt: string;
//     createdAt: Date;
//   };
//   emailConfirmation: {
//     isConfirmed: boolean;
//     confirmationCode: string;
//     expirationDate: Date;
//   };
// };

type CreateUserDto = {
  login: string;
  password: string;
  email: string;
};

export const usersStub = (
  email: string,
  password: string,
  login: string,
): CreateUserDto => {
  return {
    login,
    password,
    email,
  };
};
