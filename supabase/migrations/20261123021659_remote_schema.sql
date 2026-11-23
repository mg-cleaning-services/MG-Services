SET local check_function_bodies = off;

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" REVOKE ALL ON SEQUENCES FROM "anon";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" REVOKE ALL ON SEQUENCES FROM "authenticated";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" REVOKE ALL ON SEQUENCES FROM "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" REVOKE ALL ON FUNCTIONS FROM "anon";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" REVOKE ALL ON FUNCTIONS FROM "authenticated";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" REVOKE ALL ON FUNCTIONS FROM "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" REVOKE ALL ON TABLES FROM "anon";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" REVOKE ALL ON TABLES FROM "authenticated";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" REVOKE ALL ON TABLES FROM "service_role";

CREATE SCHEMA "private";

CREATE EXTENSION "pg_cron";

CREATE EXTENSION "pg_net" SCHEMA "extensions";

CREATE SEQUENCE "public"."employee_code_seq" AS bigint INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1 NO CYCLE;

REVOKE ALL ON SEQUENCE "public"."employee_code_seq" FROM "anon", "service_role";

CREATE SEQUENCE "public"."job_code_seq" AS bigint INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1 NO CYCLE;

REVOKE ALL ON SEQUENCE "public"."job_code_seq" FROM "anon", "authenticated", "service_role";

CREATE SEQUENCE "public"."request_code_seq" AS bigint INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1 NO CYCLE;

REVOKE ALL ON SEQUENCE "public"."request_code_seq" FROM "anon", "authenticated", "service_role";

CREATE TABLE "private"."instagram_tokens" (
  "id"                integer                  NOT NULL DEFAULT 1,
  "expires_at"        timestamp with time zone,
  "last_refreshed_at" timestamp with time zone,
  "created_at"        timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"        timestamp with time zone NOT NULL DEFAULT now(),
  "vault_secret_id"   uuid,
  CONSTRAINT "instagram_tokens_id_check" CHECK ((id = 1)),
  CONSTRAINT "instagram_tokens_pkey" PRIMARY KEY (id),
  CONSTRAINT "instagram_tokens_vault_secret_unique" UNIQUE (vault_secret_id)
);

ALTER TABLE "private"."instagram_tokens"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."candidate_applications" (
  "id"               uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "invite_id"        uuid                     NOT NULL,
  "name"             text                     NOT NULL,
  "location"         text,
  "years_experience" integer                  NOT NULL DEFAULT 0,
  "phone"            text,
  "email"            text,
  "tagline"          text,
  "bio"              text,
  "languages"        text[]                   NOT NULL DEFAULT '{}'::text[],
  "specialties"      text[]                   NOT NULL DEFAULT '{}'::text[],
  "traits"           text[]                   NOT NULL DEFAULT '{}'::text[],
  "interests"        text[]                   NOT NULL DEFAULT '{}'::text[],
  "photo_url"        text,
  "status"           text                     NOT NULL DEFAULT 'submitted'::text,
  "submitted_at"     timestamp with time zone NOT NULL DEFAULT now(),
  "reviewed_at"      timestamp with time zone,
  "reviewed_by"      uuid,
  "created_at"       timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"       timestamp with time zone NOT NULL DEFAULT now(),
  "employee_id"      uuid,
  "role"             text,
  CONSTRAINT "candidate_applications_employee_id_key" UNIQUE (employee_id),
  CONSTRAINT "candidate_applications_invite_id_key" UNIQUE (invite_id),
  CONSTRAINT "candidate_applications_pkey" PRIMARY KEY (id),
  CONSTRAINT "candidate_applications_status_check" CHECK ((status = ANY (ARRAY['submitted'::text, 'approved'::text, 'rejected'::text]))),
  CONSTRAINT "candidate_applications_years_experience_check" CHECK ((years_experience >= 0))
);

ALTER TABLE "public"."candidate_applications"
  ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "public"."candidate_applications" FROM "anon";

CREATE TABLE "public"."candidate_invites" (
  "id"         uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "token_hash" text                     NOT NULL,
  "phone"      text,
  "status"     text                     NOT NULL DEFAULT 'active'::text,
  "expires_at" timestamp with time zone NOT NULL,
  "used_at"    timestamp with time zone,
  "created_by" uuid,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "candidate_invites_pkey" PRIMARY KEY (id),
  CONSTRAINT "candidate_invites_status_check" CHECK ((status = ANY (ARRAY['active'::text, 'used'::text, 'revoked'::text]))),
  CONSTRAINT "candidate_invites_token_hash_key" UNIQUE (token_hash),
  CONSTRAINT "candidate_invites_used_status_check" CHECK ((((status = 'used'::text) AND (used_at IS NOT NULL)) OR (status <> 'used'::text)))
);

ALTER TABLE "public"."candidate_invites"
  ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "public"."candidate_invites" FROM "anon";

CREATE TABLE "public"."cleaning_services" (
  "id"                     uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "slug"                   text                     NOT NULL,
  "name"                   text                     NOT NULL,
  "description"            text,
  "category"               text                     NOT NULL,
  "pricing_type"           text                     NOT NULL,
  "unit"                   text,
  "base_price"             numeric(10,2),
  "estimated_labour_hours" numeric(5,2),
  "available_as_addon"     boolean                  NOT NULL DEFAULT false,
  "publicly_visible"       boolean                  NOT NULL DEFAULT false,
  "active"                 boolean                  NOT NULL DEFAULT true,
  "display_order"          integer                  NOT NULL DEFAULT 0,
  "created_at"             timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"             timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "cleaning_services_base_price_check" CHECK (((base_price IS NULL) OR (base_price >= (0)::numeric))),
  CONSTRAINT "cleaning_services_estimated_labour_hours_check" CHECK (((estimated_labour_hours IS NULL) OR (estimated_labour_hours > (0)::numeric))),
  CONSTRAINT "cleaning_services_pkey" PRIMARY KEY (id),
  CONSTRAINT "cleaning_services_pricing_type_check" CHECK ((pricing_type = ANY (ARRAY['included'::text, 'fixed'::text, 'per_unit'::text, 'tiered'::text, 'quote'::text]))),
  CONSTRAINT "cleaning_services_slug_key" UNIQUE (slug)
);

ALTER TABLE "public"."cleaning_services"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."employee_slugs" (
  "id"          uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "slug"        text                     NOT NULL,
  "employee_id" uuid,
  "created_at"  timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "employee_slugs_pkey" PRIMARY KEY (id),
  CONSTRAINT "employee_slugs_slug_key" UNIQUE (slug)
);

ALTER TABLE "public"."employee_slugs"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."employees" (
  "id"               uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "name"             text                     NOT NULL,
  "slug"             text                     NOT NULL,
  "role"             text                     NOT NULL,
  "location"         text,
  "years_experience" integer                  NOT NULL DEFAULT 0,
  "phone"            text,
  "tagline"          text,
  "bio"              text,
  "languages"        text[]                   NOT NULL DEFAULT '{}'::text[],
  "specialties"      text[]                   NOT NULL DEFAULT '{}'::text[],
  "traits"           text[]                   NOT NULL DEFAULT '{}'::text[],
  "interests"        text[]                   NOT NULL DEFAULT '{}'::text[],
  "photo_url"        text,
  "public_profile"   boolean                  NOT NULL DEFAULT false,
  "status"           text                     NOT NULL DEFAULT 'active'::text,
  "created_at"       timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"       timestamp with time zone NOT NULL DEFAULT now(),
  "employee_code"    text,
  "email"            text,
  CONSTRAINT "employees_employee_code_key" UNIQUE (employee_code),
  CONSTRAINT "employees_pkey" PRIMARY KEY (id),
  CONSTRAINT "employees_slug_key" UNIQUE (slug),
  CONSTRAINT "employees_status_check" CHECK ((status = ANY (ARRAY['active'::text, 'inactive'::text]))),
  CONSTRAINT "employees_years_experience_check" CHECK ((years_experience >= 0))
);

ALTER TABLE "public"."employees"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."job_assignments" (
  "job_id"      uuid                     NOT NULL,
  "employee_id" uuid                     NOT NULL,
  "assigned_at" timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "job_assignments_pkey" PRIMARY KEY (job_id, employee_id)
);

