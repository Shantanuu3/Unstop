import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  User,
  MapPin,
  Mail,
  Phone,
  Building2,
  Calendar,
  Star,
  Package,
  Briefcase,
  MessageCircle,
  Edit,
  Camera,
  Clock,
  DollarSign,
} from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
  avatar: string;
  joinedDate: string;
  isBusiness: boolean;
  businessInfo?: {
    name: string;
    description: string;
    category: string;
    hours: string;
    website?: string;
  };
}

export const Profile = ({ 
  isBusiness, 
  onToggleBusiness 
}: { 
  isBusiness: boolean; 
  onToggleBusiness: () => void; 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "(555) 123-4567",
    address: "123 Main St, Downtown District",
    bio: "Longtime resident of Downtown District. Love connecting with neighbors and supporting local businesses!",
    avatar: "/placeholder-avatar.jpg",
    joinedDate: "March 2023",
    isBusiness: false,
    businessInfo: {
      name: "John's Home Services",
      description: "Professional handyman services for your home improvement needs.",
      category: "Home Services",
      hours: "Mon-Fri 8AM-6PM, Sat 9AM-3PM",
      website: "www.johnshomeservices.com",
    },
  });

  // Mock data for user's activities
  const userPosts = [
    {
      id: "1",
      content: "Just wanted to remind everyone about the community clean-up this Saturday!",
      timestamp: "2 days ago",
      likes: 15,
      comments: 3,
    },
    {
      id: "2",
      content: "Looking for recommendations for a good pizza place nearby. Any suggestions?",
      timestamp: "1 week ago",
      likes: 8,
      comments: 12,
    },
  ];

  const userItems = [
    {
      id: "1",
      title: "Vintage Coffee Table",
      price: 150,
      status: "Available",
      image: "/placeholder-table.jpg",
      postedAt: "3 days ago",
    },
    {
      id: "2",
      title: "Garden Tools Set",
      price: 45,
      status: "Sold",
      image: "/placeholder-tools.jpg",
      postedAt: "1 week ago",
    },
  ];

  const userServices = [
    {
      id: "1",
      name: "Home Repair & Maintenance",
      hourlyRate: 65,
      category: "Home Services",
      rating: 4.8,
      completedJobs: 23,
    },
  ];

  const userBookings = [
    {
      id: "1",
      serviceName: "Math Tutoring",
      provider: "Dr. Emily Chen",
      date: "Tomorrow",
      time: "4:00 PM",
      status: "Confirmed",
    },
    {
      id: "2",
      serviceName: "House Cleaning",
      provider: "Sarah Wilson",
      date: "Friday",
      time: "10:00 AM",
      status: "Pending",
    },
  ];

  const handleSaveProfile = () => {
    setIsEditing(false);
    // In a real app, this would save to the database
  };

  const statusColors = {
    "Available": "bg-success text-success-foreground",
    "Sold": "bg-muted text-muted-foreground",
    "Confirmed": "bg-success text-success-foreground",
    "Pending": "bg-warning text-warning-foreground",
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile.avatar} />
                <AvatarFallback className="text-2xl">
                  {profile.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button size="sm" variant="secondary" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0">
                  <Camera className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            <div className="flex-1 space-y-2">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={profile.address}
                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      maxLength={500}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center space-x-3">
                    <h1 className="text-3xl font-bold">{profile.name}</h1>
                    {isBusiness && (
                      <Badge className="bg-primary text-primary-foreground">
                        <Building2 className="w-3 h-3 mr-1" />
                        Business
                      </Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>{profile.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>{profile.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.address}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {profile.joinedDate}</span>
                    </div>
                  </div>
                  
                  <p className="text-foreground">{profile.bio}</p>
                </>
              )}
            </div>
            
            <div className="flex flex-col space-y-2">
              {isEditing ? (
                <div className="flex space-x-2">
                  <Button onClick={handleSaveProfile}>Save</Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                </div>
              ) : (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={isBusiness}
                  onCheckedChange={onToggleBusiness}
                />
                <Label className="text-sm">Business Mode</Label>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Business Profile (if business mode is enabled) */}
      {isBusiness && profile.businessInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="w-5 h-5" />
              <span>Business Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Business Name</Label>
                <p className="font-medium">{profile.businessInfo.name}</p>
              </div>
              <div>
                <Label>Category</Label>
                <p className="font-medium">{profile.businessInfo.category}</p>
              </div>
              <div>
                <Label>Business Hours</Label>
                <p className="font-medium">{profile.businessInfo.hours}</p>
              </div>
              {profile.businessInfo.website && (
                <div>
                  <Label>Website</Label>
                  <p className="font-medium text-primary">{profile.businessInfo.website}</p>
                </div>
              )}
            </div>
            <div>
              <Label>Description</Label>
              <p className="font-medium">{profile.businessInfo.description}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activity Tabs */}
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="items">Items for Sale</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts" className="space-y-4">
          {userPosts.map((post) => (
            <Card key={post.id}>
              <CardContent className="pt-4">
                <p className="text-foreground mb-3">{post.content}</p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{post.timestamp}</span>
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <Star className="w-4 h-4" />
                      <span>{post.likes}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comments}</span>
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="items" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userItems.map((item) => (
              <Card key={item.id}>
                <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="text-2xl font-bold text-primary">${item.price}</p>
                    </div>
                    <Badge className={statusColors[item.status as keyof typeof statusColors]}>
                      {item.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Posted {item.postedAt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="services" className="space-y-4">
          {userServices.map((service) => (
            <Card key={service.id}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{service.name}</h4>
                    <p className="text-muted-foreground">{service.category}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4 text-primary" />
                        <span className="font-medium">${service.hourlyRate}/hour</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{service.rating}</span>
                      </div>
                      <span className="text-muted-foreground">
                        {service.completedJobs} jobs completed
                      </span>
                    </div>
                  </div>
                  <Briefcase className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="bookings" className="space-y-4">
          {userBookings.map((booking) => (
            <Card key={booking.id}>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{booking.serviceName}</h4>
                    <p className="text-muted-foreground">with {booking.provider}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{booking.time}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className={statusColors[booking.status as keyof typeof statusColors]}>
                    {booking.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};