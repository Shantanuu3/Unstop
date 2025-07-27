import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    BarChart3,
    Vote,
    Users,
    Clock,
    Calendar,
    TrendingUp,
    MessageCircle,
    Share2,
    Plus,
    CheckCircle,
    AlertCircle,
    Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PollOption {
    id: string;
    text: string;
    votes: number;
    percentage: number;
    voters: string[];
}

interface Poll {
    id: string;
    title: string;
    description: string;
    creatorId: string;
    creatorName: string;
    creatorAvatar: string;
    category: 'community' | 'safety' | 'development' | 'events' | 'general';
    type: 'single' | 'multiple';
    options: PollOption[];
    totalVotes: number;
    status: 'active' | 'closed' | 'draft';
    startDate: Date;
    endDate?: Date;
    isAnonymous: boolean;
    allowComments: boolean;
    tags: string[];
    comments: PollComment[];
}

interface PollComment {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    comment: string;
    timestamp: Date;
}

export const NeighborhoodPolls = () => {
    const [polls, setPolls] = useState<Poll[]>([]);
    const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);
    const [showCreatePoll, setShowCreatePoll] = useState(false);
    const [showVoteDialog, setShowVoteDialog] = useState(false);
    const [pollTitle, setPollTitle] = useState("");
    const [pollDescription, setPollDescription] = useState("");
    const [pollCategory, setPollCategory] = useState<Poll['category']>('general');
    const [pollType, setPollType] = useState<Poll['type']>('single');
    const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);
    const [pollTags, setPollTags] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [allowComments, setAllowComments] = useState(true);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [commentText, setCommentText] = useState("");
    const { toast } = useToast();

    // Check if user has already voted on a poll
    const checkUserVote = async (pollId: string) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return false;

            const { data, error } = await supabase
                .from('poll_votes')
                .select('*')
                .eq('poll_id', pollId)
                .eq('user_id', user.id)
                .single();

            return !error && data;
        } catch (error) {
            return false;
        }
    };

    // Mock data
    useEffect(() => {
        const mockPolls: Poll[] = [
            {
                id: "1",
                title: "Should we install speed bumps on Oak Street?",
                description: "Residents have expressed concerns about speeding vehicles on Oak Street. This poll will help determine if speed bumps should be installed.",
                creatorId: "user1",
                creatorName: "Sarah Johnson",
                creatorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
                category: "safety",
                type: "single",
                options: [
                    { id: "1", text: "Yes, install speed bumps", votes: 45, percentage: 60, voters: [] },
                    { id: "2", text: "No, find alternative solutions", votes: 30, percentage: 40, voters: [] }
                ],
                totalVotes: 75,
                status: "active",
                startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
                endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
                isAnonymous: false,
                allowComments: true,
                tags: ["safety", "traffic", "infrastructure"],
                comments: [
                    {
                        id: "c1",
                        userId: "user2",
                        userName: "Mike Chen",
                        userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                        comment: "Speed bumps would definitely help with the speeding issue. I see cars going way too fast every day.",
                        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
                    }
                ]
            },
            {
                id: "2",
                title: "Which community events should we prioritize this year?",
                description: "Select up to 3 events that you'd like to see the neighborhood association organize this year.",
                creatorId: "user3",
                creatorName: "Community Association",
                creatorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
                category: "events",
                type: "multiple",
                options: [
                    { id: "1", text: "Summer Block Party", votes: 67, percentage: 45, voters: [] },
                    { id: "2", text: "Neighborhood Cleanup Day", votes: 89, percentage: 60, voters: [] },
                    { id: "3", text: "Local Business Fair", votes: 34, percentage: 23, voters: [] },
                    { id: "4", text: "Holiday Lighting Contest", votes: 56, percentage: 38, voters: [] },
                    { id: "5", text: "Community Garden Project", votes: 78, percentage: 52, voters: [] }
                ],
                totalVotes: 148,
                status: "active",
                startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
                endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                isAnonymous: false,
                allowComments: true,
                tags: ["events", "community", "planning"],
                comments: []
            },
            {
                id: "3",
                title: "Should we implement a neighborhood watch program?",
                description: "A neighborhood watch program would involve regular patrols and communication about safety concerns.",
                creatorId: "user4",
                creatorName: "Officer Martinez",
                creatorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
                category: "safety",
                type: "single",
                options: [
                    { id: "1", text: "Yes, I support a neighborhood watch", votes: 123, percentage: 82, voters: [] },
                    { id: "2", text: "No, I don't think it's necessary", votes: 27, percentage: 18, voters: [] }
                ],
                totalVotes: 150,
                status: "closed",
                startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
                endDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
                isAnonymous: true,
                allowComments: false,
                tags: ["safety", "watch", "community"],
                comments: []
            }
        ];

        setPolls(mockPolls);
    }, []);

    const handleCreatePoll = () => {
        if (!pollTitle.trim() || !pollDescription.trim() || pollOptions.filter(opt => opt.trim()).length < 2) {
            toast({
                title: "Error",
                description: "Please fill in all required fields and add at least 2 options",
                variant: "destructive"
            });
            return;
        }

        const newPoll: Poll = {
            id: Date.now().toString(),
            title: pollTitle,
            description: pollDescription,
            creatorId: "currentUser",
            creatorName: "You",
            creatorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            category: pollCategory,
            type: pollType,
            options: pollOptions
                .filter(opt => opt.trim())
                .map((opt, index) => ({
                    id: (index + 1).toString(),
                    text: opt,
                    votes: 0,
                    percentage: 0,
                    voters: []
                })),
            totalVotes: 0,
            status: "active",
            startDate: new Date(),
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            isAnonymous,
            allowComments,
            tags: pollTags.split(",").map(tag => tag.trim()).filter(tag => tag),
            comments: []
        };

        setPolls(prev => [newPoll, ...prev]);
        setShowCreatePoll(false);
        setPollTitle("");
        setPollDescription("");
        setPollCategory("general");
        setPollType("single");
        setPollOptions(["", ""]);
        setPollTags("");
        setIsAnonymous(false);
        setAllowComments(true);

        toast({
            title: "Poll created!",
            description: "Your poll is now live and collecting votes",
        });
    };

    const handleVote = () => {
        if (!selectedPoll) return;

        // Check if user has already voted
        checkUserVote(selectedPoll.id).then(hasVoted => {
            if (hasVoted) {
                toast({
                    title: "Already voted",
                    description: "You have already voted on this poll",
                    variant: "destructive"
                });
                return;
            }

            // Proceed with voting
            submitVote();
        });
    };

    const submitVote = async () => {
        if (selectedOptions.length === 0) {
            toast({
                title: "Error",
                description: "Please select at least one option",
                variant: "destructive"
            });
            return;
        }

        if (selectedPoll) {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    // Record the vote in the database
                    await supabase
                        .from('poll_votes')
                        .insert({
                            poll_id: selectedPoll.id,
                            user_id: user.id,
                            option_ids: selectedOptions
                        });
                }
            } catch (error) {
                console.error('Error recording vote:', error);
            }

            const updatedPoll = { ...selectedPoll };
            selectedOptions.forEach(optionId => {
                const option = updatedPoll.options.find(opt => opt.id === optionId);
                if (option) {
                    option.votes += 1;
                    if (!selectedPoll.isAnonymous) {
                        option.voters.push("currentUser");
                    }
                }
            });
            updatedPoll.totalVotes += 1;

            // Recalculate percentages
            updatedPoll.options.forEach(option => {
                option.percentage = updatedPoll.totalVotes > 0 ? (option.votes / updatedPoll.totalVotes) * 100 : 0;
            });

            setPolls(prev => prev.map(poll => poll.id === selectedPoll.id ? updatedPoll : poll));
            setSelectedPoll(updatedPoll);
            setSelectedOptions([]);
            setShowVoteDialog(false);

            toast({
                title: "Vote recorded!",
                description: "Thank you for participating in community decision-making!",
            });
        }
    };

    const handleAddComment = () => {
        if (!commentText.trim() || !selectedPoll) return;

        const newComment: PollComment = {
            id: Date.now().toString(),
            userId: "currentUser",
            userName: "You",
            userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            comment: commentText,
            timestamp: new Date()
        };

        const updatedPoll = { ...selectedPoll, comments: [...selectedPoll.comments, newComment] };
        setPolls(prev => prev.map(poll => poll.id === selectedPoll.id ? updatedPoll : poll));
        setSelectedPoll(updatedPoll);
        setCommentText("");

        toast({
            title: "Comment added!",
            description: "Your comment has been posted",
        });
    };

    const addPollOption = () => {
        setPollOptions(prev => [...prev, ""]);
    };

    const removePollOption = (index: number) => {
        if (pollOptions.length > 2) {
            setPollOptions(prev => prev.filter((_, i) => i !== index));
        }
    };

    const updatePollOption = (index: number, value: string) => {
        setPollOptions(prev => prev.map((opt, i) => i === index ? value : opt));
    };

    const getCategoryIcon = (category: Poll['category']) => {
        switch (category) {
            case 'community': return <Users className="w-4 h-4" />;
            case 'safety': return <AlertCircle className="w-4 h-4" />;
            case 'development': return <TrendingUp className="w-4 h-4" />;
            case 'events': return <Calendar className="w-4 h-4" />;
            case 'general': return <Vote className="w-4 h-4" />;
            default: return <Vote className="w-4 h-4" />;
        }
    };

    const getCategoryColor = (category: Poll['category']) => {
        switch (category) {
            case 'community': return "bg-blue-100 text-blue-800";
            case 'safety': return "bg-red-100 text-red-800";
            case 'development': return "bg-green-100 text-green-800";
            case 'events': return "bg-purple-100 text-purple-800";
            case 'general': return "bg-gray-100 text-gray-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusColor = (status: Poll['status']) => {
        switch (status) {
            case 'active': return "bg-green-500";
            case 'closed': return "bg-gray-500";
            case 'draft': return "bg-yellow-500";
            default: return "bg-gray-500";
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Neighborhood Polls</h2>
                    <p className="text-muted-foreground">Community decision-making with visual results</p>
                </div>
                <Dialog open={showCreatePoll} onOpenChange={setShowCreatePoll}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Create Poll
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Create New Poll</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="poll-title">Question *</Label>
                                <Input
                                    id="poll-title"
                                    placeholder="e.g., Should we install speed bumps?"
                                    value={pollTitle}
                                    onChange={(e) => setPollTitle(e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="poll-description">Description *</Label>
                                <Textarea
                                    id="poll-description"
                                    placeholder="Provide context for your poll question..."
                                    value={pollDescription}
                                    onChange={(e) => setPollDescription(e.target.value)}
                                    rows={3}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="poll-category">Category</Label>
                                    <Select value={pollCategory} onValueChange={(value: Poll['category']) => setPollCategory(value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="community">Community</SelectItem>
                                            <SelectItem value="safety">Safety</SelectItem>
                                            <SelectItem value="development">Development</SelectItem>
                                            <SelectItem value="events">Events</SelectItem>
                                            <SelectItem value="general">General</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="poll-type">Vote Type</Label>
                                    <Select value={pollType} onValueChange={(value: Poll['type']) => setPollType(value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="single">Single Choice</SelectItem>
                                            <SelectItem value="multiple">Multiple Choice</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div>
                                <Label>Options *</Label>
                                <div className="space-y-2">
                                    {pollOptions.map((option, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <Input
                                                placeholder={`Option ${index + 1}`}
                                                value={option}
                                                onChange={(e) => updatePollOption(index, e.target.value)}
                                            />
                                            {pollOptions.length > 2 && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => removePollOption(index)}
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={addPollOption}
                                        className="w-full"
                                    >
                                        Add Option
                                    </Button>
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="poll-tags">Tags (Optional)</Label>
                                <Input
                                    id="poll-tags"
                                    placeholder="safety, traffic, community (comma separated)"
                                    value={pollTags}
                                    onChange={(e) => setPollTags(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="anonymous-poll"
                                        checked={isAnonymous}
                                        onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
                                    />
                                    <Label htmlFor="anonymous-poll">Anonymous voting</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="allow-comments"
                                        checked={allowComments}
                                        onCheckedChange={(checked) => setAllowComments(checked as boolean)}
                                    />
                                    <Label htmlFor="allow-comments">Allow comments</Label>
                                </div>
                            </div>
                            <Button onClick={handleCreatePoll} className="w-full">
                                Create Poll
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Polls List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {polls.map(poll => (
                    <Card key={poll.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center space-x-2">
                                    {getCategoryIcon(poll.category)}
                                    <Badge className={getCategoryColor(poll.category)}>
                                        {poll.category}
                                    </Badge>
                                </div>
                                <div className={`w-3 h-3 rounded-full ${getStatusColor(poll.status)}`}></div>
                            </div>

                            <h4 className="font-semibold mb-2">{poll.title}</h4>
                            <p className="text-sm text-muted-foreground mb-3">{poll.description}</p>

                            <div className="flex items-center space-x-4 mb-3">
                                <div className="flex items-center space-x-1">
                                    <Avatar className="w-6 h-6">
                                        <AvatarImage src={poll.creatorAvatar} />
                                        <AvatarFallback>{poll.creatorName[0]}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm">{poll.creatorName}</span>
                                </div>
                                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                    <Vote className="w-3 h-3" />
                                    <span>{poll.totalVotes} votes</span>
                                </div>
                            </div>

                            {/* Results Preview */}
                            <div className="space-y-2 mb-3">
                                {poll.options.slice(0, 2).map(option => (
                                    <div key={option.id} className="space-y-1">
                                        <div className="flex items-center justify-between text-sm">
                                            <span>{option.text}</span>
                                            <span className="text-muted-foreground">{option.percentage.toFixed(1)}%</span>
                                        </div>
                                        <Progress value={option.percentage} className="h-2" />
                                    </div>
                                ))}
                                {poll.options.length > 2 && (
                                    <p className="text-xs text-muted-foreground">
                                        +{poll.options.length - 2} more options
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                    <Clock className="w-3 h-3" />
                                    <span>
                                        {poll.status === 'active'
                                            ? `Ends ${poll.endDate?.toLocaleDateString()}`
                                            : poll.status === 'closed'
                                                ? 'Closed'
                                                : 'Draft'
                                        }
                                    </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    {poll.isAnonymous && <Badge variant="outline" className="text-xs">Anonymous</Badge>}
                                    {poll.allowComments && <MessageCircle className="w-3 h-3" />}
                                </div>
                            </div>

                            {poll.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {poll.tags.map(tag => (
                                        <Badge key={tag} variant="outline" className="text-xs">
                                            #{tag}
                                        </Badge>
                                    ))}
                                </div>
                            )}

                            <div className="flex space-x-2 mt-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setSelectedPoll(poll);
                                        setShowVoteDialog(true);
                                    }}
                                    disabled={poll.status !== 'active'}
                                    className="flex-1"
                                >
                                    Vote
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedPoll(poll)}
                                >
                                    <BarChart3 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Vote Dialog */}
            {selectedPoll && (
                <Dialog open={showVoteDialog} onOpenChange={setShowVoteDialog}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>{selectedPoll.title}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">{selectedPoll.description}</p>

                            <div>
                                <Label>Select your {selectedPoll.type === 'single' ? 'choice' : 'choices'}</Label>
                                <RadioGroup
                                    value={selectedOptions[0]}
                                    onValueChange={(value) => setSelectedOptions([value])}
                                    className="space-y-2"
                                >
                                    {selectedPoll.options.map(option => (
                                        <div key={option.id} className="flex items-center space-x-2">
                                            <RadioGroupItem value={option.id} id={option.id} />
                                            <Label htmlFor={option.id}>{option.text}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>

                            <div className="flex space-x-2">
                                <Button onClick={handleVote} className="flex-1">
                                    Submit Vote
                                </Button>
                                <Button variant="outline" onClick={() => setShowVoteDialog(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {/* Poll Details */}
            {selectedPoll && !showVoteDialog && (
                <Card className="mt-6">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>{selectedPoll.title}</CardTitle>
                                <p className="text-sm text-muted-foreground">{selectedPoll.description}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Badge className={getCategoryColor(selectedPoll.category)}>
                                    {selectedPoll.category}
                                </Badge>
                                <Badge variant={selectedPoll.status === 'active' ? 'default' : 'secondary'}>
                                    {selectedPoll.status}
                                </Badge>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Results */}
                            <div>
                                <h4 className="font-semibold mb-4">Results</h4>
                                <div className="space-y-4">
                                    {selectedPoll.options.map(option => (
                                        <div key={option.id} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium">{option.text}</span>
                                                <span className="text-sm text-muted-foreground">
                                                    {option.votes} votes ({option.percentage.toFixed(1)}%)
                                                </span>
                                            </div>
                                            <Progress value={option.percentage} className="h-3" />
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 p-3 bg-muted rounded-lg">
                                    <div className="flex items-center justify-between text-sm">
                                        <span>Total Votes</span>
                                        <span className="font-medium">{selectedPoll.totalVotes}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Comments */}
                            {selectedPoll.allowComments && (
                                <div>
                                    <h4 className="font-semibold mb-4">Comments</h4>
                                    <div className="space-y-3 max-h-64 overflow-y-auto">
                                        {selectedPoll.comments.map(comment => (
                                            <div key={comment.id} className="flex items-start space-x-2">
                                                <Avatar className="w-6 h-6">
                                                    <AvatarImage src={comment.userAvatar} />
                                                    <AvatarFallback>{comment.userName[0]}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-sm font-medium">{comment.userName}</span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {comment.timestamp.toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm">{comment.comment}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 space-y-2">
                                        <Textarea
                                            placeholder="Add a comment..."
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            rows={2}
                                        />
                                        <Button onClick={handleAddComment} size="sm">
                                            Add Comment
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}; 