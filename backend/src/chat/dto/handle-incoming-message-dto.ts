export default interface HandleIncomingMessageDto {
    userDetails: {
        id: string;
        email: string;
        phoneNumber?: string;
        firstName?: string;
        lastName?: string;
    };
    message: string;
}