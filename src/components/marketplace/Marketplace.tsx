import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Filter,
  Search,
  MessageCircle,
  Heart,
  Camera,
  MapPin,
  Clock,
  DollarSign,
  SortAsc,
} from "lucide-react";

interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
  category: "Electronics" | "Furniture" | "Books" | "Services" | "Other";
  condition: "New" | "Like New" | "Good" | "Fair";
  status: "Available" | "Pending" | "Sold";
  seller: {
    name: string;
    avatar: string;
    isBusiness: boolean;
    businessName?: string;
  };
  postedAt: string;
  likes: number;
  isLiked: boolean;
}

export const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCondition, setSelectedCondition] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    price: "",
    category: "Other" as MarketplaceItem["category"],
    condition: "Good" as MarketplaceItem["condition"],
  });

  const [items, setItems] = useState<MarketplaceItem[]>([
    {
      id: "1",
      title: "MacBook Pro 13\" 2020",
      description: "Excellent condition MacBook Pro, barely used. Comes with charger and original box. Perfect for students or professionals.",
      price: 899,
      image: "/placeholder-laptop.jpg",
      category: "Electronics",
      condition: "Like New",
      status: "Available",
      seller: {
        name: "Alex Kim",
        avatar: "/placeholder-avatar.jpg",
        isBusiness: false,
      },
      postedAt: "2 hours ago",
      likes: 8,
      isLiked: false,
    },
    {
      id: "2",
      title: "Vintage Dining Table Set",
      description: "Beautiful oak dining table with 6 chairs. Some wear but structurally sound. Great for family dinners!",
      price: 450,
      image: "/placeholder-table.jpg",
      category: "Furniture",
      condition: "Good",
      status: "Available",
      seller: {
        name: "Second Hand Sarah",
        avatar: "/placeholder-business.jpg",
        isBusiness: true,
        businessName: "Second Hand Sarah's",
      },
      postedAt: "1 day ago",
      likes: 12,
      isLiked: true,
    },
    {
      id: "3",
      title: "Computer Science Textbooks",
      description: "Collection of CS textbooks from university courses. Algorithms, Data Structures, and more. Perfect for students.",
      price: 75,
      category: "Books",
      condition: "Good",
      status: "Available",
      seller: {
        name: "Mike Chen",
        avatar: "/placeholder-avatar.jpg",
        isBusiness: false,
      },
      postedAt: "3 days ago",
      likes: 5,
      isLiked: false,
    },
  ]);

  const categories = ["Electronics", "Furniture", "Books", "Services", "Other"];
  const conditions = ["New", "Like New", "Good", "Fair"];

  const conditionColors = {
    "New": "bg-success text-success-foreground",
    "Like New": "bg-primary text-primary-foreground",
    "Good": "bg-warning text-warning-foreground",
    "Fair": "bg-secondary text-secondary-foreground",
  };

  const statusColors = {
    "Available": "bg-success text-success-foreground",
    "Pending": "bg-warning text-warning-foreground",
    "Sold": "bg-muted text-muted-foreground",
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesCondition = selectedCondition === "all" || item.condition === selectedCondition;
    
    return matchesSearch && matchesCategory && matchesCondition;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "oldest":
        return new Date(a.postedAt).getTime() - new Date(b.postedAt).getTime();
      default: // newest
        return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
    }
  });

  const handleCreateItem = () => {
    if (!newItem.title.trim() || !newItem.price) return;

    const item: MarketplaceItem = {
      id: Date.now().toString(),
      title: newItem.title,
      description: newItem.description,
      price: parseFloat(newItem.price),
      category: newItem.category,
      condition: newItem.condition,
      status: "Available",
      seller: {
        name: "John Doe",
        avatar: "/placeholder-avatar.jpg",
        isBusiness: false,
      },
      postedAt: "Just now",
      likes: 0,
      isLiked: false,
    };

    setItems([item, ...items]);
    setNewItem({
      title: "",
      description: "",
      price: "",
      category: "Other",
      condition: "Good",
    });
    setShowCreateModal(false);
  };

  const handleLike = (itemId: string) => {
    setItems(items.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            isLiked: !item.isLiked,
            likes: item.isLiked ? item.likes - 1 : item.likes + 1
          }
        : item
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Neighborhood Marketplace</h1>
          <p className="text-muted-foreground">Buy and sell with your neighbors</p>
        </div>
        
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Sell Something</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>List an Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="What are you selling?"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  maxLength={100}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={newItem.category} onValueChange={(value) => setNewItem({ ...newItem, category: value as MarketplaceItem["category"] })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Condition</Label>
                  <Select value={newItem.condition} onValueChange={(value) => setNewItem({ ...newItem, condition: value as MarketplaceItem["condition"] })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map(condition => (
                        <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your item..."
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  maxLength={500}
                  className="min-h-[100px]"
                />
              </div>
              
              <Button variant="outline" className="w-full">
                <Camera className="w-4 h-4 mr-2" />
                Add Photo
              </Button>
              
              <Button onClick={handleCreateItem} className="w-full">
                List Item
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Category
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedCategory("all")}>
                All Categories
              </DropdownMenuItem>
              {categories.map(category => (
                <DropdownMenuItem key={category} onClick={() => setSelectedCategory(category)}>
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Condition
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedCondition("all")}>
                All Conditions
              </DropdownMenuItem>
              {conditions.map(condition => (
                <DropdownMenuItem key={condition} onClick={() => setSelectedCondition(condition)}>
                  {condition}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <SortAsc className="w-4 h-4 mr-2" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortBy("newest")}>Newest First</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("oldest")}>Oldest First</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("price-low")}>Price: Low to High</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("price-high")}>Price: High to Low</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedItems.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-muted flex items-center justify-center">
                  <Camera className="w-12 h-12 text-muted-foreground" />
                </div>
              )}
              <Badge className={`absolute top-2 right-2 ${statusColors[item.status]}`}>
                {item.status}
              </Badge>
            </div>
            
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">{item.title}</CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-2xl font-bold text-primary">
                      ${item.price}
                    </span>
                    <Badge className={conditionColors[item.condition]} variant="secondary">
                      {item.condition}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(item.id)}
                  className={item.isLiked ? "text-destructive" : ""}
                >
                  <Heart className={`w-4 h-4 ${item.isLiked ? "fill-current" : ""}`} />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {item.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={item.seller.avatar} />
                    <AvatarFallback className="text-xs">
                      {item.seller.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <span className="font-medium">{item.seller.name}</span>
                    {item.seller.isBusiness && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        Business
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{item.postedAt}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>0.5 mi away</span>
                </div>
              </div>
              
              <Button className="w-full">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Seller
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {sortedItems.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No items found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
};