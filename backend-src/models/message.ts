export interface Message {
    roomId: string;
    content: string;
    sender: string;
    timestamp: Date | string; // Allow both Date and string for flexibility
  }