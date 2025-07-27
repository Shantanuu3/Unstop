/*
  # Complete LocalHub Database Schema

  1. New Tables
    - `users` - User authentication and basic info
    - `posts` - Social feed posts
    - `comments` - Post comments
    - `marketplace_items` - Items for sale
    - `services` - Service offerings
    - `bookings` - Service bookings
    - `messages` - Direct messages
    - `business_profiles` - Business information
    - `poll_votes` - Track poll voting to prevent duplicates

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Prevent duplicate voting on polls

  3. Functions
    - Update timestamp triggers
    - User creation trigger
*/

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email varchar(255) UNIQUE NOT NULL,
  name varchar(100) NOT NULL,
  address text NOT NULL,
  phone varchar(20),
  bio text,
  profile_photo_url text,
  is_verified boolean DEFAULT false,
  is_business boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  photo_url text,
  category varchar(50),
  like_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Marketplace items
CREATE TABLE IF NOT EXISTS marketplace_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title varchar(100) NOT NULL,
  description text,
  price numeric(10,2),
  photo_url text,
  category varchar(50),
  condition varchar(20),
  status varchar(20) DEFAULT 'available',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE marketplace_items ENABLE ROW LEVEL SECURITY;

-- Services
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name varchar(100) NOT NULL,
  description text,
  hourly_rate numeric(10,2),
  category varchar(50),
  availability jsonb,
  photo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES users(id) ON DELETE CASCADE,
  booking_date date,
  start_time time,
  duration integer,
  special_instructions text,
  status varchar(20) DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES users(id) ON DELETE CASCADE,
  recipient_id uuid REFERENCES users(id) ON DELETE CASCADE,
  item_id uuid REFERENCES marketplace_items(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Business profiles
CREATE TABLE IF NOT EXISTS business_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  business_name varchar(100) NOT NULL,
  description text,
  category varchar(50),
  phone varchar(20),
  website varchar(255),
  hours text,
  logo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;

-- Poll votes tracking table
CREATE TABLE IF NOT EXISTS poll_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id varchar(50) NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  option_ids text[] NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(poll_id, user_id)
);

ALTER TABLE poll_votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users policies
CREATE POLICY "Users can read all profiles" ON users FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Posts policies
CREATE POLICY "Posts are viewable by everyone" ON posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create posts" ON posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON posts FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON posts FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Comments are viewable by everyone" ON comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create comments" ON comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON comments FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON comments FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Marketplace policies
CREATE POLICY "Marketplace items are viewable by everyone" ON marketplace_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create marketplace items" ON marketplace_items FOR INSERT TO authenticated WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Users can update own items" ON marketplace_items FOR UPDATE TO authenticated USING (auth.uid() = seller_id);
CREATE POLICY "Users can delete own items" ON marketplace_items FOR DELETE TO authenticated USING (auth.uid() = seller_id);

-- Services policies
CREATE POLICY "Services are viewable by everyone" ON services FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create services" ON services FOR INSERT TO authenticated WITH CHECK (auth.uid() = provider_id);
CREATE POLICY "Users can update own services" ON services FOR UPDATE TO authenticated USING (auth.uid() = provider_id);
CREATE POLICY "Users can delete own services" ON services FOR DELETE TO authenticated USING (auth.uid() = provider_id);

-- Bookings policies
CREATE POLICY "Users can view their own bookings" ON bookings FOR SELECT TO authenticated 
  USING (auth.uid() = customer_id OR auth.uid() = (SELECT provider_id FROM services WHERE services.id = bookings.service_id));
CREATE POLICY "Users can create bookings" ON bookings FOR INSERT TO authenticated WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Service providers can update booking status" ON bookings FOR UPDATE TO authenticated 
  USING (auth.uid() = (SELECT provider_id FROM services WHERE services.id = bookings.service_id));

-- Messages policies
CREATE POLICY "Users can view their own messages" ON messages FOR SELECT TO authenticated 
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Users can send messages" ON messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id);

-- Business profiles policies
CREATE POLICY "Business profiles are viewable by everyone" ON business_profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage their own business profile" ON business_profiles FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Poll votes policies
CREATE POLICY "Users can view poll votes" ON poll_votes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create poll votes" ON poll_votes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Update timestamp triggers
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
    CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_posts_updated_at') THEN
    CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_marketplace_items_updated_at') THEN
    CREATE TRIGGER update_marketplace_items_updated_at BEFORE UPDATE ON marketplace_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_services_updated_at') THEN
    CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_bookings_updated_at') THEN
    CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_business_profiles_updated_at') THEN
    CREATE TRIGGER update_business_profiles_updated_at BEFORE UPDATE ON business_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email, name, address, phone, bio, profile_photo_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'address', ''),
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'bio',
    NEW.raw_user_meta_data->>'profile_photo_url'
  );
  RETURN NEW;
END;
$$ language 'plpgsql' security definer;

-- Trigger for new user creation
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION handle_new_user();
  END IF;
END $$;