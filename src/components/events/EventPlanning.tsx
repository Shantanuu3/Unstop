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
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Calendar as CalendarIcon,
    Clock,
    MapPin,
    Users,
    Ticket,
    Mail,
    Share2,
    Plus,
    Edit,
    Trash2,
    CheckCircle,
    XCircle,
    AlertCircle,
    DollarSign,
    Camera,
    Music,
    Utensils,
    Car,
    Baby,
    Dog,
    Wifi
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface Event {
    id: string;
    title: string;
    description: string;
    organizerId: string;
    organizerName: string;
    organizerAvatar: string;
    category: 'community' | 'business' | 'social' | 'educational' | 'charity';
    startDate: Date;
    endDate: Date;
    location: string;
    address: string;
    capacity: number;
    currentAttendees: number;
    price: number;
    isFree: boolean;
    status: 'draft' | 'published' | 'cancelled' | 'completed';
    tags: string[];
    amenities: string[];
    attendees: EventAttendee[];
    waitlist: EventAttendee[];
    tickets: Ticket[];
    images: string[];
}

interface EventAttendee {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    status: 'confirmed' | 'pending' | 'declined';
    ticketType: string;
    rsvpDate: Date;
    plusOnes: number;
}

interface Ticket {
    id: string;
    name: string;
    price: number;
    quantity: number;
    sold: number;
    description: string;
}

