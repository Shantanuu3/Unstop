import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  Search,
  MoreVertical,
  Package,
  Briefcase,
  Clock,
} from "lucide-react";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

interface Conversation {
  id: string;
  participant: {
    name: string;
    avatar: string;
    isOnline: boolean;
  };
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  type: "marketplace" | "service" | "general";
  relatedItem?: {
    title: string;
    image?: string;
  };
}

export const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>("1");
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      participant: {
        name: "Alex Kim",
        avatar: "/placeholder-avatar.jpg",
        isOnline: true,
      },
      lastMessage: "Is the MacBook still available?",
      lastMessageTime: "2m ago",
      unreadCount: 2,
      type: "marketplace",
      relatedItem: {
        title: "MacBook Pro 13\" 2020",
        image: "/placeholder-laptop.jpg",
      },
    },
    {
      id: "2",
      participant: {
        name: "Dr. Emily Chen",
        avatar: "/placeholder-tutor.jpg",
        isOnline: false,
      },
      lastMessage: "Perfect! I'll see you tomorrow at 4 PM.",
      lastMessageTime: "1h ago",
      unreadCount: 0,
      type: "service",
      relatedItem: {
        title: "Math & Science Tutoring",
      },
    },
    {
      id: "3",
      participant: {
        name: "Sarah Johnson",
        avatar: "/placeholder-avatar.jpg",
        isOnline: true,
      },
      lastMessage: "Thanks for organizing the BBQ!",
      lastMessageTime: "3h ago",
      unreadCount: 1,
      type: "general",
    },
  ]);

  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({
    "1": [
      {
        id: "1",
        sender: "Alex Kim",
        content: "Hi! I'm interested in the MacBook Pro you posted. Is it still available?",
        timestamp: "2:30 PM",
        isOwn: false,
      },
      {
        id: "2",
        sender: "You",
        content: "Yes, it's still available! It's in excellent condition, barely used.",
        timestamp: "2:32 PM",
        isOwn: true,
      },
      {
        id: "3",
        sender: "Alex Kim",
        content: "Great! Could we meet up tomorrow to take a look at it?",
        timestamp: "2:35 PM",
        isOwn: false,
      },
    ],
    "2": [
      {
        id: "1",
        sender: "Dr. Emily Chen",
        content: "Hello! I received your booking request for tomorrow at 4 PM. I'm confirming the session.",
        timestamp: "1:00 PM",
        isOwn: false,
      },
      {
        id: "2",
        sender: "You",
        content: "Perfect! I need help with calculus derivatives. Should I bring anything specific?",
        timestamp: "1:15 PM",
        isOwn: true,
      },
      {
        id: "3",
        sender: "Dr. Emily Chen",
        content: "Just bring your textbook and any specific problems you're struggling with. Perfect! I'll see you tomorrow at 4 PM.",
        timestamp: "1:20 PM",
        isOwn: false,
      },
    ],
    "3": [
      {
        id: "1",
        sender: "Sarah Johnson",
        content: "Thanks for organizing the BBQ! Everyone had such a great time.",
        timestamp: "11:00 AM",
        isOwn: false,
      },
    ],
  });

  const typeIcons = {
    marketplace: Package,
    service: Briefcase,
    general: Send,
  };

  const typeColors = {
    marketplace: "bg-blue-100 text-blue-800",
    service: "bg-green-100 text-green-800",
    general: "bg-gray-100 text-gray-800",
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: "You",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
    };

    setMessages(prev => ({
      ...prev,
      [selectedConversation]: [...(prev[selectedConversation] || []), message]
    }));

    // Update conversation list
    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation 
        ? { ...conv, lastMessage: newMessage, lastMessageTime: "Just now" }
        : conv
    ));

    setNewMessage("");
  };

  const selectedConv = conversations.find(c => c.id === selectedConversation);
  const conversationMessages = selectedConversation ? messages[selectedConversation] || [] : [];

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-background">
      {/* Conversations List */}
      <div className="w-80 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h1 className="text-2xl font-bold mb-4">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {filteredConversations.map((conversation) => {
              const TypeIcon = typeIcons[conversation.type];
              const isSelected = selectedConversation === conversation.id;
              
              return (
                <Card 
                  key={conversation.id}
                  className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                    isSelected ? "bg-muted" : ""
                  }`}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={conversation.participant.avatar} />
                          <AvatarFallback>
                            {conversation.participant.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        {conversation.participant.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold truncate">{conversation.participant.name}</h4>
                          <div className="flex items-center space-x-2">
                            {conversation.unreadCount > 0 && (
                              <Badge className="bg-destructive text-destructive-foreground">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {conversation.lastMessageTime}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground truncate mt-1">
                          {conversation.lastMessage}
                        </p>
                        
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge className={typeColors[conversation.type]} variant="secondary">
                            <TypeIcon className="w-3 h-3 mr-1" />
                            {conversation.type}
                          </Badge>
                          
                          {conversation.relatedItem && (
                            <span className="text-xs text-muted-foreground truncate">
                              Re: {conversation.relatedItem.title}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConv ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={selectedConv.participant.avatar} />
                      <AvatarFallback>
                        {selectedConv.participant.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    {selectedConv.participant.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border border-background"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{selectedConv.participant.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>{selectedConv.participant.isOnline ? "Online" : "Offline"}</span>
                      {selectedConv.relatedItem && (
                        <>
                          <span>•</span>
                          <span>{selectedConv.relatedItem.title}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {conversationMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${message.isOwn ? "flex-row-reverse space-x-reverse" : ""}`}>
                      {!message.isOwn && (
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={selectedConv.participant.avatar} />
                          <AvatarFallback className="text-xs">
                            {selectedConv.participant.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className={`rounded-lg px-3 py-2 ${
                        message.isOwn 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted"
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <div className={`flex items-center space-x-1 mt-1 ${
                          message.isOwn ? "justify-end" : "justify-start"
                        }`}>
                          <Clock className="w-3 h-3 opacity-70" />
                          <span className={`text-xs opacity-70`}>
                            {message.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-border">
              <div className="flex space-x-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No conversation selected</h3>
              <p className="text-muted-foreground">
                Choose a conversation from the list to start chatting.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};