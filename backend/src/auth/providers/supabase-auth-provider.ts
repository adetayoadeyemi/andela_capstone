// auth/providers/supabase-auth.provider.ts

import axios from 'axios';
import { AuthProvider } from '../interfaces/auth-provider.interface';
import { CreateAuthUserWithPhoneNumberInput } from '../dto/create-auth-user-with-phone-number';

export class SupabaseAuthProvider implements AuthProvider {
    
  private baseUrl = process.env.SUPABASE_URL;
  private serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  async createAuthUserWithPhoneNumber(input: CreateAuthUserWithPhoneNumberInput): Promise<string> {
    try{
      console.log('Creating auth user with phone number:', input.phoneNumber);
      const res = await axios.post(`${this.baseUrl}/auth/v1/admin/users`,{
          phone: input.phoneNumber,
          phone_confirm: true,
        },
        {
          headers: {
            apikey: this.serviceKey,
            Authorization: `Bearer ${this.serviceKey}`,
          },
        }
      );
      return res.data.id;
    }catch(error){
      throw error
    }
  }
}