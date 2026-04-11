# 📧 Newsletter Database Setup

Run the following SQL script in your **Supabase SQL Editor** to resolve the `PGRST205` error and enable the newsletter subscription feature.

```sql
-- 1. Ensure UUID extension is enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create the Newsletter Subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- 4. Create Triggers for updated_at (Consistency with README.md)
-- The function update_updated_at_column() should already exist from README setup
CREATE TRIGGER update_newsletter_subscribers_updated_at 
BEFORE UPDATE ON newsletter_subscribers 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. Create Security Policies

-- Policy: Allow public newsletter signup (Public Footer)
CREATE POLICY "Allow public newsletter signup" 
ON newsletter_subscribers FOR INSERT 
WITH CHECK (true);

-- Policy: Allow authenticated newsletter management (Admin Dashboard)
CREATE POLICY "Allow authenticated newsletter management" 
ON newsletter_subscribers FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated newsletter deletion" 
ON newsletter_subscribers FOR DELETE
USING (auth.role() = 'authenticated');
```

### Verification
Once run, navigate to the **Newsletter** section in your Stag-Horn Admin Dashboard. The "Table not found" error should be resolved, and you will see your list of subscribers.
