import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  ShoppingBag,
  Briefcase,
  MessageCircle,
  User,
  Search,
  Bell,
  Building2,
  LogOut,
  Settings,
  MapPin,
  Camera,
  Video,
  Vote,
  Calendar,
  Users,
  TrendingUp,
  Star,
  Heart,
  Globe,
  Zap
} from "lucide-react";

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isBusiness: boolean;
  onToggleBusiness: () => void;
}

export const Navigation = ({ currentPage, onPageChange, isBusiness, onToggleBusiness }: NavigationProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const navigationItems = [
    { id: "feed", label: "Home", icon: Home },
    { id: "stories", label: "Stories", icon: Camera, badge: 5 },
    { id: "live", label: "Live", icon: Video, badge: 2 },
    { id: "polls", label: "Polls", icon: Vote },
    { id: "events", label: "Events", icon: Calendar },
    { id: "groups", label: "Groups", icon: Users },
    { id: "marketplace", label: "Marketplace", icon: ShoppingBag },
    { id: "services", label: "Services", icon: Briefcase },
    { id: "messages", label: "Messages", icon: MessageCircle, badge: 3 },
  ];

  const socialFeatures = [
    { id: "stories", label: "Stories", icon: Camera, description: "24-hour disappearing content" },
    { id: "live", label: "Live Streaming", icon: Video, description: "Real-time neighborhood updates" },
    { id: "polls", label: "Community Polls", icon: Vote, description: "Democratic decision-making" },
    { id: "events", label: "Event Planning", icon: Calendar, description: "Full event management" },
    { id: "groups", label: "Local Groups", icon: Users, description: "Interest-based communities" },
  ];

  const commerceFeatures = [
    { id: "marketplace", label: "Marketplace", icon: ShoppingBag, description: "Buy and sell locally" },
    { id: "services", label: "Services", icon: Briefcase, description: "Book local services" },
  ];

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">LocalHub</span>
                <Badge variant="secondary" className="text-xs">
                  Downtown District
                </Badge>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts, items, services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs rounded-full bg-destructive text-destructive-foreground p-0 flex items-center justify-center">
                  2
                </Badge>
              </Button>

              {/* Business Toggle */}
              <Button
                variant={isBusiness ? "default" : "outline"}
                size="sm"
                onClick={onToggleBusiness}
                className="flex items-center space-x-2"
              >
                <Building2 className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {isBusiness ? "Business" : "Personal"}
                </span>
              </Button>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" />
                      <AvatarFallback className="bg-primary text-primary-foreground">JD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuItem onClick={() => onPageChange("profile")}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      {/* Side Navigation (Desktop) */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:pt-16">
        <div className="flex flex-col flex-grow bg-card border-r border-border overflow-y-auto">
          <nav className="flex-1 px-4 py-6 space-y-4">
            {/* Social Features Section */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 px-2 py-1">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Community Features
                </span>
              </div>
              {socialFeatures.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;

                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    className="w-full justify-start relative h-auto py-2"
                    onClick={() => onPageChange(item.id)}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    <div className="flex flex-col items-start">
                      <span className="text-sm">{item.label}</span>
                      <span className="text-xs text-muted-foreground">{item.description}</span>
                    </div>
                    {item.badge && (
                      <Badge className="ml-auto bg-destructive text-destructive-foreground">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                );
              })}
            </div>

            {/* Commerce Features Section */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 px-2 py-1">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Local Commerce
                </span>
              </div>
              {commerceFeatures.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;

                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    className="w-full justify-start relative h-auto py-2"
                    onClick={() => onPageChange(item.id)}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    <div className="flex flex-col items-start">
                      <span className="text-sm">{item.label}</span>
                      <span className="text-xs text-muted-foreground">{item.description}</span>
                    </div>
                    {item.badge && (
                      <Badge className="ml-auto bg-destructive text-destructive-foreground">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                );
              })}
            </div>

            {/* Communication Section */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 px-2 py-1">
                <Zap className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Connect
                </span>
              </div>
              <Button
                variant={currentPage === "messages" ? "default" : "ghost"}
                className="w-full justify-start relative h-auto py-2"
                onClick={() => onPageChange("messages")}
              >
                <MessageCircle className="mr-3 h-5 w-5" />
                <div className="flex flex-col items-start">
                  <span className="text-sm">Messages</span>
                  <span className="text-xs text-muted-foreground">Direct communication</span>
                </div>
                <Badge className="ml-auto bg-destructive text-destructive-foreground">
                  3
                </Badge>
              </Button>
            </div>
          </nav>
        </div>
      </div>

      {/* Bottom Navigation (Mobile) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
        <nav className="flex justify-around items-center h-16 px-4">
          {navigationItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center space-y-1 relative ${isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                onClick={() => onPageChange(item.id)}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
                {item.badge && (
                  <Badge className="absolute -top-1 -right-1 w-4 h-4 text-xs rounded-full bg-destructive text-destructive-foreground p-0 flex items-center justify-center">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            );
          })}
        </nav>
      </div>
    </>
  );
};