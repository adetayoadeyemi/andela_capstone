export default class User  {
    
    id: string;
    email: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;

    constructor(id: string, email: string, phoneNumber: string) {
        this.id = id;
        this.email = email;
        this.phoneNumber = phoneNumber;
    }

    static fromPersistence(row: any): User {
        if (!row.id || !row.phone_number) throw new Error('Invalid user row');
        return new User(
            row.id,
            row.email,
            row.phone_number ?? undefined
        );
    }

}