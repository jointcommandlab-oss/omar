# Seed data policy

There is deliberately NO seed SQL here.

- No fake users, orders, reviews, subscriptions, or payments.
- No invented route distances/elevations. Metrics stay NULL until verified
  (the `routes` table requires `source` + `verified_at` whenever a metric is set).
- Create real content through the admin account after the first-admin step in `docs/BACKEND_SETUP.md`.

Optional example (commented out; use only REAL, verified data):

```sql
-- insert into public.routes (slug, title_ar, title_en, emirate, status)
-- values ('example-route', 'اسم المسار', 'Route name', 'dubai', 'draft');
```