ALTER TABLE "public"."job_assignments"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."jobs" (
  "id"                     uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "job_code"               text,
  "request_id"             uuid,
  "job_type"               text                     NOT NULL DEFAULT 'cleaning'::text,
  "source"                 text                     NOT NULL DEFAULT 'website'::text,
  "status"                 text                     NOT NULL DEFAULT 'unassigned'::text,
  "first_name"             text                     NOT NULL,
  "last_name"              text,
  "phone"                  text                     NOT NULL,
  "email"                  text,
  "preferred_contact"      text,
  "request_type"           text                     NOT NULL,
  "package_id"             uuid,
  "selected_services"      text[]                   NOT NULL DEFAULT '{}'::text[],
  "extras"                 text[]                   NOT NULL DEFAULT '{}'::text[],
  "property_type"          text,
  "floors"                 text,
  "bedrooms"               text,
  "bathrooms"              text,
  "kitchens"               text,
  "balconies"              text,
  "laundries"              text,
  "suburb"                 text                     NOT NULL,
  "postcode"               text,
  "pets"                   text,
  "street_address"         text                     NOT NULL,
  "unit"                   text,
  "access_instructions"    text,
  "parking"                text,
  "contact_on_arrival"     boolean                  NOT NULL DEFAULT false,
  "service_date"           date                     NOT NULL,
  "start_time"             time without time zone   NOT NULL,
  "estimated_labour_hours" numeric(5,2)             NOT NULL,
  "final_price"            numeric(10,2),
  "notes"                  text,
  "created_at"             timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"             timestamp with time zone NOT NULL DEFAULT now(),
  "agreed_price"           numeric,
  "end_time"               time without time zone,
  "service_quantities"     jsonb                    NOT NULL DEFAULT '{}'::jsonb,
  "estimated_price"        numeric(10,2),
  CONSTRAINT "jobs_agreed_price_check" CHECK (((agreed_price IS NULL) OR (agreed_price >= (0)::numeric))),
  CONSTRAINT "jobs_estimated_labour_hours_check" CHECK ((estimated_labour_hours > (0)::numeric)),
  CONSTRAINT "jobs_final_price_check" CHECK (((final_price IS NULL) OR (final_price >= (0)::numeric))),
  CONSTRAINT "jobs_job_code_key" UNIQUE (job_code),
  CONSTRAINT "jobs_pkey" PRIMARY KEY (id),
  CONSTRAINT "jobs_preferred_contact_check" CHECK (((preferred_contact IS NULL) OR (preferred_contact = ANY (ARRAY['whatsapp'::text, 'phone'::text, 'email'::text])))),
  CONSTRAINT "jobs_request_id_key" UNIQUE (request_id),
  CONSTRAINT "jobs_request_type_check" CHECK ((request_type = ANY (ARRAY['package'::text, 'custom'::text, 'unsure'::text]))),
  CONSTRAINT "jobs_service_time_check" CHECK (((end_time IS NULL) OR (end_time > start_time))),
  CONSTRAINT "jobs_source_check" CHECK ((source = ANY (ARRAY['website'::text, 'phone'::text, 'whatsapp'::text, 'referral'::text, 'returning_customer'::text, 'other'::text]))),
  CONSTRAINT "jobs_status_check" CHECK ((status = ANY (ARRAY['unassigned'::text, 'assigned'::text, 'completed'::text, 'cancelled'::text])))
);

ALTER TABLE "public"."jobs"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."package_pricing" (
  "id"                     uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "package_id"             uuid                     NOT NULL,
  "bedrooms"               integer                  NOT NULL,
  "bathrooms"              integer                  NOT NULL,
  "price"                  numeric(10,2)            NOT NULL,
  "estimated_labour_hours" numeric(5,2),
  "active"                 boolean                  NOT NULL DEFAULT true,
  "created_at"             timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"             timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "package_pricing_bathrooms_check" CHECK ((bathrooms > 0)),
  CONSTRAINT "package_pricing_bedrooms_check" CHECK ((bedrooms > 0)),
  CONSTRAINT "package_pricing_estimated_labour_hours_check" CHECK ((estimated_labour_hours > (0)::numeric)),
  CONSTRAINT "package_pricing_pkey" PRIMARY KEY (id),
  CONSTRAINT "package_pricing_price_check" CHECK ((price >= (0)::numeric)),
  CONSTRAINT "package_pricing_unique_combination" UNIQUE (package_id, bedrooms, bathrooms)
);

ALTER TABLE "public"."package_pricing"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."package_services" (
  "package_id"    uuid                     NOT NULL,
  "service_id"    uuid                     NOT NULL,
  "display_order" integer                  NOT NULL DEFAULT 0,
  "created_at"    timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "package_services_pkey" PRIMARY KEY (package_id, service_id)
);

ALTER TABLE "public"."package_services"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."profiles" (
  "id"         uuid                     NOT NULL,
  "full_name"  text                     NOT NULL,
  "role"       text                     DEFAULT 'employee'::text,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now(),
  CONSTRAINT "profiles_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."profiles"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."request_assignments" (
  "request_id"  uuid                     NOT NULL,
  "employee_id" uuid                     NOT NULL,
  "assigned_at" timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "request_assignments_pkey" PRIMARY KEY (request_id, employee_id)
);

ALTER TABLE "public"."request_assignments"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."requests" (
  "id"                      uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "request_code"            text,
  "source"                  text                     NOT NULL DEFAULT 'website'::text,
  "status"                  text                     NOT NULL DEFAULT 'new'::text,
  "first_name"              text                     NOT NULL,
  "last_name"               text,
  "phone"                   text                     NOT NULL,
  "email"                   text,
  "preferred_contact"       text                     NOT NULL,
  "request_type"            text                     NOT NULL,
  "package_id"              uuid,
  "selected_services"       text[]                   NOT NULL DEFAULT '{}'::text[],
  "extras"                  text[]                   NOT NULL DEFAULT '{}'::text[],
  "property_type"           text                     NOT NULL,
  "floors"                  text,
  "bedrooms"                text                     NOT NULL,
  "bathrooms"               text                     NOT NULL,
  "kitchens"                text,
  "balconies"               text,
  "laundries"               text,
  "suburb"                  text                     NOT NULL,
  "postcode"                text,
  "pets"                    text,
  "preferred_date"          date                     NOT NULL,
  "preferred_time"          text                     NOT NULL,
  "condition_level"         text,
  "last_professional_clean" text,
  "notes"                   text,
  "created_at"              timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"              timestamp with time zone NOT NULL DEFAULT now(),
  "service_date"            date,
  "start_time"              time without time zone,
  "estimated_labour_hours"  numeric,
  "estimated_price"         numeric,
  "quoted_price"            numeric,
  "end_time"                time without time zone,
  "service_quantities"      jsonb                    NOT NULL DEFAULT '{}'::jsonb,
  CONSTRAINT "requests_estimated_labour_hours_check" CHECK (((estimated_labour_hours IS NULL) OR (estimated_labour_hours > (0)::numeric))),
  CONSTRAINT "requests_estimated_price_check" CHECK (((estimated_price IS NULL) OR (estimated_price >= (0)::numeric))),
  CONSTRAINT "requests_pkey" PRIMARY KEY (id),
  CONSTRAINT "requests_preferred_contact_check" CHECK ((preferred_contact = ANY (ARRAY['whatsapp'::text, 'phone'::text, 'email'::text]))),
  CONSTRAINT "requests_quoted_price_check" CHECK (((quoted_price IS NULL) OR (quoted_price >= (0)::numeric))),
  CONSTRAINT "requests_request_code_key" UNIQUE (request_code),
  CONSTRAINT "requests_request_type_check" CHECK ((request_type = ANY (ARRAY['package'::text, 'custom'::text, 'unsure'::text]))),
  CONSTRAINT "requests_service_time_check" CHECK (((start_time IS NULL) OR (end_time IS NULL) OR (end_time > start_time))),
  CONSTRAINT "requests_source_check" CHECK ((source = ANY (ARRAY['website'::text, 'phone'::text, 'whatsapp'::text, 'referral'::text, 'returning_customer'::text, 'other'::text]))),
  CONSTRAINT "requests_status_check" CHECK ((status = ANY (ARRAY['new'::text, 'contacted'::text, 'in-discussion'::text, 'converted'::text, 'closed'::text])))
);

ALTER TABLE "public"."requests"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."service_packages" (
  "id"                    uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "slug"                  text                     NOT NULL,
  "name"                  text                     NOT NULL,
  "description"           text,
  "web_description"       text,
  "pricing_rule"          text                     NOT NULL DEFAULT 'property_size_matrix'::text,
  "conditions_exclusions" text,
  "active"                boolean                  NOT NULL DEFAULT true,
  "display_order"         integer                  NOT NULL DEFAULT 0,
  "created_at"            timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"            timestamp with time zone NOT NULL DEFAULT now(),
  "image_url"             text,
  CONSTRAINT "service_packages_pkey" PRIMARY KEY (id),
  CONSTRAINT "service_packages_slug_key" UNIQUE (slug)
);

ALTER TABLE "public"."service_packages"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."service_pricing_options" (
  "id"                     uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "service_id"             uuid                     NOT NULL,
  "variant"                text                     NOT NULL,
  "quantity"               numeric(6,2),
  "unit"                   text,
  "price"                  numeric(10,2)            NOT NULL,
  "estimated_labour_hours" numeric(5,2),
  "active"                 boolean                  NOT NULL DEFAULT true,
  "display_order"          integer                  NOT NULL DEFAULT 0,
  "created_at"             timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"             timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "service_pricing_options_estimated_labour_hours_check" CHECK (((estimated_labour_hours IS NULL) OR (estimated_labour_hours > (0)::numeric))),
  CONSTRAINT "service_pricing_options_pkey" PRIMARY KEY (id),
  CONSTRAINT "service_pricing_options_price_check" CHECK ((price >= (0)::numeric)),
  CONSTRAINT "service_pricing_options_unique_variant" UNIQUE (service_id, variant)
);

ALTER TABLE "public"."service_pricing_options"
  ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.approve_candidate_application (
  p_application_id uuid,
  p_employee_id    uuid,
  p_photo_url      text DEFAULT NULL::text
)
  RETURNS uuid
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
declare
  v_candidate public.candidate_applications%rowtype;
