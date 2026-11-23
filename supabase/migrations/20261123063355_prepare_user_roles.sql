-- Prepare the database for cleaner and customer accounts.
--
-- Roles:
--   admin    -> manages everything (assigned by hand, never automatically)
--   employee -> a cleaner with an account, linked to a row in public.employees
--   customer -> a client with an account (future booking)
--
-- Nothing changes for the current admins. Public sign-up stays disabled.

-- 1. Valid roles only, and the safest role by default.
ALTER TABLE public.profiles
  ALTER COLUMN role SET DEFAULT 'customer';

UPDATE public.profiles SET role = 'customer' WHERE role IS NULL;

ALTER TABLE public.profiles
  ALTER COLUMN role SET NOT NULL;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('admin', 'employee', 'customer'));

-- 2. Every new user starts as a customer. Becoming a cleaner (employee) is an
--    explicit admin action that links the account to an employee record.
--    Nothing the user sends at sign-up can change this, and admin is never
--    assigned automatically.
CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
      split_part(new.email, '@', 1)
    ),
    'customer'
  );

  return new;
end;
$function$;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated, service_role;

-- 3. Link a cleaner's login to their employee record.
ALTER TABLE public.employees
  ADD COLUMN user_id uuid UNIQUE REFERENCES auth.users (id) ON DELETE SET NULL;

-- 4. Helper for future policies: the employee record of the signed-in cleaner.
--    Returns null for admins, customers, anonymous users and inactive employees.
CREATE OR REPLACE FUNCTION public.current_employee_id()
  RETURNS uuid
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
  select e.id
  from public.employees e
  join public.profiles p on p.id = e.user_id
  where e.user_id = auth.uid()
    and e.status = 'active'
    and p.role = 'employee';
$function$;

REVOKE ALL ON FUNCTION public.current_employee_id() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.current_employee_id() TO authenticated;
