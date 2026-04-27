import { CreateAuthUserWithPhoneNumberInput } from "../dto/create-auth-user-with-phone-number";

export interface AuthProvider {
  createAuthUserWithPhoneNumber(input: CreateAuthUserWithPhoneNumberInput): Promise<string>;
}