begin

  -- ==========================================================
  -- 1. AUTHENTICATION
  -- ==========================================================

  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;


  -- ==========================================================
  -- 2. ADMIN AUTHORIZATION
  -- ==========================================================

  if not exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  ) then
    raise exception 'Admin access required';
  end if;


  -- ==========================================================
  -- 3. REQUIRED EMPLOYEE ID
  -- ==========================================================

  if p_employee_id is null then
    raise exception 'Employee ID is required';
  end if;


  -- ==========================================================
  -- 4. LOCK CANDIDATE
  -- ==========================================================

  select *
  into v_candidate
  from public.candidate_applications
  where id = p_application_id
  for update;


  if not found then
    raise exception 'Candidate application not found';
  end if;


  -- ==========================================================
  -- 5. VALIDATE APPLICATION
  -- ==========================================================

  if v_candidate.status <> 'submitted' then
    raise exception 'Candidate application has already been reviewed';
  end if;


  if v_candidate.employee_id is not null then
    raise exception 'Candidate has already been converted to an employee';
  end if;


  if v_candidate.name is null
     or length(trim(v_candidate.name)) = 0 then
    raise exception 'Candidate name is required';
  end if;


  if v_candidate.role is null
     or length(trim(v_candidate.role)) = 0 then
    raise exception 'Candidate role is required';
  end if;


  -- ==========================================================
  -- 6. CREATE EMPLOYEE
  --
  -- slug and employee_code continue to be generated by
  -- the existing BEFORE INSERT triggers.
  --
  -- status defaults to active.
  -- public_profile defaults to false.
  -- ==========================================================

  insert into public.employees (
    id,
    name,
    role,
    location,
    years_experience,
    phone,
    email,
    tagline,
    bio,
    languages,
    specialties,
    traits,
    interests,
    photo_url
  )
  values (
    p_employee_id,
    trim(v_candidate.name),
    trim(v_candidate.role),
    v_candidate.location,
    coalesce(v_candidate.years_experience, 0),
    v_candidate.phone,
    v_candidate.email,
    v_candidate.tagline,
    v_candidate.bio,
    coalesce(v_candidate.languages, '{}'),
    coalesce(v_candidate.specialties, '{}'),
    coalesce(v_candidate.traits, '{}'),
    coalesce(v_candidate.interests, '{}'),
    nullif(trim(p_photo_url), '')
  );


  -- ==========================================================
  -- 7. COMPLETE APPLICATION
  -- ==========================================================

  update public.candidate_applications
  set
    status = 'approved',
    employee_id = p_employee_id,
    reviewed_at = now(),
    reviewed_by = auth.uid()
  where id = v_candidate.id;


  -- ==========================================================
  -- 8. RETURN EMPLOYEE
  -- ==========================================================

  return p_employee_id;

end;
$function$;

REVOKE ALL ON FUNCTION "public"."approve_candidate_application"(uuid, uuid, text) FROM PUBLIC, "anon", "service_role";

CREATE OR REPLACE FUNCTION public.convert_request_to_job (
  p_request_id          uuid,
  p_street_address      text,
  p_unit                text,
  p_suburb              text,
  p_postcode            text,
  p_access_instructions text,
  p_parking             text,
  p_contact_on_arrival  boolean,
  p_notes               text    DEFAULT NULL::text
)
  RETURNS public.jobs
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
declare
  v_request public.requests%rowtype;
  v_job public.jobs%rowtype;
  v_assignment_count integer;
begin
  -- Only admins can convert requests.
  if not public.is_admin() then
    raise exception 'Only administrators can convert requests to jobs';
  end if;

  /*
  |--------------------------------------------------------------------------
  | LOCK REQUEST
  |--------------------------------------------------------------------------
  */

  select *
  into v_request
  from public.requests
  where id = p_request_id
  for update;

  if not found then
    raise exception 'Request not found';
  end if;

  if v_request.status = 'converted' then
    raise exception 'Request has already been converted';
  end if;

  if v_request.status = 'closed' then
    raise exception 'Closed requests cannot be converted';
  end if;

  if exists (
    select 1
    from public.jobs
    where request_id = p_request_id
  ) then
    raise exception 'A job already exists for this request';
  end if;

  /*
  |--------------------------------------------------------------------------
  | VALIDATE OPERATIONAL DATA
  |--------------------------------------------------------------------------
  */

  if nullif(trim(p_street_address), '') is null then
    raise exception 'Street address is required';
  end if;

  if nullif(trim(p_suburb), '') is null then
    raise exception 'Suburb is required';
  end if;

  if v_request.service_date is null then
    raise exception 'Service date is required';
  end if;

  if v_request.start_time is null then
    raise exception 'Start time is required';
  end if;

  if v_request.end_time is null then
    raise exception 'End time is required';
  end if;

  if v_request.end_time <= v_request.start_time then
    raise exception 'End time must be later than start time';
  end if;

  if
    v_request.estimated_labour_hours is null
    or v_request.estimated_labour_hours <= 0
  then
    raise exception 'Estimated labour hours must be greater than zero';
  end if;

  if
    v_request.quoted_price is not null
    and v_request.quoted_price < 0
  then
    raise exception 'Quoted price cannot be negative';
  end if;

  /*
  |--------------------------------------------------------------------------
  | RE-CHECK PLANNED EMPLOYEE CONFLICTS
  |--------------------------------------------------------------------------
  */

  if exists (
    select 1
    from public.request_assignments ra
    join public.job_assignments ja
      on ja.employee_id = ra.employee_id
    join public.jobs existing_job
      on existing_job.id = ja.job_id
    where ra.request_id = p_request_id
      and existing_job.service_date = v_request.service_date
      and existing_job.end_time is not null
      and existing_job.status not in ('completed', 'cancelled')
      and existing_job.start_time < v_request.end_time
      and existing_job.end_time > v_request.start_time
  ) then
    raise exception
      'One or more planned employees have a conflicting job';
  end if;

  /*
  |--------------------------------------------------------------------------
  | CREATE JOB
  |--------------------------------------------------------------------------
  |
  | The Request is the source of truth for planning and commercial data.
  |
  */

  insert into public.jobs (
    request_id,

    job_type,
    source,
    status,

    first_name,
    last_name,
    phone,
    email,
    preferred_contact,

    request_type,
    package_id,
    selected_services,
    extras,
    service_quantities,

    property_type,
    floors,
    bedrooms,
    bathrooms,
    kitchens,
    balconies,
    laundries,
    suburb,
    postcode,
    pets,

    street_address,
    unit,

    access_instructions,
    parking,
    contact_on_arrival,

    service_date,
    start_time,
    end_time,
    estimated_labour_hours,

    agreed_price,
    final_price,

    notes
  )
  values (
    v_request.id,

    'cleaning',
    v_request.source,
    'unassigned',

    v_request.first_name,
    v_request.last_name,
    v_request.phone,
    v_request.email,
    v_request.preferred_contact,

    v_request.request_type,
    v_request.package_id,
    coalesce(v_request.selected_services, '{}'),
    coalesce(v_request.extras, '{}'),
    coalesce(v_request.service_quantities, '{}'::jsonb),

    v_request.property_type,
    v_request.floors,
    v_request.bedrooms,
    v_request.bathrooms,
    v_request.kitchens,
    v_request.balconies,
    v_request.laundries,
    trim(p_suburb),
    nullif(trim(p_postcode), ''),
    v_request.pets,

    trim(p_street_address),
    nullif(trim(p_unit), ''),

    nullif(trim(p_access_instructions), ''),
    nullif(trim(p_parking), ''),
    coalesce(p_contact_on_arrival, false),

    v_request.service_date,
    v_request.start_time,
    v_request.end_time,
    v_request.estimated_labour_hours,

    v_request.quoted_price,
    null,

    nullif(trim(p_notes), '')
  )
  returning *
  into v_job;

  /*
  |--------------------------------------------------------------------------
  | TRANSFER PRELIMINARY TEAM
  |--------------------------------------------------------------------------
  */

  insert into public.job_assignments (
    job_id,
    employee_id
  )
  select
    v_job.id,
    ra.employee_id
  from public.request_assignments ra
  where ra.request_id = p_request_id;

  get diagnostics v_assignment_count = row_count;

  /*
  |--------------------------------------------------------------------------
  | JOB STATUS
  |--------------------------------------------------------------------------
  */

  if v_assignment_count > 0 then
    update public.jobs
    set status = 'assigned'
    where id = v_job.id
    returning *
    into v_job;
  end if;

  /*
  |--------------------------------------------------------------------------
  | COMPLETE REQUEST
  |--------------------------------------------------------------------------
  */

  update public.requests
  set
    status = 'converted',
    updated_at = now()
  where id = p_request_id;

  return v_job;
end;
$function$;

REVOKE ALL ON FUNCTION "public"."convert_request_to_job"(uuid, text, text, text, text, text, text, boolean, text) FROM "anon", "authenticated", "service_role";

