export default interface ProcessMessageDto {
    messages:Array<{
        senderType: 'user' | 'assistant' | 'tool',
        message: string,
        toolCallId?: string,
        toolCalls?: Array<{
            id: string,
            tool_name: string,
            arguments: any
        }>
    }>;
    userDetails: {
        id: string;
        email: string;
        phoneNumber?: string;
        firstName?: string;
        lastName?: string;
    }
}
