import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Video,
    VideoOff,
    Mic,
    MicOff,
    MessageCircle,
    Users,
    Eye,
    Calendar,
    Clock,
    MapPin,
    AlertCircle,
    Play,
    Pause,
    Square
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LiveStream {
    id: string;
    title: string;
    description: string;
    hostId: string;
    hostName: string;
    hostAvatar: string;
    category: 'meeting' | 'event' | 'update' | 'emergency';
    status: 'live' | 'scheduled' | 'ended';
    startTime: Date;
    endTime?: Date;
    location?: string;
    viewers: number;
    participants: number;
    isPrivate: boolean;
    tags: string[];
}

interface LiveMessage {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    message: string;
    timestamp: Date;
    isHost: boolean;
}

export const LiveStreaming = () => {
    const [liveStreams, setLiveStreams] = useState<LiveStream[]>([]);
    const [currentStream, setCurrentStream] = useState<LiveStream | null>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [messages, setMessages] = useState<LiveMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [showCreateStream, setShowCreateStream] = useState(false);
    const [streamTitle, setStreamTitle] = useState("");
    const [streamDescription, setStreamDescription] = useState("");
    const [streamCategory, setStreamCategory] = useState<LiveStream['category']>('update');
    const [streamLocation, setStreamLocation] = useState("");
    const [streamTags, setStreamTags] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    // Mock data
    useEffect(() => {
        const mockStreams: LiveStream[] = [
            {
                id: "1",
                title: "Community Safety Meeting",
                description: "Discussing recent neighborhood safety concerns and upcoming initiatives",
                hostId: "host1",
                hostName: "Officer Sarah Martinez",
                hostAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
                category: "meeting",
                status: "live",
                startTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
                viewers: 156,
                participants: 23,
                isPrivate: false,
                tags: ["safety", "community", "police"]
            },
            {
                id: "2",
                title: "Local Farmers Market Opening",
                description: "Live coverage of the new farmers market opening ceremony",
                hostId: "host2",
                hostName: "Mike Johnson",
                hostAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                category: "event",
                status: "scheduled",
                startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
                location: "Central Park",
                viewers: 0,
                participants: 0,
                isPrivate: false,
                tags: ["market", "local-business", "food"]
            },
            {
                id: "3",
                title: "Emergency Weather Update",
                description: "Important weather information for our neighborhood",
                hostId: "host3",
                hostName: "Weather Service",
                hostAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
                category: "emergency",
                status: "live",
                startTime: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
                viewers: 342,
                participants: 45,
                isPrivate: false,
                tags: ["weather", "emergency", "alert"]
            }
        ];

        setLiveStreams(mockStreams);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleStartStream = () => {
        if (!streamTitle.trim() || !streamDescription.trim()) {
            toast({
                title: "Error",
                description: "Please fill in all required fields",
                variant: "destructive"
            });
            return;
        }

        const newStream: LiveStream = {
            id: Date.now().toString(),
            title: streamTitle,
            description: streamDescription,
            hostId: "currentUser",
            hostName: "You",
            hostAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            category: streamCategory,
            status: "live",
            startTime: new Date(),
            viewers: 0,
            participants: 0,
            isPrivate,
            tags: streamTags.split(",").map(tag => tag.trim()).filter(tag => tag),
            location: streamLocation || undefined
        };

        setLiveStreams(prev => [newStream, ...prev]);
        setCurrentStream(newStream);
        setIsStreaming(true);
        setShowCreateStream(false);
        setStreamTitle("");
        setStreamDescription("");
        setStreamCategory("update");
        setStreamLocation("");
        setStreamTags("");
        setIsPrivate(false);

        toast({
            title: "Live stream started!",
            description: "You're now broadcasting to your neighborhood",
        });
    };

    const handleEndStream = () => {
        if (currentStream) {
            setLiveStreams(prev =>
                prev.map(stream =>
                    stream.id === currentStream.id
                        ? { ...stream, status: 'ended', endTime: new Date() }
                        : stream
                )
            );
        }
        setIsStreaming(false);
        setCurrentStream(null);
        setMessages([]);

        toast({
            title: "Stream ended",
            description: "Your live stream has been ended",
        });
    };

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        const message: LiveMessage = {
            id: Date.now().toString(),
            userId: "currentUser",
            userName: "You",
            userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            message: newMessage,
            timestamp: new Date(),
            isHost: true
        };

        setMessages(prev => [...prev, message]);
        setNewMessage("");
    };

    const getCategoryIcon = (category: LiveStream['category']) => {
        switch (category) {
            case 'meeting': return <Users className="w-4 h-4" />;
            case 'event': return <Calendar className="w-4 h-4" />;
            case 'update': return <MessageCircle className="w-4 h-4" />;
            case 'emergency': return <AlertCircle className="w-4 h-4" />;
            default: return <Video className="w-4 h-4" />;
        }
    };

    const getCategoryColor = (category: LiveStream['category']) => {
        switch (category) {
            case 'meeting': return "bg-blue-100 text-blue-800";
            case 'event': return "bg-green-100 text-green-800";
            case 'update': return "bg-purple-100 text-purple-800";
            case 'emergency': return "bg-red-100 text-red-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusColor = (status: LiveStream['status']) => {
        switch (status) {
            case 'live': return "bg-red-500";
            case 'scheduled': return "bg-yellow-500";
            case 'ended': return "bg-gray-500";
            default: return "bg-gray-500";
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Live Streaming</h2>
                    <p className="text-muted-foreground">Real-time neighborhood updates, meetings, and events</p>
                </div>
                <Dialog open={showCreateStream} onOpenChange={setShowCreateStream}>
                    <DialogTrigger asChild>
                        <Button>
                            <Video className="w-4 h-4 mr-2" />
                            Start Live Stream
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Start Live Stream</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="stream-title">Title *</Label>
                                <Input
                                    id="stream-title"
                                    placeholder="e.g., Community Safety Meeting"
                                    value={streamTitle}
                                    onChange={(e) => setStreamTitle(e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="stream-description">Description *</Label>
                                <Textarea
                                    id="stream-description"
                                    placeholder="What will you be discussing?"
                                    value={streamDescription}
                                    onChange={(e) => setStreamDescription(e.target.value)}
                                    rows={3}
                                />
                            </div>
                            <div>
                                <Label htmlFor="stream-category">Category</Label>
                                <Select value={streamCategory} onValueChange={(value: LiveStream['category']) => setStreamCategory(value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="meeting">Community Meeting</SelectItem>
                                        <SelectItem value="event">Local Event</SelectItem>
                                        <SelectItem value="update">Neighborhood Update</SelectItem>
                                        <SelectItem value="emergency">Emergency Alert</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="stream-location">Location (Optional)</Label>
                                <Input
                                    id="stream-location"
                                    placeholder="e.g., Community Center"
                                    value={streamLocation}
                                    onChange={(e) => setStreamLocation(e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="stream-tags">Tags (Optional)</Label>
                                <Input
                                    id="stream-tags"
                                    placeholder="safety, community, local (comma separated)"
                                    value={streamTags}
                                    onChange={(e) => setStreamTags(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="private-stream"
                                    checked={isPrivate}
                                    onChange={(e) => setIsPrivate(e.target.checked)}
                                />
                                <Label htmlFor="private-stream">Private stream (invite only)</Label>
                            </div>
                            <Button onClick={handleStartStream} className="w-full">
                                Start Broadcasting
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Current Stream Controls */}
            {isStreaming && currentStream && (
                <Card className="border-red-500">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div className={`w-3 h-3 rounded-full ${getStatusColor('live')} animate-pulse`}></div>
                                <CardTitle className="text-lg">LIVE: {currentStream.title}</CardTitle>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Badge variant="secondary">
                                    <Eye className="w-3 h-3 mr-1" />
                                    {currentStream.viewers} viewers
                                </Badge>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsVideoOn(!isVideoOn)}
                                >
                                    {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsMuted(!isMuted)}
                                >
                                    {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={handleEndStream}
                                >
                                    <Square className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {/* Video Area */}
                            <div className="lg:col-span-2">
                                <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
                                    <div className="text-white text-center">
                                        <Video className="w-16 h-16 mx-auto mb-4" />
                                        <p>Live Stream Preview</p>
                                        <p className="text-sm text-gray-400">Camera and microphone controls above</p>
                                    </div>
                                </div>
                            </div>

                            {/* Chat Area */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-semibold">Live Chat</h4>
                                    <Badge variant="secondary">{messages.length} messages</Badge>
                                </div>
                                <div className="h-64 overflow-y-auto border rounded-lg p-3 space-y-2">
                                    {messages.map(message => (
                                        <div key={message.id} className="flex items-start space-x-2">
                                            <Avatar className="w-6 h-6">
                                                <AvatarImage src={message.userAvatar} />
                                                <AvatarFallback>{message.userName[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm font-medium">{message.userName}</span>
                                                    {message.isHost && (
                                                        <Badge variant="outline" className="text-xs">HOST</Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm">{message.message}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {message.timestamp.toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                                <div className="flex space-x-2">
                                    <Input
                                        placeholder="Type a message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    />
                                    <Button onClick={handleSendMessage} size="sm">
                                        Send
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Live Streams List */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Live & Scheduled Streams</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {liveStreams.map(stream => (
                        <Card key={stream.id} className="cursor-pointer hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center space-x-2">
                                        {getCategoryIcon(stream.category)}
                                        <Badge className={getCategoryColor(stream.category)}>
                                            {stream.category}
                                        </Badge>
                                    </div>
                                    <div className={`w-3 h-3 rounded-full ${getStatusColor(stream.status)}`}></div>
                                </div>

                                <h4 className="font-semibold mb-2">{stream.title}</h4>
                                <p className="text-sm text-muted-foreground mb-3">{stream.description}</p>

                                <div className="flex items-center space-x-4 mb-3">
                                    <div className="flex items-center space-x-1">
                                        <Avatar className="w-6 h-6">
                                            <AvatarImage src={stream.hostAvatar} />
                                            <AvatarFallback>{stream.hostName[0]}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm">{stream.hostName}</span>
                                    </div>
                                    {stream.location && (
                                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                            <MapPin className="w-3 h-3" />
                                            <span>{stream.location}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-1">
                                            <Eye className="w-3 h-3" />
                                            <span>{stream.viewers}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Users className="w-3 h-3" />
                                            <span>{stream.participants}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Clock className="w-3 h-3" />
                                        <span>
                                            {stream.status === 'live'
                                                ? 'LIVE NOW'
                                                : stream.startTime.toLocaleDateString()
                                            }
                                        </span>
                                    </div>
                                </div>

                                {stream.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {stream.tags.map(tag => (
                                            <Badge key={tag} variant="outline" className="text-xs">
                                                #{tag}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}; 