CREATE OR REPLACE FUNCTION public.create_candidate_invite (
  p_phone           text    DEFAULT NULL::text,
  p_expires_in_days integer DEFAULT 7
)
  RETURNS TABLE (
    invite_id  uuid,
    token      text,
    expires_at timestamp with time zone
  )
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
declare

  v_token text;

  v_hash text;

  v_invite_id uuid;

  v_expires_at timestamptz;

begin

  -- ----------------------------------------------------------
  -- Verify that the current user is an admin
  -- ----------------------------------------------------------

  if not exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  ) then

    raise exception 'Not authorized';

  end if;


  -- ----------------------------------------------------------
  -- Validate expiration
  -- ----------------------------------------------------------

  if p_expires_in_days < 1
     or p_expires_in_days > 30 then

    raise exception
      'Expiration must be between 1 and 30 days';

  end if;


  -- ----------------------------------------------------------
  -- Generate cryptographically secure token
  -- ----------------------------------------------------------

  v_token :=
    encode(
      extensions.gen_random_bytes(32),
      'hex'
    );


  -- ----------------------------------------------------------
  -- Store only SHA-256 hash
  -- ----------------------------------------------------------

  v_hash :=
    encode(
      extensions.digest(
        v_token,
        'sha256'
      ),
      'hex'
    );


  -- ----------------------------------------------------------
  -- Calculate expiration
  -- ----------------------------------------------------------

  v_expires_at :=
    now()
    + make_interval(
        days => p_expires_in_days
      );


  -- ----------------------------------------------------------
  -- Insert invitation
  -- ----------------------------------------------------------

  insert into public.candidate_invites (
    token_hash,
    phone,
    expires_at,
    created_by
  )

  values (
    v_hash,
    nullif(trim(p_phone), ''),
    v_expires_at,
    auth.uid()
  )

  returning id
  into v_invite_id;


  -- ----------------------------------------------------------
  -- Return raw token once
  -- ----------------------------------------------------------

  return query

  select
    v_invite_id,
    v_token,
    v_expires_at;

end;
$function$;

REVOKE ALL ON FUNCTION "public"."create_candidate_invite"(text, integer) FROM PUBLIC, "anon", "service_role";

CREATE OR REPLACE FUNCTION public.create_job_with_assignments (
  p_job          jsonb,
  p_employee_ids uuid[] DEFAULT '{}'::uuid[]
)
  RETURNS public.jobs
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
declare
  v_job public.jobs;
  v_employee_id uuid;
begin
  /*
  |--------------------------------------------------------------------------
  | AUTHORIZATION
  |--------------------------------------------------------------------------
  */

  if not public.is_admin() then
    raise exception 'Only admins can create jobs';
  end if;

  /*
  |--------------------------------------------------------------------------
  | BASIC VALIDATION
  |--------------------------------------------------------------------------
  */

  if nullif(trim(p_job ->> 'first_name'), '') is null then
    raise exception 'Customer first name is required';
  end if;

  if nullif(trim(p_job ->> 'phone'), '') is null then
    raise exception 'Customer phone is required';
  end if;

  if nullif(trim(p_job ->> 'request_type'), '') is null then
    raise exception 'Service type is required';
  end if;

  if nullif(trim(p_job ->> 'street_address'), '') is null then
    raise exception 'Street address is required';
  end if;

  if nullif(trim(p_job ->> 'suburb'), '') is null then
    raise exception 'Suburb is required';
  end if;

  if nullif(p_job ->> 'service_date', '') is null then
    raise exception 'Service date is required';
  end if;

  if nullif(p_job ->> 'start_time', '') is null then
    raise exception 'Start time is required';
  end if;

  if nullif(p_job ->> 'end_time', '') is null then
    raise exception 'End time is required';
  end if;

  if
    (p_job ->> 'end_time')::time
    <=
    (p_job ->> 'start_time')::time
  then
    raise exception 'End time must be later than start time';
  end if;

  if
    nullif(p_job ->> 'estimated_labour_hours', '') is null
    or
    (p_job ->> 'estimated_labour_hours')::numeric <= 0
  then
    raise exception 'Estimated labour hours must be greater than zero';
  end if;

  /*
  |--------------------------------------------------------------------------
  | VALIDATE EMPLOYEES
  |--------------------------------------------------------------------------
  |
  | Every selected employee must:
  |
  | - exist
  | - be active
  |
  */

  foreach v_employee_id in array p_employee_ids
  loop
    if not exists (
      select 1
      from public.employees e
      where e.id = v_employee_id
        and e.status = 'active'
    ) then
      raise exception
        'Employee % does not exist or is not active',
        v_employee_id;
    end if;
  end loop;

  /*
  |--------------------------------------------------------------------------
  | CHECK JOB CONFLICTS
  |--------------------------------------------------------------------------
  |
  | existing.start < proposed.end
  | AND
  | existing.end > proposed.start
  |
  | Back-to-back jobs are allowed.
  |
  */

  if exists (
    select 1
    from public.job_assignments ja
    join public.jobs existing_job
      on existing_job.id = ja.job_id
    where ja.employee_id = any(p_employee_ids)

      and existing_job.service_date =
        (p_job ->> 'service_date')::date

      and existing_job.end_time is not null

      and existing_job.status not in (
        'completed',
        'cancelled'
      )

      and existing_job.start_time <
        (p_job ->> 'end_time')::time

      and existing_job.end_time >
        (p_job ->> 'start_time')::time
  ) then
    raise exception
      'One or more selected employees have a conflicting job';
  end if;

  /*
  |--------------------------------------------------------------------------
  | CREATE JOB
  |--------------------------------------------------------------------------
  */

  insert into public.jobs (
    request_id,

    job_type,
    source,
    status,

    first_name,
    last_name,
    phone,
    email,
    preferred_contact,

    request_type,
    package_id,
    selected_services,
    extras,

    property_type,
    floors,
    bedrooms,
    bathrooms,
    kitchens,
    balconies,
    laundries,
    pets,

    street_address,
    unit,
    suburb,
    postcode,

    access_instructions,
    parking,
    contact_on_arrival,

    service_date,
    start_time,
    end_time,
    estimated_labour_hours,

    agreed_price,
    final_price,

    notes
  )
  values (
    null,

    coalesce(
      nullif(p_job ->> 'job_type', ''),
      'cleaning'
    ),

    coalesce(
      nullif(p_job ->> 'source', ''),
      'other'
    ),

    case
      when cardinality(p_employee_ids) > 0
        then 'assigned'
      else 'unassigned'
    end,

    trim(p_job ->> 'first_name'),
    nullif(trim(p_job ->> 'last_name'), ''),
    trim(p_job ->> 'phone'),
    nullif(trim(p_job ->> 'email'), ''),
    nullif(p_job ->> 'preferred_contact', ''),

    p_job ->> 'request_type',
    nullif(p_job ->> 'package_id', ''),

    coalesce(
      array(
        select jsonb_array_elements_text(
          coalesce(
            p_job -> 'selected_services',
            '[]'::jsonb
          )
        )
      ),
      '{}'
    ),

    coalesce(
      array(
        select jsonb_array_elements_text(
          coalesce(
            p_job -> 'extras',
            '[]'::jsonb
          )
        )
      ),
      '{}'
    ),

    nullif(p_job ->> 'property_type', ''),
    nullif(p_job ->> 'floors', ''),
    nullif(p_job ->> 'bedrooms', ''),
    nullif(p_job ->> 'bathrooms', ''),
    nullif(p_job ->> 'kitchens', ''),
    nullif(p_job ->> 'balconies', ''),
    nullif(p_job ->> 'laundries', ''),
    nullif(p_job ->> 'pets', ''),

    trim(p_job ->> 'street_address'),
    nullif(trim(p_job ->> 'unit'), ''),
    trim(p_job ->> 'suburb'),
    nullif(trim(p_job ->> 'postcode'), ''),

    nullif(trim(p_job ->> 'access_instructions'), ''),
    nullif(trim(p_job ->> 'parking'), ''),

    coalesce(
      (p_job ->> 'contact_on_arrival')::boolean,
      false
    ),

    (p_job ->> 'service_date')::date,
    (p_job ->> 'start_time')::time,
    (p_job ->> 'end_time')::time,

    (p_job ->> 'estimated_labour_hours')::numeric,

    nullif(
      p_job ->> 'agreed_price',
      ''
    )::numeric,

    nullif(
      p_job ->> 'final_price',
      ''
    )::numeric,

    nullif(trim(p_job ->> 'notes'), '')
  )
  returning *
  into v_job;

  /*
  |--------------------------------------------------------------------------
  | CREATE ASSIGNMENTS
  |--------------------------------------------------------------------------
  */

  insert into public.job_assignments (
    job_id,
    employee_id
  )
  select
    v_job.id,
    employee_id
  from unnest(p_employee_ids) employee_id;

  return v_job;
end;
$function$;

REVOKE ALL ON FUNCTION "public"."create_job_with_assignments"(jsonb, uuid[]) FROM "anon", "authenticated", "service_role";

CREATE OR REPLACE FUNCTION public.generate_employee_code()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SET search_path TO ''
  AS $function$
begin
  if new.employee_code is null then
    new.employee_code :=
      'EMP-' ||
      lpad(
        nextval('public.employee_code_seq')::text,
        3,
        '0'
      );
  end if;

  return new;
end;
$function$;

