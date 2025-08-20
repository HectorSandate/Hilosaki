/*
  # Fix order number generation trigger

  1. Changes
    - Update the `set_order_number()` function to generate truly unique order numbers
    - Use UUID-based generation instead of timestamp-based to avoid duplicates
    - Ensure the trigger generates unique order numbers every time

  2. Security
    - No changes to RLS policies
    - Maintains existing security structure
*/

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS set_order_number_trigger ON orders;
DROP FUNCTION IF EXISTS set_order_number();

-- Create new function that generates unique order numbers using UUID
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  -- Generate a unique order number using UUID
  -- Format: ORD-{first 8 chars of UUID}-{next 4 chars}
  NEW.order_number := 'ORD-' || SUBSTRING(gen_random_uuid()::text, 1, 8) || '-' || SUBSTRING(gen_random_uuid()::text, 1, 4);
  
  -- Ensure uniqueness by checking if it already exists (very unlikely but safe)
  WHILE EXISTS (SELECT 1 FROM orders WHERE order_number = NEW.order_number) LOOP
    NEW.order_number := 'ORD-' || SUBSTRING(gen_random_uuid()::text, 1, 8) || '-' || SUBSTRING(gen_random_uuid()::text, 1, 4);
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
CREATE TRIGGER set_order_number_trigger
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number();