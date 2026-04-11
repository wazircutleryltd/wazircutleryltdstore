-- Step 1: Add slug column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Step 2: Create a function to generate slugs from names
CREATE OR REPLACE FUNCTION generate_slug(name TEXT) RETURNS TEXT AS $$
BEGIN
  RETURN LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]+', '-', 'g'));
END;
$$ LANGUAGE plpgsql;

-- Step 3: Populate existing rows with slugs based on their names
UPDATE products SET slug = generate_slug(name) WHERE slug IS NULL;

-- Step 4: Add a trigger to automatically maintain slugs if needed (optional)
-- Or just handle it in the application code.

-- Step 5: Add an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- Final: Ensure the slug column is NOT NULL for future entries
ALTER TABLE products ALTER COLUMN slug SET NOT NULL;