REVOKE ALL ON FUNCTION "public"."generate_employee_code"() FROM "anon", "authenticated", "service_role";

CREATE OR REPLACE FUNCTION public.generate_employee_slug (
  employee_name text
)
  RETURNS text
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
declare
  base_slug text;
  candidate_slug text;
  suffix integer := 1;
begin
  base_slug := public.slugify_employee_name(employee_name);
  candidate_slug := base_slug;

  while exists (
    select 1
    from public.employee_slugs
    where slug = candidate_slug
  ) loop
    suffix := suffix + 1;
    candidate_slug := base_slug || '-' || suffix;
  end loop;

  return candidate_slug;
end;
$function$;

REVOKE ALL ON FUNCTION "public"."generate_employee_slug"(text) FROM "anon", "authenticated", "service_role";

CREATE OR REPLACE FUNCTION public.generate_job_code()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
begin
  if new.job_code is null then
    new.job_code :=
      'JOB-' ||
      lpad(
        nextval('public.job_code_seq')::text,
        3,
        '0'
      );
  end if;

  return new;
end;
$function$;

REVOKE ALL ON FUNCTION "public"."generate_job_code"() FROM "anon", "authenticated", "service_role";

CREATE OR REPLACE FUNCTION public.generate_request_code()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
begin
  if new.request_code is null then
    new.request_code :=
      'REQ-' ||
      lpad(
        nextval('public.request_code_seq')::text,
        3,
        '0'
      );
  end if;

  return new;
end;
$function$;

REVOKE ALL ON FUNCTION "public"."generate_request_code"() FROM "anon", "authenticated", "service_role";

CREATE OR REPLACE FUNCTION public.get_instagram_access_token()
  RETURNS text
  LANGUAGE sql
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
  SELECT ds.decrypted_secret
  FROM private.instagram_tokens AS it
  JOIN vault.decrypted_secrets AS ds
    ON ds.id = it.vault_secret_id
  WHERE it.id = 1
  LIMIT 1;
$function$;

REVOKE ALL ON FUNCTION "public"."get_instagram_access_token"() FROM PUBLIC, "anon", "authenticated";

CREATE OR REPLACE FUNCTION public.handle_employee_slug()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
declare
  new_slug text;
begin

  if tg_op = 'INSERT'
     or new.name is distinct from old.name then

    new_slug := public.generate_employee_slug(new.name);

    insert into public.employee_slugs (
      slug,
      employee_id
    )
    values (
      new_slug,
      new.id
    );

    new.slug := new_slug;

  end if;

  return new;
end;
$function$;

REVOKE ALL ON FUNCTION "public"."handle_employee_slug"() FROM "anon", "authenticated", "service_role";

CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
begin
  insert into public.profiles (
    id,
    full_name,
    role
  )
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      split_part(new.email, '@', 1)
    ),
    'employee'
  );

  return new;
end;
$function$;

REVOKE ALL ON FUNCTION "public"."handle_new_user"() FROM "anon", "authenticated", "service_role";

CREATE OR REPLACE FUNCTION public.is_admin()
  RETURNS boolean
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$function$;

REVOKE ALL ON FUNCTION "public"."is_admin"() FROM "anon", "authenticated", "service_role";

CREATE OR REPLACE FUNCTION public.rls_auto_enable()
  RETURNS event_trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'pg_catalog'
  AS $function$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$function$;

REVOKE ALL ON FUNCTION "public"."rls_auto_enable"() FROM "anon", "authenticated", "service_role";

CREATE OR REPLACE FUNCTION public.set_candidate_application_updated_at()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SET search_path TO ''
  AS $function$
begin

  new.updated_at = now();

  return new;

end;
$function$;

REVOKE ALL ON FUNCTION "public"."set_candidate_application_updated_at"() FROM "anon", "authenticated", "service_role";

CREATE OR REPLACE FUNCTION public.slugify_employee_name (
  employee_name text
)
  RETURNS text
  LANGUAGE sql
  IMMUTABLE
  SET search_path TO ''
  AS $function$
  select trim(
    both '-'
    from regexp_replace(
      lower(
        translate(
          employee_name,
          'áéíóúÁÉÍÓÚñÑ',
          'aeiouAEIOUnN'
        )
      ),
      '[^a-z0-9]+',
      '-',
      'g'
    )
  );
$function$;

REVOKE ALL ON FUNCTION "public"."slugify_employee_name"(text) FROM "anon", "authenticated", "service_role";

CREATE OR REPLACE FUNCTION public.submit_candidate_application (
  p_token            text,
  p_name             text,
  p_location         text    DEFAULT NULL::text,
  p_years_experience integer DEFAULT 0,
  p_phone            text    DEFAULT NULL::text,
  p_email            text    DEFAULT NULL::text,
  p_tagline          text    DEFAULT NULL::text,
  p_bio              text    DEFAULT NULL::text,
  p_languages        text[]  DEFAULT '{}'::text[],
  p_specialties      text[]  DEFAULT '{}'::text[],
  p_traits           text[]  DEFAULT '{}'::text[],
  p_interests        text[]  DEFAULT '{}'::text[],
  p_photo_url        text    DEFAULT NULL::text,
  p_role             text    DEFAULT NULL::text
)
  RETURNS uuid
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
declare
  v_hash text;
  v_invite public.candidate_invites%rowtype;
  v_application_id uuid;
  v_phone text;
begin

  -- ----------------------------------------------------------
  -- Validate token
  -- ----------------------------------------------------------

  if p_token is null
     or length(trim(p_token)) = 0 then
    raise exception 'Invalid invitation';
  end if;


  -- ----------------------------------------------------------
  -- Validate name
  -- ----------------------------------------------------------

  if p_name is null
     or length(trim(p_name)) = 0 then
    raise exception 'Name is required';
  end if;


  -- ----------------------------------------------------------
  -- Validate role
  -- ----------------------------------------------------------

  if p_role is null
     or length(trim(p_role)) = 0 then
    raise exception 'Role is required';
  end if;


  -- ----------------------------------------------------------
  -- Validate experience
  -- ----------------------------------------------------------

  if p_years_experience < 0 then
    raise exception 'Years of experience cannot be negative';
  end if;


  -- ----------------------------------------------------------
  -- Hash invitation token
  -- ----------------------------------------------------------

  v_hash :=
    encode(
      extensions.digest(
        trim(p_token),
        'sha256'
      ),
      'hex'
    );


  -- ----------------------------------------------------------
  -- Lock invitation
  -- ----------------------------------------------------------

  select *
  into v_invite
  from public.candidate_invites
  where token_hash = v_hash
  for update;


  -- ----------------------------------------------------------
  -- Validate invitation
  -- ----------------------------------------------------------

  if not found then
    raise exception 'Invalid invitation';
  end if;

  if v_invite.status <> 'active'
     or v_invite.used_at is not null
     or v_invite.expires_at <= now() then
    raise exception 'Invitation is no longer valid';
  end if;


  -- ----------------------------------------------------------
  -- Resolve phone
  -- ----------------------------------------------------------

  v_phone :=
    coalesce(
      nullif(trim(v_invite.phone), ''),
      nullif(trim(p_phone), '')
    );


  -- ----------------------------------------------------------
  -- Create candidate application
  -- ----------------------------------------------------------

  insert into public.candidate_applications (
    invite_id,
    name,
    role,
    location,
    years_experience,
    phone,
    email,
    tagline,
    bio,
    languages,
    specialties,
    traits,
    interests,
    photo_url
  )
  values (
    v_invite.id,
    trim(p_name),
    trim(p_role),
    nullif(trim(p_location), ''),
    p_years_experience,
    v_phone,
    nullif(trim(p_email), ''),
    nullif(trim(p_tagline), ''),
    nullif(trim(p_bio), ''),
    coalesce(p_languages, '{}'),
    coalesce(p_specialties, '{}'),
    coalesce(p_traits, '{}'),
    coalesce(p_interests, '{}'),
    nullif(trim(p_photo_url), '')
  )
  returning id
  into v_application_id;


  -- ----------------------------------------------------------
  -- Consume invitation
  -- ----------------------------------------------------------

  update public.candidate_invites
  set
    status = 'used',
    used_at = now()
  where id = v_invite.id;


  -- ----------------------------------------------------------
  -- Return application ID
  -- ----------------------------------------------------------

  return v_application_id;

end;
$function$;

REVOKE ALL
  ON FUNCTION "public"."submit_candidate_application"(text, text, text, integer, text, text, text, text, text[], text[], text[], text[], text, text)
  FROM PUBLIC, "service_role";

CREATE OR REPLACE FUNCTION public.update_instagram_access_token (
  new_token        text,
  token_expires_in integer
)
  RETURNS void
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
DECLARE
  secret_uuid UUID;
BEGIN
  IF new_token IS NULL OR length(new_token) = 0 THEN
    RAISE EXCEPTION 'Instagram token cannot be empty';
  END IF;

  IF token_expires_in IS NULL OR token_expires_in <= 0 THEN
    RAISE EXCEPTION 'Invalid token expiration';
  END IF;

  SELECT vault_secret_id
  INTO STRICT secret_uuid
  FROM private.instagram_tokens
  WHERE id = 1
  FOR UPDATE;

  PERFORM vault.update_secret(
    secret_uuid,
    new_token
  );

  UPDATE private.instagram_tokens
  SET
    expires_at = NOW() + make_interval(secs => token_expires_in),
    last_refreshed_at = NOW(),
    updated_at = NOW()
  WHERE id = 1;
