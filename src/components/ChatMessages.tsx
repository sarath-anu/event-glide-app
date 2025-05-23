
import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Message } from "@/pages/CommunityChat";
import { format } from "date-fns";
import { useLanguage } from "@/hooks/useLanguage";

interface ChatMessagesProps {
  messages: Message[];
}

export const ChatMessages = ({ messages }: ChatMessagesProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-4">
      {messages.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {t('noMessages')}
        </div>
      ) : (
        messages.map((message) => (
          <div key={message.id} className="flex gap-3">
            <Avatar>
              <img
                src={message.avatar}
                alt={message.author}
                className="h-10 w-10 rounded-full"
              />
            </Avatar>
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="font-medium">{message.author}</span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(message.timestamp), "h:mm a")}
                </span>
              </div>
              <p className="text-sm mt-1">{message.content}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
