-- Removes the demo data from seed_demo.sql: the demo health workers, their practices,
-- hours and services, and every booking made at those practices (cascade).
-- Patient accounts you created while testing are kept; delete them in
-- Supabase → Authentication → Users if you no longer need them.
delete from auth.users where email like 'demo-%@nakesa.test';