END;
$function$;

REVOKE ALL ON FUNCTION "public"."update_instagram_access_token"(text, integer) FROM PUBLIC, "anon", "authenticated";

CREATE OR REPLACE FUNCTION public.validate_candidate_invite (
  p_token text
)
  RETURNS TABLE (
    valid      boolean,
    invite_id  uuid,
    phone      text,
    expires_at timestamp with time zone
  )
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
declare

  v_hash text;

begin

  -- ----------------------------------------------------------
  -- Missing token
  -- ----------------------------------------------------------

  if p_token is null
     or length(trim(p_token)) = 0 then

    return query

    select
      false,
      null::uuid,
      null::text,
      null::timestamptz;

    return;

  end if;


  -- ----------------------------------------------------------
  -- Hash received token
  -- ----------------------------------------------------------

  v_hash :=
    encode(
      extensions.digest(
        trim(p_token),
        'sha256'
      ),
      'hex'
    );


  -- ----------------------------------------------------------
  -- Return invitation only if valid
  -- ----------------------------------------------------------

  return query

  select
    true,
    ci.id,
    ci.phone,
    ci.expires_at

  from public.candidate_invites ci

  where ci.token_hash = v_hash

    and ci.status = 'active'

    and ci.used_at is null

    and ci.expires_at > now();


  -- ----------------------------------------------------------
  -- Nothing matched
  -- ----------------------------------------------------------

  if not found then

    return query

    select
      false,
      null::uuid,
      null::text,
      null::timestamptz;

  end if;

end;
$function$;

REVOKE ALL ON FUNCTION "public"."validate_candidate_invite"(text) FROM PUBLIC, "service_role";

CREATE OR REPLACE FUNCTION public.verify_candidate_application_token (
  p_token          text,
  p_application_id uuid
)
  RETURNS boolean
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
declare
  v_hash text;
  v_exists boolean;
begin

  -- ----------------------------------------------------------
  -- Basic validation
  -- ----------------------------------------------------------

  if p_token is null
     or length(trim(p_token)) = 0
     or p_application_id is null then

    return false;

  end if;


  -- ----------------------------------------------------------
  -- Hash raw invitation token
  -- ----------------------------------------------------------

  v_hash :=
    encode(
      extensions.digest(
        trim(p_token),
        'sha256'
      ),
      'hex'
    );


  -- ----------------------------------------------------------
  -- Verify relationship:
  --
  -- raw token
  --   → invite hash
  --   → USED invitation
  --   → application
  --
  -- IMPORTANT:
  -- This does NOT require the invitation to still be active.
  -- It specifically expects it to have been consumed.
  -- ----------------------------------------------------------

  select exists (
    select 1

    from public.candidate_invites ci

    inner join public.candidate_applications ca
      on ca.invite_id = ci.id

    where ci.token_hash = v_hash

      and ci.status = 'used'

      and ci.used_at is not null

      and ca.id = p_application_id

      and ca.status = 'submitted'
  )
  into v_exists;


  return coalesce(v_exists, false);

end;
$function$;

REVOKE ALL ON FUNCTION "public"."verify_candidate_application_token"(text, uuid) FROM PUBLIC, "anon", "authenticated";

ALTER TABLE "public"."candidate_applications"
  ADD CONSTRAINT "candidate_applications_reviewed_by_fkey" FOREIGN KEY (reviewed_by) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE "public"."candidate_invites"
  ADD CONSTRAINT "candidate_invites_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE "public"."candidate_applications"
  ADD CONSTRAINT "candidate_applications_invite_id_fkey" FOREIGN KEY (invite_id) REFERENCES public.candidate_invites(id) ON DELETE RESTRICT;

ALTER TABLE "public"."candidate_applications"
  ADD CONSTRAINT "candidate_applications_employee_id_fkey" FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE SET NULL;

ALTER TABLE "public"."job_assignments"
  ADD CONSTRAINT "job_assignments_employee_id_fkey" FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE RESTRICT;

ALTER TABLE "public"."job_assignments"
  ADD CONSTRAINT "job_assignments_job_id_fkey" FOREIGN KEY (job_id) REFERENCES public.jobs(id) ON DELETE CASCADE;

ALTER TABLE "public"."package_services"
  ADD CONSTRAINT "package_services_service_id_fkey" FOREIGN KEY (service_id) REFERENCES public.cleaning_services(id) ON DELETE CASCADE;

ALTER TABLE "public"."profiles"
  ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE "public"."request_assignments"
  ADD CONSTRAINT "request_assignments_employee_id_fkey" FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;

ALTER TABLE "public"."jobs"
  ADD CONSTRAINT "jobs_request_id_fkey" FOREIGN KEY (request_id) REFERENCES public.requests(id) ON DELETE SET NULL;

ALTER TABLE "public"."request_assignments"
  ADD CONSTRAINT "request_assignments_request_id_fkey" FOREIGN KEY (request_id) REFERENCES public.requests(id) ON DELETE CASCADE;

ALTER TABLE "public"."jobs"
  ADD CONSTRAINT "jobs_package_id_fkey" FOREIGN KEY (package_id) REFERENCES public.service_packages(id) ON DELETE RESTRICT;

ALTER TABLE "public"."package_pricing"
  ADD CONSTRAINT "package_pricing_package_id_fkey" FOREIGN KEY (package_id) REFERENCES public.service_packages(id) ON DELETE CASCADE;

ALTER TABLE "public"."package_services"
  ADD CONSTRAINT "package_services_package_id_fkey" FOREIGN KEY (package_id) REFERENCES public.service_packages(id) ON DELETE CASCADE;

ALTER TABLE "public"."requests"
  ADD CONSTRAINT "requests_package_id_fkey" FOREIGN KEY (package_id) REFERENCES public.service_packages(id) ON DELETE RESTRICT;

ALTER TABLE "public"."service_pricing_options"
  ADD CONSTRAINT "service_pricing_options_service_id_fkey" FOREIGN KEY (service_id) REFERENCES public.cleaning_services(id) ON DELETE CASCADE;

CREATE VIEW "public"."public_employees" WITH (security_invoker=true) AS  SELECT id,
    name,
    slug,
    role,
    years_experience,
    tagline,
    bio,
    languages,
    specialties,
    traits,
    interests,
    photo_url
   FROM public.employees
  WHERE ((status = 'active'::text) AND (public_profile = true));

CREATE INDEX idx_candidate_applications_employee_id ON public.candidate_applications USING btree (employee_id);

CREATE INDEX idx_candidate_applications_status ON public.candidate_applications USING btree (status);

CREATE INDEX idx_candidate_applications_submitted_at ON public.candidate_applications USING btree (submitted_at DESC);

CREATE INDEX idx_candidate_invites_expires_at ON public.candidate_invites USING btree (expires_at);

CREATE INDEX idx_candidate_invites_status ON public.candidate_invites USING btree (status);

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER candidate_applications_set_updated_at
  BEFORE UPDATE ON public.candidate_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.set_candidate_application_updated_at();

CREATE TRIGGER employee_slug_trigger
  BEFORE INSERT OR UPDATE OF name ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_employee_slug();

CREATE TRIGGER set_employee_code
  BEFORE INSERT ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_employee_code();

CREATE TRIGGER set_job_code
  BEFORE INSERT ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_job_code();

CREATE TRIGGER set_request_code
  BEFORE INSERT ON public.requests
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_request_code();

CREATE POLICY "Admins can manage candidate applications" ON "public"."candidate_applications"
  FOR ALL
  TO "authenticated"
  USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))))
  WITH CHECK ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));

CREATE POLICY "Admins can manage candidate invites" ON "public"."candidate_invites"
  FOR ALL
  TO "authenticated"
  USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))))
  WITH CHECK ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));

CREATE POLICY "Admins can manage cleaning services" ON "public"."cleaning_services"
  FOR ALL
  TO "authenticated"
  USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))))
  WITH CHECK ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));

CREATE POLICY "Public can read cleaning services" ON "public"."cleaning_services"
  FOR SELECT
  TO "anon", "authenticated"
  USING ((active = true));

CREATE POLICY "Admins can delete employees" ON "public"."employees"
  FOR DELETE
  TO "authenticated"
  USING (public.is_admin());

CREATE POLICY "Admins can insert employees" ON "public"."employees"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can read all employees" ON "public"."employees"
  FOR SELECT
  TO "authenticated"
  USING (public.is_admin());

CREATE POLICY "Admins can update employees" ON "public"."employees"
  FOR UPDATE
  TO "authenticated"
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Public can read public active employees" ON "public"."employees"
  FOR SELECT
  TO "anon"
  USING (((status = 'active'::text) AND (public_profile = true)));

CREATE POLICY "Admins can create job assignments" ON "public"."job_assignments"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete job assignments" ON "public"."job_assignments"
  FOR DELETE
  TO "authenticated"
  USING (public.is_admin());

CREATE POLICY "Admins can read job assignments" ON "public"."job_assignments"
  FOR SELECT
  TO "authenticated"
  USING (public.is_admin());

