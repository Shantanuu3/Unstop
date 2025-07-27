-- Create profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(20),
  bio TEXT,
  profile_photo_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_business BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create posts table
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  photo_url TEXT,
  category VARCHAR(50),
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comments table
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create marketplace_items table
CREATE TABLE public.marketplace_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  photo_url TEXT,
  category VARCHAR(50),
  condition VARCHAR(20),
  status VARCHAR(20) DEFAULT 'available',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create services table
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  hourly_rate DECIMAL(10,2),
  category VARCHAR(50),
  availability JSONB,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_date DATE,
  start_time TIME,
  duration INTEGER,
  special_instructions TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id UUID REFERENCES public.marketplace_items(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create business_profiles table
CREATE TABLE public.business_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name VARCHAR(100) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  phone VARCHAR(20),
  website VARCHAR(255),
  hours TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('profile-photos', 'profile-photos', true),
  ('post-photos', 'post-photos', true),
  ('marketplace-photos', 'marketplace-photos', true),
  ('service-photos', 'service-photos', true),
  ('business-logos', 'business-logos', true);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for posts
CREATE POLICY "Posts are viewable by everyone" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Users can create posts" ON public.posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own posts" ON public.posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own posts" ON public.posts FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for comments
CREATE POLICY "Comments are viewable by everyone" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own comments" ON public.comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for marketplace_items
CREATE POLICY "Marketplace items are viewable by everyone" ON public.marketplace_items FOR SELECT USING (true);
CREATE POLICY "Users can create marketplace items" ON public.marketplace_items FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Users can update their own items" ON public.marketplace_items FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "Users can delete their own items" ON public.marketplace_items FOR DELETE USING (auth.uid() = seller_id);

-- RLS Policies for services
CREATE POLICY "Services are viewable by everyone" ON public.services FOR SELECT USING (true);
CREATE POLICY "Users can create services" ON public.services FOR INSERT WITH CHECK (auth.uid() = provider_id);
CREATE POLICY "Users can update their own services" ON public.services FOR UPDATE USING (auth.uid() = provider_id);
CREATE POLICY "Users can delete their own services" ON public.services FOR DELETE USING (auth.uid() = provider_id);

-- RLS Policies for bookings
CREATE POLICY "Users can view their own bookings" ON public.bookings FOR SELECT USING (auth.uid() = customer_id OR auth.uid() = (SELECT provider_id FROM public.services WHERE id = service_id));
CREATE POLICY "Users can create bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Service providers can update booking status" ON public.bookings FOR UPDATE USING (auth.uid() = (SELECT provider_id FROM public.services WHERE id = service_id));

-- RLS Policies for messages
CREATE POLICY "Users can view their own messages" ON public.messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- RLS Policies for business_profiles
CREATE POLICY "Business profiles are viewable by everyone" ON public.business_profiles FOR SELECT USING (true);
CREATE POLICY "Users can manage their own business profile" ON public.business_profiles FOR ALL USING (auth.uid() = user_id);

-- Storage policies for profile photos
CREATE POLICY "Profile photos are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'profile-photos');
CREATE POLICY "Users can upload their own profile photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update their own profile photos" ON storage.objects FOR UPDATE USING (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own profile photos" ON storage.objects FOR DELETE USING (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for post photos
CREATE POLICY "Post photos are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'post-photos');
CREATE POLICY "Users can upload post photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'post-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update their own post photos" ON storage.objects FOR UPDATE USING (bucket_id = 'post-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own post photos" ON storage.objects FOR DELETE USING (bucket_id = 'post-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for marketplace photos
CREATE POLICY "Marketplace photos are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'marketplace-photos');
CREATE POLICY "Users can upload marketplace photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'marketplace-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update their own marketplace photos" ON storage.objects FOR UPDATE USING (bucket_id = 'marketplace-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own marketplace photos" ON storage.objects FOR DELETE USING (bucket_id = 'marketplace-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for service photos
CREATE POLICY "Service photos are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'service-photos');
CREATE POLICY "Users can upload service photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'service-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update their own service photos" ON storage.objects FOR UPDATE USING (bucket_id = 'service-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own service photos" ON storage.objects FOR DELETE USING (bucket_id = 'service-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for business logos
CREATE POLICY "Business logos are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'business-logos');
CREATE POLICY "Users can upload business logos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'business-logos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update their own business logos" ON storage.objects FOR UPDATE USING (bucket_id = 'business-logos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own business logos" ON storage.objects FOR DELETE USING (bucket_id = 'business-logos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create function to handle profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, address)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data ->> 'address', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers for tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_marketplace_items_updated_at BEFORE UPDATE ON public.marketplace_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_business_profiles_updated_at BEFORE UPDATE ON public.business_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();