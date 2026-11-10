-- =====================================================================
-- Haltev AI (demo) — 04_add_tutors.sql
-- Adds tutors Vanya Mayazura and Andrea with their own batches.
-- Safe to run more than once (skips rows that already exist).
-- Already included in 03_seed.sql, so a fresh setup does NOT need this file.
-- =====================================================================

insert into tutors (id, name, expertise, bio) values
(15,'Vanya Mayazura','{Web,Laravel,Python,Data Science,AI,Android,React Native}','Fullstack, AI & mobile instructor'),
(16,'Andrea',        '{Web,Laravel,React,JavaScript,React Native,Flutter,Android}','Web & mobile instructor')
on conflict (id) do update set name = excluded.name, expertise = excluded.expertise, bio = excluded.bio;

select setval(pg_get_serial_sequence('tutors','id'), (select max(id) from tutors));

insert into batches (program_id, tutor_id, batch_no, day_type, days, start_date, end_date, time_start, time_end, mode, capacity, seats_taken)
select * from (values
  -- Vanya Mayazura: Web, AI & Data Science, Mobile
  (1, 15, 42, 'weekday',      'Wed–Thu–Fri', date '2026-11-18', date '2027-01-28', time '13:00', time '15:00', 'online_offline', 5, 1),
  (3, 15, 36, 'weekend',      'Sat & Sun',   date '2026-11-21', date '2027-02-28', time '08:00', time '10:00', 'online_offline', 5, 0),
  (11,15, 24, 'weekday',      'Mon–Tue–Wed', date '2026-11-16', date '2026-12-16', time '15:00', time '17:00', 'online_offline', 5, 1),
  (12,15, 43, 'after_office', 'Tue & Thu',   date '2026-11-17', date '2026-12-17', time '19:00', time '21:00', 'online_offline', 5, 0),
  (19,15, 43, 'weekend',      'Sat & Sun',   date '2026-11-21', date '2027-01-03', time '13:00', time '15:00', 'online_offline', 5, 0),
  (20,15, 23, 'weekday',      'Mon–Tue–Wed', date '2026-11-16', date '2026-12-16', time '08:00', time '10:00', 'online_offline', 5, 1),
  -- Andrea: Web, Mobile
  (1, 16, 43, 'after_office', 'Thu & Fri',   date '2026-11-19', date '2027-01-29', time '19:00', time '21:00', 'online_offline', 5, 0),
  (2, 16, 36, 'weekday',      'Wed–Thu–Fri', date '2026-11-18', date '2027-01-28', time '08:00', time '10:00', 'online_offline', 5, 1),
  (16,16, 22, 'weekday',      'Mon–Tue–Wed', date '2026-11-16', date '2026-12-16', time '10:00', time '12:00', 'online_offline', 5, 0),
  (17,16, 30, 'weekend',      'Sat & Sun',   date '2026-11-21', date '2027-01-03', time '13:00', time '15:00', 'online_offline', 5, 1),
  (21,16, 25, 'weekend',      'Sat & Sun',   date '2026-11-21', date '2027-01-03', time '08:00', time '10:00', 'online_offline', 5, 0),
  (15,16, 47, 'after_office', 'Mon & Tue',   date '2026-11-16', date '2026-12-16', time '19:00', time '21:00', 'online_offline', 5, 0)
) as v(program_id, tutor_id, batch_no, day_type, days, start_date, end_date, time_start, time_end, mode, capacity, seats_taken)
where not exists (
  select 1 from batches b
  where b.program_id = v.program_id and b.tutor_id = v.tutor_id and b.batch_no = v.batch_no and b.day_type = v.day_type
);
