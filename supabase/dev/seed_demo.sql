-- Demo data for developing Nakesa Patient — DEVELOPMENT ONLY.
--
-- Creates 3 demo health workers with listed practices, practice hours and services, so
-- the patient app has something to search and book. Every demo name ends in "(Demo)".
-- The demo health workers can sign in to Nakesa Pro to see bookings arrive:
--   demo-bidan@nakesa.test / demo-drg@nakesa.test / demo-fisio@nakesa.test
--   password: DemoNakesa123
--
-- Run once in Supabase → SQL Editor, after migration 20261005170000_patient_app.sql.
-- Remove everything again with cleanup_demo.sql (do this before the app goes live).

do $$
declare
  r          record;
  v_user     uuid;
  v_practice uuid;
begin
  if exists (select 1 from auth.users where email like 'demo-%@nakesa.test') then
    raise exception 'Demo data already exists. Run cleanup_demo.sql first.';
  end if;

  for r in
    select * from (values
      ('demo-bidan@nakesa.test', 'Siti Rahmawati', 'bidan', 'Praktik Bidan Sehat Ibu (Demo)', null,
       'Jl. Melati No. 12, Wonokromo', 'Surabaya', 'Jawa Timur', '081200000001',
       'Praktik bidan mandiri untuk pemeriksaan kehamilan, KB, imunisasi, dan pemeriksaan bayi.', 'split'),
      ('demo-drg@nakesa.test', 'Andi Pratama', 'dokter_gigi', 'Klinik Gigi Senyum (Demo)', null,
       'Jl. Kenanga No. 5, Gubeng', 'Surabaya', 'Jawa Timur', '081200000002',
       'Perawatan gigi untuk keluarga: periksa, tambal, cabut, dan scaling.', 'evening'),
      ('demo-fisio@nakesa.test', 'Rina Wulandari', 'fisioterapis', 'Fisioterapi Sehat Gerak (Demo)', null,
       'Jl. Mawar No. 8, Buduran', 'Sidoarjo', 'Jawa Timur', '081200000003',
       'Fisioterapi untuk nyeri otot dan sendi, pemulihan cedera, dan pasca stroke.', 'morning')
    ) as t (email, full_name, profession, practice_name, specialty, address, city, province, phone,
            description, schedule)
  loop
    v_user := gen_random_uuid();

    insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
                            raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
                            confirmation_token, recovery_token, email_change, email_change_token_new)
    values ('00000000-0000-0000-0000-000000000000', v_user, 'authenticated', 'authenticated', r.email,
            extensions.crypt('DemoNakesa123', extensions.gen_salt('bf')), now(),
            '{"provider": "email", "providers": ["email"]}'::jsonb,
            jsonb_build_object('full_name', r.full_name), now(), now(), '', '', '', '');

    insert into auth.identities (id, user_id, provider_id, provider, identity_data,
                                 last_sign_in_at, created_at, updated_at)
    values (gen_random_uuid(), v_user, v_user::text, 'email',
            jsonb_build_object('sub', v_user::text, 'email', r.email, 'email_verified', true),
            now(), now(), now());

    -- The sign-up trigger made the profile; the practice trigger makes them its admin.
    update public.profiles set profession = r.profession where id = v_user;

    insert into public.practices (owner_id, name, specialty, address, city, province, phone, description,
                                  is_open, booking_enabled, is_listed)
    values (v_user, r.practice_name, r.specialty, r.address, r.city, r.province, r.phone, r.description,
            true, true, true)
    returning id into v_practice;

    -- Practice hours (0 = Sunday … 6 = Saturday)
    insert into public.practice_hours (owner_id, day_of_week, opens_at, closes_at)
    select v_user, h.day, h.opens, h.closes
    from (values
      ('split',   1, time '08:00', time '12:00'), ('split',   1, time '16:00', time '20:00'),
      ('split',   2, time '08:00', time '12:00'), ('split',   2, time '16:00', time '20:00'),
      ('split',   3, time '08:00', time '12:00'), ('split',   3, time '16:00', time '20:00'),
      ('split',   4, time '08:00', time '12:00'), ('split',   4, time '16:00', time '20:00'),
      ('split',   5, time '08:00', time '11:00'), ('split',   5, time '16:00', time '20:00'),
      ('split',   6, time '08:00', time '12:00'),
      ('evening', 1, time '17:00', time '21:00'), ('evening', 2, time '17:00', time '21:00'),
      ('evening', 3, time '17:00', time '21:00'), ('evening', 4, time '17:00', time '21:00'),
      ('evening', 5, time '17:00', time '21:00'), ('evening', 6, time '09:00', time '13:00'),
      ('morning', 1, time '07:00', time '13:00'), ('morning', 2, time '07:00', time '13:00'),
      ('morning', 3, time '07:00', time '13:00'), ('morning', 4, time '07:00', time '13:00'),
      ('morning', 5, time '07:00', time '11:00'), ('morning', 6, time '07:00', time '12:00'),
      ('morning', 0, time '08:00', time '11:00')
    ) as h (schedule, day, opens, closes)
    where h.schedule = r.schedule;

    -- Services. The midwife adds none, so she offers the profession's default services.
    insert into public.practice_services (practice_id, name, description, price, duration_minutes, sort_order)
    select v_practice, s.name, s.description, s.price, s.minutes, s.sort_order
    from (values
      ('dokter_gigi', 'Periksa Gigi', 'Pemeriksaan gigi dan mulut, konsultasi keluhan.', 100000::bigint, 30, 10),
      ('dokter_gigi', 'Tambal Gigi', 'Tambal gigi berlubang dengan bahan sewarna gigi.', 250000, 45, 20),
      ('dokter_gigi', 'Scaling', 'Membersihkan karang gigi.', 300000, 60, 30),
      ('dokter_gigi', 'Cabut Gigi', 'Harga tergantung kondisi gigi.', null, 30, 40),
      ('fisioterapis', 'Terapi Nyeri Punggung & Leher', null, 175000, 60, 10),
      ('fisioterapis', 'Terapi Pasca Cedera', null, 200000, 60, 20),
      ('fisioterapis', 'Konsultasi Fisioterapi', 'Pemeriksaan awal dan rencana terapi.', null, 30, 30)
    ) as s (profession, name, description, price, minutes, sort_order)
    where s.profession = r.profession;
  end loop;
end;
$$;