CREATE POLICY "Admins can update job assignments" ON "public"."job_assignments"
  FOR UPDATE
  TO "authenticated"
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can create jobs" ON "public"."jobs"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete jobs" ON "public"."jobs"
  FOR DELETE
  TO "authenticated"
  USING (public.is_admin());

CREATE POLICY "Admins can read jobs" ON "public"."jobs"
  FOR SELECT
  TO "authenticated"
  USING (public.is_admin());

CREATE POLICY "Admins can update jobs" ON "public"."jobs"
  FOR UPDATE
  TO "authenticated"
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage package pricing" ON "public"."package_pricing"
  FOR ALL
  TO "authenticated"
  USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))))
  WITH CHECK ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));

CREATE POLICY "Public can read package pricing" ON "public"."package_pricing"
  FOR SELECT
  TO "anon", "authenticated"
  USING ((active = true));

CREATE POLICY "Admins can manage package services" ON "public"."package_services"
  FOR ALL
  TO "authenticated"
  USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))))
  WITH CHECK ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));

CREATE POLICY "Public can read package services" ON "public"."package_services"
  FOR SELECT
  TO "anon", "authenticated"
  USING (true);

CREATE POLICY "Admins can read all profiles" ON "public"."profiles"
  FOR SELECT
  TO "authenticated"
  USING (public.is_admin());

CREATE POLICY "Users can read own profile" ON "public"."profiles"
  FOR SELECT
  TO "authenticated"
  USING ((( SELECT auth.uid() AS uid) = id));

CREATE POLICY "Admins can create request assignments" ON "public"."request_assignments"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete request assignments" ON "public"."request_assignments"
  FOR DELETE
  TO "authenticated"
  USING (public.is_admin());

CREATE POLICY "Admins can read request assignments" ON "public"."request_assignments"
  FOR SELECT
  TO "authenticated"
  USING (public.is_admin());

CREATE POLICY "Admins can create requests" ON "public"."requests"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete requests" ON "public"."requests"
  FOR DELETE
  TO "authenticated"
  USING (public.is_admin());

CREATE POLICY "Admins can read requests" ON "public"."requests"
  FOR SELECT
  TO "authenticated"
  USING (public.is_admin());

CREATE POLICY "Admins can update requests" ON "public"."requests"
  FOR UPDATE
  TO "authenticated"
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Public can create website requests" ON "public"."requests"
  FOR INSERT
  TO "anon"
  WITH CHECK (((status = 'new'::text) AND (source = 'website'::text)));

CREATE POLICY "Admins can manage service packages" ON "public"."service_packages"
  FOR ALL
  TO "authenticated"
  USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))))
  WITH CHECK ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));

CREATE POLICY "Public can read service packages" ON "public"."service_packages"
  FOR SELECT
  TO "anon", "authenticated"
  USING ((active = true));

CREATE POLICY "Admins can manage service pricing options" ON "public"."service_pricing_options"
  FOR ALL
  TO "authenticated"
  USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))))
  WITH CHECK ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));

CREATE POLICY "Public can read service pricing options" ON "public"."service_pricing_options"
  FOR SELECT
  TO "anon", "authenticated"
  USING ((active = true));

CREATE POLICY "Admins can delete candidate photos" ON "storage"."objects"
  FOR DELETE
  TO "authenticated"
  USING (((bucket_id = 'candidate-photos'::text) AND (EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text))))));

CREATE POLICY "Admins can delete employee photos" ON "storage"."objects"
  FOR DELETE
  TO "authenticated"
  USING (((bucket_id = 'employee-photo'::text) AND public.is_admin()));

CREATE POLICY "Admins can read candidate photos" ON "storage"."objects"
  FOR SELECT
  TO "authenticated"
  USING (((bucket_id = 'candidate-photos'::text) AND (EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text))))));

CREATE POLICY "Admins can read employee photo objects" ON "storage"."objects"
  FOR SELECT
  TO "authenticated"
  USING (((bucket_id = 'employee-photo'::text) AND public.is_admin()));

CREATE POLICY "Admins can update candidate photos" ON "storage"."objects"
  FOR UPDATE
  TO "authenticated"
  USING (((bucket_id = 'candidate-photos'::text) AND (EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text))))))
  WITH CHECK (((bucket_id = 'candidate-photos'::text) AND (EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text))))));

CREATE POLICY "Admins can update employee photos" ON "storage"."objects"
  FOR UPDATE
  TO "authenticated"
  USING (((bucket_id = 'employee-photo'::text) AND public.is_admin()))
  WITH CHECK (((bucket_id = 'employee-photo'::text) AND public.is_admin()));

CREATE POLICY "Admins can upload candidate photos" ON "storage"."objects"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (((bucket_id = 'candidate-photos'::text) AND (EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text))))));

CREATE POLICY "Admins can upload employee photos" ON "storage"."objects"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (((bucket_id = 'employee-photo'::text) AND public.is_admin()));

CREATE EVENT TRIGGER "ensure_rls"
  ON ddl_command_end
  WHEN TAG IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
  EXECUTE FUNCTION "public"."rls_auto_enable"();

COMMENT ON EXTENSION "pg_cron" IS 'Job scheduler for PostgreSQL';

COMMENT ON EXTENSION "pg_net" IS 'Async HTTP';

GRANT EXECUTE ON FUNCTION "public"."approve_candidate_application"(uuid, uuid, text) TO "authenticated";

REVOKE ALL ON FUNCTION "public"."approve_candidate_application"(uuid, uuid, text) FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."approve_candidate_application"(uuid, uuid, text) TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."convert_request_to_job"(uuid, text, text, text, text, text, text, boolean, text) TO PUBLIC;

REVOKE ALL ON FUNCTION "public"."convert_request_to_job"(uuid, text, text, text, text, text, text, boolean, text) FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."convert_request_to_job"(uuid, text, text, text, text, text, text, boolean, text) TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."create_candidate_invite"(text, integer) TO "authenticated";

REVOKE ALL ON FUNCTION "public"."create_candidate_invite"(text, integer) FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."create_candidate_invite"(text, integer) TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."create_job_with_assignments"(jsonb, uuid[]) TO PUBLIC;

REVOKE ALL ON FUNCTION "public"."create_job_with_assignments"(jsonb, uuid[]) FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."create_job_with_assignments"(jsonb, uuid[]) TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."generate_employee_code"() TO PUBLIC;

REVOKE ALL ON FUNCTION "public"."generate_employee_code"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."generate_employee_code"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."generate_employee_slug"(text) TO PUBLIC;

REVOKE ALL ON FUNCTION "public"."generate_employee_slug"(text) FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."generate_employee_slug"(text) TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."generate_job_code"() TO PUBLIC;

REVOKE ALL ON FUNCTION "public"."generate_job_code"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."generate_job_code"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."generate_request_code"() TO PUBLIC;

REVOKE ALL ON FUNCTION "public"."generate_request_code"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."generate_request_code"() TO "postgres";

REVOKE ALL ON FUNCTION "public"."get_instagram_access_token"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."get_instagram_access_token"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."get_instagram_access_token"() TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."handle_employee_slug"() TO PUBLIC;

REVOKE ALL ON FUNCTION "public"."handle_employee_slug"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."handle_employee_slug"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."handle_new_user"() TO PUBLIC;

REVOKE ALL ON FUNCTION "public"."handle_new_user"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."handle_new_user"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."is_admin"() TO PUBLIC;

REVOKE ALL ON FUNCTION "public"."is_admin"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."is_admin"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."rls_auto_enable"() TO PUBLIC;

REVOKE ALL ON FUNCTION "public"."rls_auto_enable"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."rls_auto_enable"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."set_candidate_application_updated_at"() TO PUBLIC;

REVOKE ALL ON FUNCTION "public"."set_candidate_application_updated_at"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."set_candidate_application_updated_at"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."slugify_employee_name"(text) TO PUBLIC;

REVOKE ALL ON FUNCTION "public"."slugify_employee_name"(text) FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."slugify_employee_name"(text) TO "postgres";

GRANT EXECUTE
  ON FUNCTION "public"."submit_candidate_application"(text, text, text, integer, text, text, text, text, text[], text[], text[], text[], text, text)
  TO "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."submit_candidate_application"(text, text, text, integer, text, text, text, text, text[], text[], text[], text[], text, text) FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."submit_candidate_application"(text, text, text, integer, text, text, text, text, text[], text[], text[], text[], text, text) TO "postgres";

REVOKE ALL ON FUNCTION "public"."update_instagram_access_token"(text, integer) FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."update_instagram_access_token"(text, integer) TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."update_instagram_access_token"(text, integer) TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."validate_candidate_invite"(text) TO "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."validate_candidate_invite"(text) FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."validate_candidate_invite"(text) TO "postgres";

REVOKE ALL ON FUNCTION "public"."verify_candidate_application_token"(text, uuid) FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."verify_candidate_application_token"(text, uuid) TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."verify_candidate_application_token"(text, uuid) TO "service_role";

GRANT USAGE ON SCHEMA "private" TO "service_role";

REVOKE ALL ON SEQUENCE "public"."employee_code_seq" FROM "authenticated";

GRANT SELECT, USAGE ON SEQUENCE "public"."employee_code_seq" TO "authenticated";

