import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Heart,
  MessageCircle,
  Share2,
  Camera,
  MoreHorizontal,
  Send,
  MapPin,
  Calendar,
  Shield,
  Star,
} from "lucide-react";

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    isBusiness: boolean;
    businessName?: string;
  };
  content: string;
  image?: string;
  category: "General" | "Events" | "Safety" | "Recommendations";
  timestamp: string;
  likes: number;
  comments: Comment[];
  isLiked: boolean;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

export const SocialFeed = () => {
  const [newPost, setNewPost] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Post["category"]>("General");
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      author: {
        name: "Sarah Johnson",
        avatar: "/placeholder-avatar.jpg",
        isBusiness: false,
      },
      content: "Just wanted to let everyone know there's a community BBQ this Saturday at Riverside Park starting at 2 PM! Bring your families and let's celebrate our amazing neighborhood. 🎉",
      category: "Events",
      timestamp: "2 hours ago",
      likes: 24,
      comments: [
        {
          id: "1",
          author: "Mike Chen",
          content: "Count us in! We'll bring desserts.",
          timestamp: "1 hour ago",
        },
      ],
      isLiked: false,
    },
    {
      id: "2",
      author: {
        name: "Green Garden Café",
        avatar: "/placeholder-business.jpg",
        isBusiness: true,
        businessName: "Green Garden Café",
      },
      content: "New organic coffee blend just arrived! First 20 customers today get 20% off. Supporting local roasters and our community. ☕",
      category: "General",
      timestamp: "4 hours ago",
      likes: 18,
      comments: [],
      isLiked: true,
    },
    {
      id: "3",
      author: {
        name: "Officer Martinez",
        avatar: "/placeholder-officer.jpg",
        isBusiness: false,
      },
      content: "Reminder: Street cleaning on Maple Avenue tomorrow from 8-10 AM. Please move your vehicles. Also, great job everyone on keeping our streets clean! 👮‍♂️",
      category: "Safety",
      timestamp: "6 hours ago",
      likes: 42,
      comments: [
        {
          id: "2",
          author: "Lisa Park",
          content: "Thanks for the reminder!",
          timestamp: "5 hours ago",
        },
      ],
      isLiked: false,
    },
  ]);
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});

  const categoryIcons = {
    General: MessageCircle,
    Events: Calendar,
    Safety: Shield,
    Recommendations: Star,
  };

  const categoryColors = {
    General: "bg-secondary",
    Events: "bg-accent",
    Safety: "bg-warning",
    Recommendations: "bg-success",
  };

  const handleCreatePost = () => {
    if (!newPost.trim()) return;

    const post: Post = {
      id: Date.now().toString(),
      author: {
        name: "John Doe",
        avatar: "/placeholder-avatar.jpg",
        isBusiness: false,
      },
      content: newPost,
      category: selectedCategory,
      timestamp: "Just now",
      likes: 0,
      comments: [],
      isLiked: false,
    };

    setPosts([post, ...posts]);
    setNewPost("");
    setSelectedCategory("General");
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const handleComment = (postId: string) => {
    const comment = newComment[postId]?.trim();
    if (!comment) return;

    const newCommentObj: Comment = {
      id: Date.now().toString(),
      author: "John Doe",
      content: comment,
      timestamp: "Just now",
    };

    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, comments: [...post.comments, newCommentObj] }
        : post
    ));

    setNewComment({ ...newComment, [postId]: "" });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Create Post Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback className="bg-primary text-primary-foreground">JD</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="What's happening in your neighborhood?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="min-h-[80px] resize-none border-0 bg-background focus-visible:ring-0"
                maxLength={500}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Camera className="w-4 h-4 mr-2" />
                Add Photo
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Badge className={categoryColors[selectedCategory]}>
                      {selectedCategory}
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {Object.entries(categoryIcons).map(([category, Icon]) => (
                    <DropdownMenuItem
                      key={category}
                      onClick={() => setSelectedCategory(category as Post["category"])}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {500 - newPost.length}
              </span>
              <Button onClick={handleCreatePost} disabled={!newPost.trim()}>
                Share Post
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts */}
      {posts.map((post) => {
        const CategoryIcon = categoryIcons[post.category];
        
        return (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={post.author.avatar} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {post.author.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold">{post.author.name}</h4>
                      {post.author.isBusiness && (
                        <Badge variant="secondary" className="text-xs">
                          Business
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>{post.timestamp}</span>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <CategoryIcon className="w-3 h-3" />
                        <span>{post.category}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>Downtown District</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Save Post</DropdownMenuItem>
                    <DropdownMenuItem>Report</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-foreground leading-relaxed">{post.content}</p>
              
              {post.image && (
                <img
                  src={post.image}
                  alt="Post content"
                  className="w-full rounded-lg max-h-96 object-cover"
                />
              )}
              
              {/* Post Actions */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(post.id)}
                    className={post.isLiked ? "text-destructive" : ""}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${post.isLiked ? "fill-current" : ""}`} />
                    {post.likes}
                  </Button>
                  
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {post.comments.length}
                  </Button>
                  
                  <Button variant="ghost" size="sm">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Comments */}
              {post.comments.length > 0 && (
                <div className="space-y-3 pt-2 border-t">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-muted text-xs">
                          {comment.author.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-muted rounded-lg px-3 py-2">
                          <p className="font-medium text-sm">{comment.author}</p>
                          <p className="text-sm">{comment.content}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{comment.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Add Comment */}
              <div className="flex space-x-3 pt-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">JD</AvatarFallback>
                </Avatar>
                <div className="flex-1 flex space-x-2">
                  <Input
                    placeholder="Write a comment..."
                    value={newComment[post.id] || ""}
                    onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
                    maxLength={200}
                    onKeyPress={(e) => e.key === "Enter" && handleComment(post.id)}
                  />
                  <Button
                    size="sm"
                    onClick={() => handleComment(post.id)}
                    disabled={!newComment[post.id]?.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};