export const EventPlanning = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [showCreateEvent, setShowCreateEvent] = useState(false);
    const [showEventDetails, setShowEventDetails] = useState(false);
    const [eventTitle, setEventTitle] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [eventCategory, setEventCategory] = useState<Event['category']>('community');
    const [eventStartDate, setEventStartDate] = useState<Date>();
    const [eventEndDate, setEventEndDate] = useState<Date>();
    const [eventLocation, setEventLocation] = useState("");
    const [eventAddress, setEventAddress] = useState("");
    const [eventCapacity, setEventCapacity] = useState(50);
    const [eventPrice, setEventPrice] = useState(0);
    const [eventTags, setEventTags] = useState("");
    const [eventAmenities, setEventAmenities] = useState<string[]>([]);
    const [ticketTypes, setTicketTypes] = useState<Ticket[]>([
        { id: "1", name: "General Admission", price: 0, quantity: 50, sold: 0, description: "Free entry" }
    ]);
    const { toast } = useToast();

    // Mock data
    useEffect(() => {
        const mockEvents: Event[] = [
            {
                id: "1",
                title: "Neighborhood Summer Block Party",
                description: "Join us for our annual summer block party! Food, music, games, and fun for the whole family.",
                organizerId: "user1",
                organizerName: "Sarah Johnson",
                organizerAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
                category: "community",
                startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
                endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // 4 hours later
                location: "Oak Street Park",
                address: "123 Oak Street, Neighborhood",
                capacity: 200,
                currentAttendees: 156,
                price: 0,
                isFree: true,
                status: "published",
                tags: ["summer", "family", "music", "food"],
                amenities: ["food", "music", "games", "parking"],
                attendees: [
                    {
                        id: "a1",
                        userId: "user2",
                        userName: "Mike Chen",
                        userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                        status: "confirmed",
                        ticketType: "General Admission",
                        rsvpDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                        plusOnes: 2
                    }
                ],
                waitlist: [],
                tickets: [
                    { id: "1", name: "General Admission", price: 0, quantity: 200, sold: 156, description: "Free entry" }
                ],
                images: [
                    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop"
                ]
            },
            {
                id: "2",
                title: "Local Business Networking Mixer",
                description: "Connect with other local business owners and entrepreneurs. Light refreshments provided.",
                organizerId: "user3",
                organizerName: "Business Association",
                organizerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
                category: "business",
                startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
                endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours later
                location: "Community Center",
                address: "456 Main Street, Neighborhood",
                capacity: 50,
                currentAttendees: 23,
                price: 25,
                isFree: false,
                status: "published",
                tags: ["networking", "business", "professional"],
                amenities: ["refreshments", "wifi", "parking"],
                attendees: [],
                waitlist: [],
                tickets: [
                    { id: "1", name: "Early Bird", price: 20, quantity: 20, sold: 15, description: "Limited time offer" },
                    { id: "2", name: "Regular", price: 25, quantity: 30, sold: 8, description: "Standard admission" }
                ],
                images: []
            },
            {
                id: "3",
                title: "Community Garden Workshop",
                description: "Learn about sustainable gardening practices and help maintain our community garden.",
                organizerId: "user4",
                organizerName: "Green Thumbs Club",
                organizerAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
                category: "educational",
                startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
                endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // 3 hours later
                location: "Community Garden",
                address: "789 Garden Lane, Neighborhood",
                capacity: 30,
                currentAttendees: 30,
                price: 0,
                isFree: true,
                status: "published",
                tags: ["gardening", "education", "sustainability"],
                amenities: ["tools", "materials", "refreshments"],
                attendees: [],
                waitlist: [
                    {
                        id: "w1",
                        userId: "user5",
                        userName: "Jane Smith",
                        userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                        status: "pending",
                        ticketType: "General Admission",
                        rsvpDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                        plusOnes: 0
                    }
                ],
                tickets: [
                    { id: "1", name: "General Admission", price: 0, quantity: 30, sold: 30, description: "Free workshop" }
                ],
                images: []
            }
        ];

        setEvents(mockEvents);
    }, []);

    const handleCreateEvent = () => {
        if (!eventTitle.trim() || !eventDescription.trim() || !eventStartDate || !eventEndDate || !eventLocation) {
            toast({
                title: "Error",
                description: "Please fill in all required fields",
                variant: "destructive"
            });
            return;
        }

        const newEvent: Event = {
            id: Date.now().toString(),
            title: eventTitle,
            description: eventDescription,
            organizerId: "currentUser",
            organizerName: "You",
            organizerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            category: eventCategory,
            startDate: eventStartDate,
            endDate: eventEndDate,
            location: eventLocation,
            address: eventAddress,
            capacity: eventCapacity,
            currentAttendees: 0,
            price: eventPrice,
            isFree: eventPrice === 0,
            status: "draft",
            tags: eventTags.split(",").map(tag => tag.trim()).filter(tag => tag),
            amenities: eventAmenities,
            attendees: [],
            waitlist: [],
            tickets: ticketTypes,
            images: []
        };

        setEvents(prev => [newEvent, ...prev]);
        setShowCreateEvent(false);
        setEventTitle("");
        setEventDescription("");
        setEventCategory("community");
        setEventStartDate(undefined);
        setEventEndDate(undefined);
        setEventLocation("");
        setEventAddress("");
        setEventCapacity(50);
        setEventPrice(0);
        setEventTags("");
        setEventAmenities([]);
        setTicketTypes([
            { id: "1", name: "General Admission", price: 0, quantity: 50, sold: 0, description: "Free entry" }
        ]);

        toast({
            title: "Event created!",
            description: "Your event has been created as a draft",
        });
    };

    const handlePublishEvent = (eventId: string) => {
        setEvents(prev =>
            prev.map(event =>
                event.id === eventId
                    ? { ...event, status: 'published' as const }
                    : event
            )
        );

        toast({
            title: "Event published!",
            description: "Your event is now live and accepting RSVPs",
        });
    };

    const handleCancelEvent = (eventId: string) => {
        setEvents(prev =>
            prev.map(event =>
                event.id === eventId
                    ? { ...event, status: 'cancelled' as const }
                    : event
            )
        );

        toast({
            title: "Event cancelled",
            description: "Your event has been cancelled",
        });
    };

    const addTicketType = () => {
        const newTicket: Ticket = {
            id: Date.now().toString(),
            name: "",
            price: 0,
            quantity: 50,
            sold: 0,
            description: ""
        };
        setTicketTypes(prev => [...prev, newTicket]);
    };

    const updateTicketType = (index: number, field: keyof Ticket, value: string | number) => {
        setTicketTypes(prev =>
            prev.map((ticket, i) =>
                i === index ? { ...ticket, [field]: value } : ticket
            )
        );
    };

    const removeTicketType = (index: number) => {
        if (ticketTypes.length > 1) {
            setTicketTypes(prev => prev.filter((_, i) => i !== index));
        }
    };

    const toggleAmenity = (amenity: string) => {
        setEventAmenities(prev =>
            prev.includes(amenity)
                ? prev.filter(a => a !== amenity)
                : [...prev, amenity]
        );
    };

    const getCategoryIcon = (category: Event['category']) => {
        switch (category) {
            case 'community': return <Users className="w-4 h-4" />;
            case 'business': return <DollarSign className="w-4 h-4" />;
            case 'social': return <Music className="w-4 h-4" />;
            case 'educational': return <Calendar className="w-4 h-4" />;
            case 'charity': return <CheckCircle className="w-4 h-4" />;
            default: return <Calendar className="w-4 h-4" />;
        }
    };

    const getCategoryColor = (category: Event['category']) => {
        switch (category) {
            case 'community': return "bg-blue-100 text-blue-800";
            case 'business': return "bg-green-100 text-green-800";
            case 'social': return "bg-purple-100 text-purple-800";
            case 'educational': return "bg-orange-100 text-orange-800";
            case 'charity': return "bg-red-100 text-red-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusColor = (status: Event['status']) => {
        switch (status) {
            case 'draft': return "bg-yellow-500";
            case 'published': return "bg-green-500";
            case 'cancelled': return "bg-red-500";
            case 'completed': return "bg-gray-500";
            default: return "bg-gray-500";
        }
    };

    const getAmenityIcon = (amenity: string) => {
        switch (amenity) {
            case 'food': return <Utensils className="w-4 h-4" />;
            case 'music': return <Music className="w-4 h-4" />;
            case 'wifi': return <Wifi className="w-4 h-4" />;
            case 'parking': return <Car className="w-4 h-4" />;
            case 'childcare': return <Baby className="w-4 h-4" />;
            case 'pet-friendly': return <Dog className="w-4 h-4" />;
            case 'photography': return <Camera className="w-4 h-4" />;
            default: return <CheckCircle className="w-4 h-4" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Event Planning</h2>
                    <p className="text-muted-foreground">Full event management with invites, ticketing, and capacity limits</p>
                </div>
                <Dialog open={showCreateEvent} onOpenChange={setShowCreateEvent}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Create Event
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Create New Event</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="event-title">Event Title *</Label>
                                    <Input
                                        id="event-title"
                                        placeholder="e.g., Neighborhood Summer Block Party"
                                        value={eventTitle}
                                        onChange={(e) => setEventTitle(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="event-category">Category</Label>
                                    <Select value={eventCategory} onValueChange={(value: Event['category']) => setEventCategory(value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="community">Community</SelectItem>
                                            <SelectItem value="business">Business</SelectItem>
                                            <SelectItem value="social">Social</SelectItem>
                                            <SelectItem value="educational">Educational</SelectItem>
                                            <SelectItem value="charity">Charity</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="event-description">Description *</Label>
                                <Textarea
                                    id="event-description"
                                    placeholder="Describe your event..."
                                    value={eventDescription}
                                    onChange={(e) => setEventDescription(e.target.value)}
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Start Date *</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {eventStartDate ? format(eventStartDate, "PPP") : "Select start date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={eventStartDate}
                                                onSelect={setEventStartDate}
                                                disabled={(date) => date < new Date()}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div>
                                    <Label>End Date *</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {eventEndDate ? format(eventEndDate, "PPP") : "Select end date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={eventEndDate}
                                                onSelect={setEventEndDate}
                                                disabled={(date) => date < (eventStartDate || new Date())}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="event-location">Location *</Label>
                                    <Input
                                        id="event-location"
                                        placeholder="e.g., Community Center"
                                        value={eventLocation}
                                        onChange={(e) => setEventLocation(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="event-address">Address</Label>
                                    <Input
                                        id="event-address"
                                        placeholder="Full address"
                                        value={eventAddress}
                                        onChange={(e) => setEventAddress(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="event-capacity">Capacity</Label>
                                    <Input
                                        id="event-capacity"
                                        type="number"
                                        placeholder="50"
                                        value={eventCapacity}
                                        onChange={(e) => setEventCapacity(parseInt(e.target.value) || 0)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="event-price">Price ($)</Label>
                                    <Input
                                        id="event-price"
                                        type="number"
                                        placeholder="0"
                                        value={eventPrice}
                                        onChange={(e) => setEventPrice(parseFloat(e.target.value) || 0)}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label>Ticket Types</Label>
                                <div className="space-y-2">
                                    {ticketTypes.map((ticket, index) => (
                                        <div key={ticket.id} className="grid grid-cols-5 gap-2 items-center">
                                            <Input
                                                placeholder="Ticket name"
                                                value={ticket.name}
                                                onChange={(e) => updateTicketType(index, 'name', e.target.value)}
                                            />
                                            <Input
                                                type="number"
                                                placeholder="Price"
                                                value={ticket.price}
                                                onChange={(e) => updateTicketType(index, 'price', parseFloat(e.target.value) || 0)}
                                            />
                                            <Input
                                                type="number"
                                                placeholder="Quantity"
                                                value={ticket.quantity}
                                                onChange={(e) => updateTicketType(index, 'quantity', parseInt(e.target.value) || 0)}
                                            />
                                            <Input
                                                placeholder="Description"
                                                value={ticket.description}
                                                onChange={(e) => updateTicketType(index, 'description', e.target.value)}
                                            />
                                            {ticketTypes.length > 1 && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => removeTicketType(index)}
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={addTicketType}
                                        className="w-full"
                                    >
                                        Add Ticket Type
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <Label>Amenities</Label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {['food', 'music', 'wifi', 'parking', 'childcare', 'pet-friendly', 'photography'].map(amenity => (
                                        <div key={amenity} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={amenity}
                                                checked={eventAmenities.includes(amenity)}
                                                onCheckedChange={() => toggleAmenity(amenity)}
                                            />
                                            <Label htmlFor={amenity} className="text-sm">{amenity}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="event-tags">Tags (Optional)</Label>
                                <Input
                                    id="event-tags"
                                    placeholder="summer, family, music (comma separated)"
                                    value={eventTags}
                                    onChange={(e) => setEventTags(e.target.value)}
                                />
                            </div>

                            <Button onClick={handleCreateEvent} className="w-full">
                                Create Event
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Events List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {events.map(event => (
                    <Card key={event.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center space-x-2">
                                    {getCategoryIcon(event.category)}
                                    <Badge className={getCategoryColor(event.category)}>
                                        {event.category}
                                    </Badge>
                                </div>
                                <div className={`w-3 h-3 rounded-full ${getStatusColor(event.status)}`}></div>
                            </div>

                            <h4 className="font-semibold mb-2">{event.title}</h4>
                            <p className="text-sm text-muted-foreground mb-3">{event.description}</p>

                            <div className="flex items-center space-x-4 mb-3">
                                <div className="flex items-center space-x-1">
                                    <Avatar className="w-6 h-6">
                                        <AvatarImage src={event.organizerAvatar} />
                                        <AvatarFallback>{event.organizerName[0]}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm">{event.organizerName}</span>
                                </div>
                                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                    <MapPin className="w-3 h-3" />
                                    <span>{event.location}</span>
                                </div>
                            </div>

                            <div className="space-y-2 mb-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span>Capacity</span>
                                    <span className="font-medium">{event.currentAttendees}/{event.capacity}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: `${(event.currentAttendees / event.capacity) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                                <div className="flex items-center space-x-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>{format(event.startDate, "MMM dd")}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{format(event.startDate, "HH:mm")}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    {event.isFree ? (
                                        <span className="text-green-600 font-medium">Free</span>
                                    ) : (
                                        <span className="font-medium">${event.price}</span>
                                    )}
                                </div>
                            </div>

                            {event.amenities.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-3">
                                    {event.amenities.slice(0, 3).map(amenity => (
                                        <Badge key={amenity} variant="outline" className="text-xs">
                                            {getAmenityIcon(amenity)}
                                            <span className="ml-1">{amenity}</span>
                                        </Badge>
                                    ))}
                                    {event.amenities.length > 3 && (
                                        <Badge variant="outline" className="text-xs">
                                            +{event.amenities.length - 3} more
                                        </Badge>
                                    )}
                                </div>
                            )}

                            <div className="flex space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedEvent(event)}
                                    className="flex-1"
                                >
                                    View Details
                                </Button>
                                {event.status === 'draft' && (
                                    <Button
                                        size="sm"
                                        onClick={() => handlePublishEvent(event.id)}
                                    >
                                        Publish
                                    </Button>
                                )}
                                {event.status === 'published' && (
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleCancelEvent(event.id)}
                                    >
                                        Cancel
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Event Details */}
            {selectedEvent && (
                <Dialog open={showEventDetails} onOpenChange={setShowEventDetails}>
                    <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <DialogTitle>{selectedEvent.title}</DialogTitle>
                                    <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Badge className={getCategoryColor(selectedEvent.category)}>
                                        {selectedEvent.category}
                                    </Badge>
                                    <Badge variant={selectedEvent.status === 'published' ? 'default' : 'secondary'}>
                                        {selectedEvent.status}
                                    </Badge>
                                </div>
                            </div>
                        </DialogHeader>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Event Info */}
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold mb-2">Event Details</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="w-4 h-4" />
                                            <span>{format(selectedEvent.startDate, "PPP 'at' HH:mm")}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <MapPin className="w-4 h-4" />
                                            <span>{selectedEvent.location}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Users className="w-4 h-4" />
                                            <span>{selectedEvent.currentAttendees}/{selectedEvent.capacity} attendees</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <DollarSign className="w-4 h-4" />
                                            <span>{selectedEvent.isFree ? 'Free' : `$${selectedEvent.price}`}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-2">Tickets</h4>
                                    <div className="space-y-2">
                                        {selectedEvent.tickets.map(ticket => (
                                            <div key={ticket.id} className="flex items-center justify-between p-2 border rounded">
                                                <div>
                                                    <p className="font-medium">{ticket.name}</p>
                                                    <p className="text-sm text-muted-foreground">{ticket.description}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium">${ticket.price}</p>
                                                    <p className="text-sm text-muted-foreground">{ticket.sold}/{ticket.quantity} sold</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Attendees */}
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold mb-2">Attendees</h4>
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {selectedEvent.attendees.map(attendee => (
                                            <div key={attendee.id} className="flex items-center space-x-2 p-2 border rounded">
                                                <Avatar className="w-8 h-8">
                                                    <AvatarImage src={attendee.userAvatar} />
                                                    <AvatarFallback>{attendee.userName[0]}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">{attendee.userName}</p>
                                                    <p className="text-xs text-muted-foreground">{attendee.ticketType}</p>
                                                </div>
                                                <Badge variant={attendee.status === 'confirmed' ? 'default' : 'secondary'}>
                                                    {attendee.status}
                                                </Badge>
                                            </div>
                                        ))}
                                        {selectedEvent.attendees.length === 0 && (
                                            <p className="text-sm text-muted-foreground">No attendees yet</p>
                                        )}
                                    </div>
                                </div>

                                {selectedEvent.waitlist.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold mb-2">Waitlist</h4>
                                        <div className="space-y-2 max-h-32 overflow-y-auto">
                                            {selectedEvent.waitlist.map(attendee => (
                                                <div key={attendee.id} className="flex items-center space-x-2 p-2 border rounded">
                                                    <Avatar className="w-6 h-6">
                                                        <AvatarImage src={attendee.userAvatar} />
                                                        <AvatarFallback>{attendee.userName[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-sm">{attendee.userName}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}; 