GRANT INSERT, SELECT, UPDATE ON TABLE "private"."instagram_tokens" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."candidate_applications" TO "authenticated";

REVOKE ALL ON TABLE "public"."candidate_applications" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."candidate_applications" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."candidate_applications" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."candidate_invites" TO "authenticated";

REVOKE ALL ON TABLE "public"."candidate_invites" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."candidate_invites" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."candidate_invites" TO "service_role";

REVOKE ALL ON TABLE "public"."cleaning_services" FROM "anon";

GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON TABLE "public"."cleaning_services" TO "anon";

REVOKE ALL ON TABLE "public"."cleaning_services" FROM "authenticated";

GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON TABLE "public"."cleaning_services" TO "authenticated";

REVOKE ALL ON TABLE "public"."cleaning_services" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."cleaning_services" TO "postgres";

REVOKE ALL ON TABLE "public"."cleaning_services" FROM "service_role";

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON TABLE "public"."cleaning_services" TO "service_role";

REVOKE ALL ON TABLE "public"."employee_slugs" FROM "anon";

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON TABLE "public"."employee_slugs" TO "anon";

REVOKE ALL ON TABLE "public"."employee_slugs" FROM "authenticated";

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON TABLE "public"."employee_slugs" TO "authenticated";

REVOKE ALL ON TABLE "public"."employee_slugs" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."employee_slugs" TO "postgres";

REVOKE ALL ON TABLE "public"."employee_slugs" FROM "service_role";

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON TABLE "public"."employee_slugs" TO "service_role";

REVOKE ALL ON TABLE "public"."employees" FROM "anon";

REVOKE ALL ("bio") ON TABLE "public"."employees" FROM "anon";

GRANT SELECT ("bio") ON TABLE "public"."employees" TO "anon";

REVOKE ALL ("id") ON TABLE "public"."employees" FROM "anon";

GRANT SELECT ("id") ON TABLE "public"."employees" TO "anon";

REVOKE ALL ("interests") ON TABLE "public"."employees" FROM "anon";

GRANT SELECT ("interests") ON TABLE "public"."employees" TO "anon";

REVOKE ALL ("languages") ON TABLE "public"."employees" FROM "anon";

GRANT SELECT ("languages") ON TABLE "public"."employees" TO "anon";

REVOKE ALL ("name") ON TABLE "public"."employees" FROM "anon";

GRANT SELECT ("name") ON TABLE "public"."employees" TO "anon";

REVOKE ALL ("photo_url") ON TABLE "public"."employees" FROM "anon";

GRANT SELECT ("photo_url") ON TABLE "public"."employees" TO "anon";

REVOKE ALL ("public_profile") ON TABLE "public"."employees" FROM "anon";

GRANT SELECT ("public_profile") ON TABLE "public"."employees" TO "anon";

REVOKE ALL ("role") ON TABLE "public"."employees" FROM "anon";

GRANT SELECT ("role") ON TABLE "public"."employees" TO "anon";

REVOKE ALL ("slug") ON TABLE "public"."employees" FROM "anon";

GRANT SELECT ("slug") ON TABLE "public"."employees" TO "anon";

REVOKE ALL ("specialties") ON TABLE "public"."employees" FROM "anon";

GRANT SELECT ("specialties") ON TABLE "public"."employees" TO "anon";

REVOKE ALL ("status") ON TABLE "public"."employees" FROM "anon";

GRANT SELECT ("status") ON TABLE "public"."employees" TO "anon";

REVOKE ALL ("tagline") ON TABLE "public"."employees" FROM "anon";

GRANT SELECT ("tagline") ON TABLE "public"."employees" TO "anon";

REVOKE ALL ("traits") ON TABLE "public"."employees" FROM "anon";

GRANT SELECT ("traits") ON TABLE "public"."employees" TO "anon";

REVOKE ALL ("years_experience") ON TABLE "public"."employees" FROM "anon";

GRANT SELECT ("years_experience") ON TABLE "public"."employees" TO "anon";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."employees" TO "authenticated";

REVOKE ALL ON TABLE "public"."employees" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."employees" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."employees" TO "service_role";

REVOKE ALL ON TABLE "public"."job_assignments" FROM "anon";

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON TABLE "public"."job_assignments" TO "anon";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."job_assignments" TO "authenticated";

REVOKE ALL ON TABLE "public"."job_assignments" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."job_assignments" TO "postgres";

REVOKE ALL ON TABLE "public"."job_assignments" FROM "service_role";

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON TABLE "public"."job_assignments" TO "service_role";

REVOKE ALL ON TABLE "public"."jobs" FROM "anon";

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON TABLE "public"."jobs" TO "anon";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."jobs" TO "authenticated";

REVOKE ALL ON TABLE "public"."jobs" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."jobs" TO "postgres";

REVOKE ALL ON TABLE "public"."jobs" FROM "service_role";

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON TABLE "public"."jobs" TO "service_role";

REVOKE ALL ON TABLE "public"."package_pricing" FROM "anon";

GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON TABLE "public"."package_pricing" TO "anon";

REVOKE ALL ON TABLE "public"."package_pricing" FROM "authenticated";

GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON TABLE "public"."package_pricing" TO "authenticated";

REVOKE ALL ON TABLE "public"."package_pricing" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."package_pricing" TO "postgres";

REVOKE ALL ON TABLE "public"."package_pricing" FROM "service_role";

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON TABLE "public"."package_pricing" TO "service_role";

REVOKE ALL ON TABLE "public"."package_services" FROM "anon";

GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON TABLE "public"."package_services" TO "anon";

REVOKE ALL ON TABLE "public"."package_services" FROM "authenticated";

GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON TABLE "public"."package_services" TO "authenticated";

REVOKE ALL ON TABLE "public"."package_services" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."package_services" TO "postgres";

REVOKE ALL ON TABLE "public"."package_services" FROM "service_role";

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON TABLE "public"."package_services" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."profiles" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."profiles" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."profiles" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."profiles" TO "service_role";

REVOKE ALL ON TABLE "public"."request_assignments" FROM "anon";

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON TABLE "public"."request_assignments" TO "anon";

REVOKE ALL ON TABLE "public"."request_assignments" FROM "authenticated";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON TABLE "public"."request_assignments" TO "authenticated";

REVOKE ALL ON TABLE "public"."request_assignments" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."request_assignments" TO "postgres";

REVOKE ALL ON TABLE "public"."request_assignments" FROM "service_role";

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON TABLE "public"."request_assignments" TO "service_role";

REVOKE ALL ON TABLE "public"."requests" FROM "anon";

GRANT INSERT, MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON TABLE "public"."requests" TO "anon";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."requests" TO "authenticated";

REVOKE ALL ON TABLE "public"."requests" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."requests" TO "postgres";

REVOKE ALL ON TABLE "public"."requests" FROM "service_role";

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON TABLE "public"."requests" TO "service_role";

REVOKE ALL ON TABLE "public"."service_packages" FROM "anon";

GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON TABLE "public"."service_packages" TO "anon";

REVOKE ALL ON TABLE "public"."service_packages" FROM "authenticated";

GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON TABLE "public"."service_packages" TO "authenticated";

REVOKE ALL ON TABLE "public"."service_packages" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."service_packages" TO "postgres";

REVOKE ALL ON TABLE "public"."service_packages" FROM "service_role";

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON TABLE "public"."service_packages" TO "service_role";

REVOKE ALL ON TABLE "public"."service_pricing_options" FROM "anon";

GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON TABLE "public"."service_pricing_options" TO "anon";

REVOKE ALL ON TABLE "public"."service_pricing_options" FROM "authenticated";

GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON TABLE "public"."service_pricing_options" TO "authenticated";

REVOKE ALL ON TABLE "public"."service_pricing_options" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."service_pricing_options" TO "postgres";

REVOKE ALL ON TABLE "public"."service_pricing_options" FROM "service_role";

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON TABLE "public"."service_pricing_options" TO "service_role";

REVOKE ALL ON TABLE "public"."public_employees" FROM "anon";

GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON TABLE "public"."public_employees" TO "anon";

REVOKE ALL ON TABLE "public"."public_employees" FROM "authenticated";

GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON TABLE "public"."public_employees" TO "authenticated";

REVOKE ALL ON TABLE "public"."public_employees" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."public_employees" TO "postgres";

REVOKE ALL ON TABLE "public"."public_employees" FROM "service_role";

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON TABLE "public"."public_employees" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON TABLES TO "anon";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON TABLES TO "authenticated";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON TABLES TO "service_role";

SELECT cron.schedule_in_database('instagram-token-monthly-refresh', '0 3 1 * *', '
  SELECT net.http_post(
    url := ''https://nezcmvedhwknrcvtusjt.supabase.co/functions/v1/instagram-refresh-token'',
    headers := jsonb_build_object(
      ''Content-Type'', ''application/json'',
      ''x-refresh-secret'',
      (
        SELECT decrypted_secret
        FROM vault.decrypted_secrets
        WHERE name = ''instagram_refresh_job_secret''
      )
    ),
    body := ''{}''::jsonb
  );
  ', 'postgres', NULL, true);

