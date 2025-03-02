export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
}

export type FullUserForm = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
};
