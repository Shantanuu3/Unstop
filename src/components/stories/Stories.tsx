import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Camera, Plus, Clock, Star, Users, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Story {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    content: string;
    mediaUrl?: string;
    mediaType: 'image' | 'video';
    createdAt: Date;
    expiresAt: Date;
    isHighlight: boolean;
    highlightTitle?: string;
    views: number;
    reactions: number;
}

interface Highlight {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    title: string;
    coverImage: string;
    stories: Story[];
    createdAt: Date;
}

export const Stories = () => {
    const [stories, setStories] = useState<Story[]>([]);
    const [highlights, setHighlights] = useState<Highlight[]>([]);
    const [selectedStory, setSelectedStory] = useState<Story | null>(null);
    const [showCreateStory, setShowCreateStory] = useState(false);
    const [showCreateHighlight, setShowCreateHighlight] = useState(false);
    const [newStoryContent, setNewStoryContent] = useState("");
    const [newStoryMedia, setNewStoryMedia] = useState<File | null>(null);
    const [newHighlightTitle, setNewHighlightTitle] = useState("");
    const [selectedStoriesForHighlight, setSelectedStoriesForHighlight] = useState<string[]>([]);
    const { toast } = useToast();

    // Mock data
    useEffect(() => {
        const mockStories: Story[] = [
            {
                id: "1",
                userId: "user1",
                userName: "Sarah Johnson",
                userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
                content: "Beautiful sunset in our neighborhood! 🌅",
                mediaUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop",
                mediaType: "image",
                createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
                expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000), // 22 hours left
                isHighlight: false,
                views: 45,
                reactions: 12
            },
            {
                id: "2",
                userId: "user2",
                userName: "Mike Chen",
                userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                content: "Community cleanup day was a success! 🧹",
                mediaUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=600&fit=crop",
                mediaType: "image",
                createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
                expiresAt: new Date(Date.now() + 20 * 60 * 60 * 1000), // 20 hours left
                isHighlight: false,
                views: 78,
                reactions: 23
            }
        ];

        const mockHighlights: Highlight[] = [
            {
                id: "h1",
                userId: "user1",
                userName: "Sarah Johnson",
                userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
                title: "Neighborhood Events",
                coverImage: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=200&h=200&fit=crop",
                stories: mockStories.filter(s => s.userId === "user1"),
                createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            }
        ];

        setStories(mockStories);
        setHighlights(mockHighlights);
    }, []);

    const getTimeRemaining = (expiresAt: Date) => {
        const now = new Date();
        const diff = expiresAt.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return { hours, minutes };
    };

    const getProgressPercentage = (createdAt: Date, expiresAt: Date) => {
        const now = new Date();
        const total = expiresAt.getTime() - createdAt.getTime();
        const elapsed = now.getTime() - createdAt.getTime();
        return Math.min((elapsed / total) * 100, 100);
    };

    const handleCreateStory = () => {
        if (!newStoryContent.trim()) {
            toast({
                title: "Error",
                description: "Please add some content to your story",
                variant: "destructive"
            });
            return;
        }

        const newStory: Story = {
            id: Date.now().toString(),
            userId: "currentUser",
            userName: "You",
            userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            content: newStoryContent,
            mediaUrl: newStoryMedia ? URL.createObjectURL(newStoryMedia) : undefined,
            mediaType: newStoryMedia?.type.startsWith('video/') ? 'video' : 'image',
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            isHighlight: false,
            views: 0,
            reactions: 0
        };

        setStories(prev => [newStory, ...prev]);
        setNewStoryContent("");
        setNewStoryMedia(null);
        setShowCreateStory(false);

        toast({
            title: "Story created!",
            description: "Your story will be visible for 24 hours",
        });
    };

    const handleCreateHighlight = () => {
        if (!newHighlightTitle.trim() || selectedStoriesForHighlight.length === 0) {
            toast({
                title: "Error",
                description: "Please add a title and select stories for your highlight",
                variant: "destructive"
            });
            return;
        }

        const newHighlight: Highlight = {
            id: Date.now().toString(),
            userId: "currentUser",
            userName: "You",
            userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            title: newHighlightTitle,
            coverImage: stories.find(s => selectedStoriesForHighlight.includes(s.id))?.mediaUrl || "",
            stories: stories.filter(s => selectedStoriesForHighlight.includes(s.id)),
            createdAt: new Date()
        };

        setHighlights(prev => [newHighlight, ...prev]);
        setNewHighlightTitle("");
        setSelectedStoriesForHighlight([]);
        setShowCreateHighlight(false);

        toast({
            title: "Highlight created!",
            description: "Your highlight reel is now permanent",
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewStoryMedia(file);
        }
    };

    return (
        <div className="space-y-6">
            {/* Stories Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Stories & Highlights</h2>
                    <p className="text-muted-foreground">Share moments that disappear in 24 hours or save them forever</p>
                </div>
                <div className="flex gap-2">
                    <Dialog open={showCreateStory} onOpenChange={setShowCreateStory}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                New Story
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Create New Story</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="story-content">What's happening?</Label>
                                    <Textarea
                                        id="story-content"
                                        placeholder="Share what's happening in your neighborhood..."
                                        value={newStoryContent}
                                        onChange={(e) => setNewStoryContent(e.target.value)}
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="story-media">Add Photo/Video (Optional)</Label>
                                    <Input
                                        id="story-media"
                                        type="file"
                                        accept="image/*,video/*"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="w-4 h-4" />
                                    <span>Story will disappear in 24 hours</span>
                                </div>
                                <Button onClick={handleCreateStory} className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
                                    Share Your Story
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={showCreateHighlight} onOpenChange={setShowCreateHighlight}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <Star className="w-4 h-4 mr-2" />
                                Create Highlight
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Create Highlight Reel</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="highlight-title">Highlight Title</Label>
                                    <Input
                                        id="highlight-title"
                                        placeholder="e.g., Neighborhood Events, Local Businesses..."
                                        value={newHighlightTitle}
                                        onChange={(e) => setNewHighlightTitle(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label>Select Stories to Include</Label>
                                    <div className="space-y-2 max-h-40 overflow-y-auto">
                                        {stories.map(story => (
                                            <div key={story.id} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id={story.id}
                                                    checked={selectedStoriesForHighlight.includes(story.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedStoriesForHighlight(prev => [...prev, story.id]);
                                                        } else {
                                                            setSelectedStoriesForHighlight(prev => prev.filter(id => id !== story.id));
                                                        }
                                                    }}
                                                />
                                                <label htmlFor={story.id} className="text-sm">
                                                    {story.content.substring(0, 50)}...
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <Button onClick={handleCreateHighlight} className="w-full">
                                    Create Highlight
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Active Stories */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Active Stories</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stories.map(story => {
                        const timeRemaining = getTimeRemaining(story.expiresAt);
                        const progress = getProgressPercentage(story.createdAt, story.expiresAt);

                        return (
                            <Card key={story.id} className="cursor-pointer hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                    <div className="flex items-start space-x-3">
                                        <Avatar className="w-10 h-10">
                                            <AvatarImage src={story.userAvatar} />
                                            <AvatarFallback>{story.userName[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <p className="font-medium text-sm">{story.userName}</p>
                                                <Badge variant="secondary" className="text-xs">
                                                    {timeRemaining.hours}h {timeRemaining.minutes}m left
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">{story.content}</p>
                                            {story.mediaUrl && (
                                                <div className="mt-2">
                                                    <img
                                                        src={story.mediaUrl}
                                                        alt="Story media"
                                                        className="w-full h-32 object-cover rounded-md"
                                                    />
                                                </div>
                                            )}
                                            <div className="mt-3">
                                                <Progress value={progress} className="h-1" />
                                                <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <Eye className="w-3 h-3" />
                                                        {story.views} views
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Users className="w-3 h-3" />
                                                        {story.reactions} reactions
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* Highlights */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Highlight Reels</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {highlights.map(highlight => (
                        <Card key={highlight.id} className="cursor-pointer hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                                <div className="aspect-square mb-3">
                                    <img
                                        src={highlight.coverImage}
                                        alt={highlight.title}
                                        className="w-full h-full object-cover rounded-md"
                                    />
                                </div>
                                <div className="flex items-center space-x-2 mb-2">
                                    <Avatar className="w-6 h-6">
                                        <AvatarImage src={highlight.userAvatar} />
                                        <AvatarFallback>{highlight.userName[0]}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-medium">{highlight.userName}</span>
                                </div>
                                <h4 className="font-semibold text-sm">{highlight.title}</h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                    <span>Downtown District</span>
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}; 