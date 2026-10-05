-- Google sign-in for Nakesa Patient.
--
-- Email sign-ups send `app: 'nakesa_patient'` in their user metadata, so the sign-up trigger gives
-- them the PATIENT role. A Google sign-up cannot send that metadata and gets the default role. The
-- app therefore calls this function right after a Google account signs in and is not a patient yet
-- (src/features/auth/AuthProvider.tsx). The database decides: only an account that Google created a
-- moment ago and that is not used in Nakesa Pro becomes a patient account. The `patient_profiles`
-- row is made by the app's onboarding, as for email sign-ups that skip it.
--
-- Order: after 20261005170000_patient_app.sql, and BEFORE turning on the Google provider in
-- Supabase (otherwise new Google accounts keep the default role and cannot use the patient app).
-- Review against the sign-up trigger and Nakesa Pro's tables before running in production.

create or replace function public.patient_claim_new_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_provider text;
  v_created  timestamptz;
begin
  select u.raw_app_meta_data ->> 'provider', u.created_at
    into v_provider, v_created
    from auth.users u
   where u.id = auth.uid();

  if not found then
    raise exception 'Silakan masuk dulu.';
  end if;

  if exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'PATIENT') then
    return; -- already a patient
  end if;

  -- Only an account made a moment ago by Google (or another social provider), that does not
  -- run a practice in Nakesa Pro. Email accounts chose their app when they signed up.
  if coalesce(v_provider, 'email') = 'email'
     or v_created < now() - interval '15 minutes'
     or exists (select 1 from public.practices pr where pr.owner_id = auth.uid()) then
    raise exception 'Akun ini terdaftar sebagai tenaga kesehatan di Nakesa Pro. Untuk Nakesa Patient, daftar dengan email lain.';
  end if;

  update public.profiles set role = 'PATIENT' where id = auth.uid();
end;
$$;

revoke all on function public.patient_claim_new_account() from public, anon;
grant execute on function public.patient_claim_new_account() to authenticated;
