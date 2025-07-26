import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Search,
  Star,
  Clock,
  MapPin,
  User,
  Calendar as CalendarIcon,
  Filter,
  GraduationCap,
  PawPrint,
  Wrench,
  Sparkles,
  Briefcase,
} from "lucide-react";

interface Service {
  id: string;
  name: string;
  description: string;
  hourlyRate: number;
  category: "Tutoring" | "Pet Care" | "Home Repair" | "Cleaning" | "Other";
  provider: {
    name: string;
    avatar: string;
    rating: number;
    completedJobs: number;
    isBusiness: boolean;
    businessName?: string;
  };
  availability: string[];
  timeSlots: string[];
  image?: string;
}

interface Booking {
  id: string;
  serviceId: string;
  date: Date;
  timeSlot: string;
  duration: number;
  instructions: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  customer: string;
  provider: string;
}

export const Services = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    hourlyRate: "",
    category: "Other" as Service["category"],
    availability: [] as string[],
  });

  const [bookingForm, setBookingForm] = useState({
    timeSlot: "",
    duration: 1,
    instructions: "",
  });

  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      name: "Math & Science Tutoring",
      description: "Experienced tutor offering help with algebra, calculus, physics, and chemistry. High school and college level.",
      hourlyRate: 45,
      category: "Tutoring",
      provider: {
        name: "Dr. Emily Chen",
        avatar: "/placeholder-tutor.jpg",
        rating: 4.9,
        completedJobs: 127,
        isBusiness: false,
      },
      availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      timeSlots: ["4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM"],
      image: "/placeholder-tutoring.jpg",
    },
    {
      id: "2",
      name: "Dog Walking & Pet Sitting",
      description: "Reliable pet care services. Daily walks, feeding, and overnight sitting available. Licensed and insured.",
      hourlyRate: 25,
      category: "Pet Care",
      provider: {
        name: "Happy Paws Pet Care",
        avatar: "/placeholder-business.jpg",
        rating: 4.8,
        completedJobs: 89,
        isBusiness: true,
        businessName: "Happy Paws Pet Care",
      },
      availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      timeSlots: ["8:00 AM", "12:00 PM", "4:00 PM", "6:00 PM"],
    },
    {
      id: "3",
      name: "Handyman Services",
      description: "General home repairs, furniture assembly, painting, and minor electrical work. 15+ years experience.",
      hourlyRate: 65,
      category: "Home Repair",
      provider: {
        name: "Mike Rodriguez",
        avatar: "/placeholder-handyman.jpg",
        rating: 4.7,
        completedJobs: 203,
        isBusiness: false,
      },
      availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      timeSlots: ["9:00 AM", "1:00 PM", "3:00 PM"],
    },
    {
      id: "4",
      name: "House Cleaning",
      description: "Professional house cleaning services. Deep cleaning, regular maintenance, and move-in/out cleaning available.",
      hourlyRate: 35,
      category: "Cleaning",
      provider: {
        name: "Sarah Wilson",
        avatar: "/placeholder-cleaner.jpg",
        rating: 4.9,
        completedJobs: 156,
        isBusiness: false,
      },
      availability: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      timeSlots: ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM"],
    },
  ]);

  const categories = ["Tutoring", "Pet Care", "Home Repair", "Cleaning", "Other"];
  
  const categoryIcons = {
    "Tutoring": GraduationCap,
    "Pet Care": PawPrint,
    "Home Repair": Wrench,
    "Cleaning": Sparkles,
    "Other": Briefcase,
  };

  const categoryColors = {
    "Tutoring": "bg-blue-100 text-blue-800",
    "Pet Care": "bg-green-100 text-green-800",
    "Home Repair": "bg-orange-100 text-orange-800",
    "Cleaning": "bg-purple-100 text-purple-800",
    "Other": "bg-gray-100 text-gray-800",
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleCreateService = () => {
    if (!newService.name.trim() || !newService.hourlyRate) return;

    const service: Service = {
      id: Date.now().toString(),
      name: newService.name,
      description: newService.description,
      hourlyRate: parseFloat(newService.hourlyRate),
      category: newService.category,
      provider: {
        name: "John Doe",
        avatar: "/placeholder-avatar.jpg",
        rating: 5.0,
        completedJobs: 0,
        isBusiness: false,
      },
      availability: newService.availability,
      timeSlots: ["9:00 AM", "1:00 PM", "5:00 PM"],
    };

    setServices([service, ...services]);
    setNewService({
      name: "",
      description: "",
      hourlyRate: "",
      category: "Other",
      availability: [],
    });
    setShowCreateModal(false);
  };

  const handleBookService = () => {
    if (!selectedService || !selectedDate || !bookingForm.timeSlot) return;

    // In a real app, this would create a booking in the database
    alert(`Booking request sent for ${selectedService.name} on ${selectedDate.toDateString()} at ${bookingForm.timeSlot}`);
    
    setShowBookingModal(false);
    setBookingForm({
      timeSlot: "",
      duration: 1,
      instructions: "",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Neighborhood Services</h1>
          <p className="text-muted-foreground">Find trusted local service providers</p>
        </div>
        
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Offer a Service</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Offer a Service</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="service-name">Service Name</Label>
                <Input
                  id="service-name"
                  placeholder="What service do you offer?"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hourly-rate">Hourly Rate ($)</Label>
                <Input
                  id="hourly-rate"
                  type="number"
                  placeholder="0.00"
                  value={newService.hourlyRate}
                  onChange={(e) => setNewService({ ...newService, hourlyRate: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={newService.category} onValueChange={(value) => setNewService({ ...newService, category: value as Service["category"] })}>
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
                <Label htmlFor="service-description">Description</Label>
                <Textarea
                  id="service-description"
                  placeholder="Describe your service..."
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>
              
              <Button onClick={handleCreateService} className="w-full">
                Create Service
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
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
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
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => {
          const CategoryIcon = categoryIcons[service.category];
          
          return (
            <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {service.image ? (
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  <CategoryIcon className="w-16 h-16 text-primary" />
                </div>
              )}
              
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge className={categoryColors[service.category]} variant="secondary">
                        {service.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-2xl font-bold text-primary">
                        ${service.hourlyRate}/hr
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {service.description}
                </p>
                
                <div className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={service.provider.avatar} />
                    <AvatarFallback className="text-xs">
                      {service.provider.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm truncate">{service.provider.name}</span>
                      {service.provider.isBusiness && (
                        <Badge variant="secondary" className="text-xs">
                          Business
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{service.provider.rating}</span>
                      </div>
                      <span>•</span>
                      <span>{service.provider.completedJobs} jobs</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Available {service.availability.length} days/week</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>1.2 mi away</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full"
                  onClick={() => {
                    setSelectedService(service);
                    setShowBookingModal(true);
                  }}
                >
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Book Service
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Booking Modal */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Book {selectedService?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedService && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={selectedService.provider.avatar} />
                  <AvatarFallback>
                    {selectedService.provider.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">{selectedService.provider.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    ${selectedService.hourlyRate}/hour
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Select Date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Time Slot</Label>
                <Select value={bookingForm.timeSlot} onValueChange={(value) => setBookingForm({ ...bookingForm, timeSlot: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedService.timeSlots.map(slot => (
                      <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Duration (hours)</Label>
                <Select value={bookingForm.duration.toString()} onValueChange={(value) => setBookingForm({ ...bookingForm, duration: parseInt(value) })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hour</SelectItem>
                    <SelectItem value="2">2 hours</SelectItem>
                    <SelectItem value="3">3 hours</SelectItem>
                    <SelectItem value="4">4 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instructions">Special Instructions</Label>
                <Textarea
                  id="instructions"
                  placeholder="Any special requests or details..."
                  value={bookingForm.instructions}
                  onChange={(e) => setBookingForm({ ...bookingForm, instructions: e.target.value })}
                  maxLength={200}
                />
              </div>
              
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Cost:</span>
                  <span className="text-lg font-bold text-primary">
                    ${selectedService.hourlyRate * bookingForm.duration}
                  </span>
                </div>
              </div>
              
              <Button onClick={handleBookService} className="w-full">
                Request Booking
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No services found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filters to find services.
          </p>
        </div>
      )}
    </div>
  );
};