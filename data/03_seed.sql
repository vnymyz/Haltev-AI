-- =====================================================================
-- Haltev AI (demo) — 03_seed.sql
-- Programs, prices and batch schedules from docs/haltev_knowledge_base.md
-- (collected 10 Nov 2026). Tutors are FAKE demo data: the website does
-- not publish tutor names. Replace them with real tutors before going live.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Programs
-- ---------------------------------------------------------------------
insert into programs (id, slug, name, category, mode, sessions_info, url, summary) values
-- Bootcamps (4 months study + 2 months internship)
(1,'website-bootcamp','AI Enhanced Fullstack Website Development Bootcamp','bootcamp','online_offline','32 meetings × 120 min + 2-month internship','https://haltev.id/website-bootcamp/','Beginner to job-ready Fullstack Web Developer (HTML, CSS, JS, PHP, MySQL, Laravel, AI, deployment). BNSP Web Developer.'),
(2,'react-native-bootcamp','AI Web & Mobile Dev Bootcamp (React & React Native)','bootcamp','online_offline','68 sessions × 60 min + 2-month internship','https://haltev.id/react-native-bootcamp/','Fullstack Web & Mobile Developer with React, React Native and Node.js. BNSP Web & Mobile Developer.'),
(3,'data-science-bootcamp','AI Machine Learning & Data Science Bootcamp','bootcamp','online_offline','32 meetings × 120 min + 2-month internship','https://haltev.id/data-science-bootcamp/','Python, statistics, ML and AI to become a Data Scientist. BNSP Associate Data Scientist.'),
(4,'android-bootcamp','AI Enhanced Fullstack Android Development Bootcamp','bootcamp','online_offline','32 meetings × 120 min + 2-month internship','https://haltev.id/android-bootcamp/','Native Android with Java, Firebase, Play Store. BNSP Mobile Developer.'),
(5,'digital-marketing-bootcamp','AI Digital Marketing Specialist Bootcamp','bootcamp','online_offline','32 meetings × 120 min + 2-month internship','https://haltev.id/digital-marketing-boootcamp','Fullstack Digital Marketer: WordPress, SEO, ads, email, KOL, marketplace, AI. BNSP Digital Marketing.'),
(6,'java-spring-bootcamp','Java Spring Boot & Japanese Language Proficiency','bootcamp','online_offline','65 meetings × 6 hours','https://haltev.id/java-spring-bootcamp','Java back-end + Japanese language & work culture for Japanese companies (job guarantee program).'),
-- Courses
(10,'prompting-ai','Prompting Artificial Intelligence','course','online_offline','Regular 4 × 90 min · Intensive 6 × 90 min','https://haltev.id/classes/prompting-artificial-intelligence','Write effective prompts for ChatGPT & AI tools for work, coding and debugging.'),
(11,'ai-engineer','AI Engineer (Artificial Intelligence Engineer)','course','online_offline','Regular 16 × 2 h · Intensive 24 × 2 h','https://haltev.id/classes/artificial-intelligence','End-to-end AI: Python, ML, NLP, CNN, AWS AI, deployment with n8n & SageMaker.'),
(12,'python-data-science','Intro to Python & AI for Data Science','course','online_offline','Regular 16 meetings · Intensive 24 meetings','https://haltev.id/classes/intro-to-python-for-data-science/','Python + data analysis + simple ML for beginners.'),
(13,'algorithms-c','Algorithms, C & Data Structures with AI','course','online_offline','Regular 16 meetings · Intensive 24 meetings','https://haltev.id/classes/algorithms-c-data-structures/','CS fundamentals in C: algorithms, data structures, sorting, graphs, DP.'),
(14,'website-programming','AI-Powered Website Programming','course','online_offline','Regular 16 meetings · Intensive 24 meetings','https://haltev.id/classes/website-programming/','Beginner fullstack web: HTML, CSS, JS, Bootstrap, PHP, MySQL, hosting.'),
(15,'android-java','AI-Powered Android App Development (Java)','course','online_offline','Regular 16 meetings · Intensive 24 meetings','https://haltev.id/classes/android-java/','Native Android with Java, Firebase and Play Store.'),
(16,'laravel','Laravel & AI Web Engineering','course','online_offline','Regular 16 meetings · Intensive 24 meetings','https://haltev.id/classes/laravel/','Laravel 12 e-commerce project, hosted on a real domain.'),
(17,'react-express','AI-Powered Fullstack JavaScript (React & Express)','course','online_offline','Regular 16 meetings · Intensive 24 meetings','https://haltev.id/classes/react-js/','React front end + Express/Node.js + MySQL back end.'),
(18,'django','Django Python Developer with AI','course','online','Regular 12 meetings · Intensive 16 meetings','https://haltev.id/classes/django-python','Web apps with Python & Django plus AI integration. Online only.'),
(19,'android-kotlin','Android Kotlin Developer with AI','course','online_offline','Regular 16 meetings · Intensive 24 meetings','https://haltev.id/classes/android-kotlin/','Native Android with Kotlin and AI features.'),
(20,'react-native','AI-Integrated React Native Development','course','online_offline','Regular 16 meetings · Intensive 24 meetings','https://haltev.id/classes/react-native/','Cross-platform mobile apps with React Native.'),
(21,'flutter','Professional Flutter Mobile Engineer with AI','course','online_offline','Regular 16 meetings · Intensive 24 meetings','https://haltev.id/classes/flutter/','Cross-platform mobile apps with Flutter & Dart.'),
(22,'big-data','Big Data & Integration with AI','course','online','Regular 16 meetings · Intensive 24 meetings','https://haltev.id/classes/big-data-integration/','Hadoop, Spark/PySpark, MySQL cluster, Tableau. Online only.'),
(23,'devops','DevOps Engineer with AI','course','online','Regular 16 meetings · Intensive 24 meetings','https://haltev.id/classes/devops-engineering','Docker, Compose, CI/CD, Kubernetes. Online batches.'),
(24,'iot','Intelligent IoT Engineering','course','online_offline','Regular 16 meetings · Intensive 24 meetings','https://haltev.id/classes/internet-of-things','Arduino + C + Android Java app for connected devices.'),
(25,'digital-marketing-course','Digital Marketing with AI','course','online_offline','Regular 16 × 120 min · Intensive 24 × 120 min','https://haltev.id/classes/digital-marketing','WordPress, WooCommerce, Canva, SEO, email & social ads with AI.'),
(26,'cyber-security','Modern Cyber Security','course','online','Regular only, 16 meetings','https://haltev.id/classes/cyber-security','Ethical hacking & defense. Online only.'),
(27,'game-dev','AI-Integrated Game Development (Unity)','course','online','Regular 12 × 120 min · Intensive 16 × 120 min','https://haltev.id/classes/game-development','Make games with Unity & C#. Online.'),
-- Microsoft Office (3 sessions × 90 min)
(30,'ms-word-beginner','MS Word Beginner','office','online_offline','3 sessions × 90 min','https://haltev.id/classes/microsoft-word-beginner','Professional documents, tables, mail merge, AI.'),
(31,'ms-word-intermediate','MS Word Intermediate','office','online_offline','3 sessions × 90 min','https://haltev.id/classes/microsoft-word-intermediate','Templates, TOC, collaboration, document security, AI.'),
(32,'ms-excel-beginner','MS Excel Beginner','office','online_offline','3 sessions × 90 min','https://haltev.id/classes/microsoft-excel-beginner','Basic formulas, worksheets, charts, AI.'),
(33,'ms-excel-intermediate','MS Excel Intermediate','office','online_offline','3 sessions × 90 min','https://haltev.id/classes/microsoft-excel-intermediate','Nested functions, VLOOKUP, pivot tables, AI.'),
(34,'ms-powerpoint-beginner','MS PowerPoint Beginner','office','online_offline','3 sessions × 90 min','https://haltev.id/classes/microsoft-power-point-beginner','Attractive presentations, templates, AI.'),
(35,'ms-powerpoint-intermediate','MS PowerPoint Intermediate','office','online_offline','3 sessions × 90 min','https://haltev.id/classes/microsoft-power-point-intermediate','Advanced layouts, animation, storytelling, AI.'),
(36,'ms-powerbi-beginner','MS Power BI Beginner','office','online_offline','3 sessions × 90 min','https://haltev.id/classes/microsoft-power-bi-beginner','Power Query, data modelling, dashboards, AI.'),
(37,'ms-powerbi-intermediate','MS Power BI Intermediate','office','online_offline','3 sessions × 90 min','https://haltev.id/classes/power-bi-intermediate','DAX measures, advanced visuals, AI.'),
-- Kids & Teens (12 meetings × 90 min)
(40,'kids-level-1','AI Smart Coding – Kids Level 1 (SD grades 1–3)','kids','online_offline','12 meetings × 90 min','https://haltev.id/classes/coding-for-kids-i','Visual coding & game making with MIT Scratch.'),
(41,'kids-level-2','AI Smart Coding – Kids Level 2 (SD grades 4–6)','kids','online_offline','12 meetings × 90 min','https://haltev.id/classes/coding-for-kids-ii','Project-based coding with Roblox & Scratch.'),
(42,'teens','AI App & Game Developer for Teens (SMP grades 7–9)','kids','online_offline','12 meetings × 90 min','https://haltev.id/classes/coding-for-teens','Python + game in their own Android app.'),
-- Fundamentals (3 meetings × 2 hours)
(50,'fundamentals-php','Fundamentals: PHP Programming','fundamentals','online_offline','3 meetings × 2 hours','https://haltev.id/fundamentals-program','Quick starter class.'),
(51,'fundamentals-java','Fundamentals: Java Programming','fundamentals','online_offline','3 meetings × 2 hours','https://haltev.id/fundamentals-program','Quick starter class.'),
(52,'fundamentals-python','Fundamentals: Python Programming','fundamentals','online_offline','3 meetings × 2 hours','https://haltev.id/fundamentals-program','Quick starter class.'),
(53,'fundamentals-javascript','Fundamentals: JavaScript Programming','fundamentals','online_offline','3 meetings × 2 hours','https://haltev.id/fundamentals-program','Quick starter class.'),
(54,'fundamentals-c','Fundamentals: C Programming','fundamentals','online_offline','3 meetings × 2 hours','https://haltev.id/fundamentals-program','Quick starter class.'),
(55,'fundamentals-cpp','Fundamentals: C++ Programming','fundamentals','online_offline','3 meetings × 2 hours','https://haltev.id/fundamentals-program','Quick starter class.'),
(56,'fundamentals-html','Fundamentals: HTML Class','fundamentals','online_offline','3 meetings × 2 hours','https://haltev.id/fundamentals-program','Quick starter class.'),
(57,'fundamentals-css','Fundamentals: CSS Class','fundamentals','online_offline','3 meetings × 2 hours','https://haltev.id/fundamentals-program','Quick starter class.'),
(58,'fundamentals-uiux','Fundamentals: UI/UX Designer (Figma)','fundamentals','online_offline','3 meetings × 2 hours','https://haltev.id/fundamentals-program','Quick starter class.'),
(59,'fundamentals-sql','Fundamentals: Database SQL (MySQL)','fundamentals','online_offline','3 meetings × 2 hours','https://haltev.id/fundamentals-program','Quick starter class.'),
(60,'fundamentals-nosql','Fundamentals: Database NoSQL','fundamentals','online_offline','3 meetings × 2 hours','https://haltev.id/fundamentals-program','Quick starter class.'),
-- Private class (1-on-1, flexible schedule)
(70,'private-web','Private: Web Developer Program','private','online_offline','1-on-1, flexible schedule','https://haltev.id/private','Fullstack front + back end, 1-on-1.'),
(71,'private-python-ds','Private: Python for Data Science','private','online_offline','1-on-1, flexible schedule','https://haltev.id/private','Statistics-based problem solving, 1-on-1.'),
(72,'private-react','Private: React & React Native Basic','private','online_offline','1-on-1, flexible schedule','https://haltev.id/private','JavaScript ES6, React & React Native, 1-on-1.'),
(73,'private-android','Private: Native Android Program','private','online_offline','1-on-1, flexible schedule','https://haltev.id/private','Native Android, 1-on-1.'),
(74,'private-digital-marketing','Private: Digital Marketing','private','online_offline','1-on-1, flexible schedule','https://haltev.id/private','Website, email, design, social, Google Ads, SEO, 1-on-1.'),
(75,'private-algo-c','Private: Algorithm & C Programming','private','online_offline','1-on-1, flexible schedule','https://haltev.id/private','Academic support for campus/school, 1-on-1.')
on conflict (id) do nothing;

select setval(pg_get_serial_sequence('programs','id'), (select max(id) from programs));

-- ---------------------------------------------------------------------
-- Prices (Rupiah). price = current promo price, normal_price = crossed-out
-- ---------------------------------------------------------------------
insert into program_prices (program_id, package, price, normal_price, note) values
(1,'weekday',14990000,26890000,null),(1,'weekend',15700000,28490000,null),
(2,'weekday',24990000,48990000,null),(2,'weekend',26990000,52120000,null),
(3,'weekday',15990000,28890000,null),(3,'weekend',16990000,31890000,null),
(4,'weekday',15950000,31890000,null),(4,'weekend',16950000,32890000,null),
(5,'weekday',14990000,26890000,null),(5,'weekend',15700000,28490000,null),
(6,'weekday',30000000,null,'Weekday only'),

(10,'regular',1800000,null,'4 × 90 min'),(10,'intensive',2400000,null,'6 × 90 min'),
(11,'regular',7200000,null,'16 × 2 h'),(11,'intensive',18400000,null,'24 × 2 h'),
(12,'regular',5950000,11900000,null),(12,'intensive',8950000,15900000,null),
(13,'regular',4990000,9980000,null),(13,'intensive',7950000,14700000,null),
(14,'regular',4990000,9980000,null),(14,'intensive',7950000,14700000,null),
(15,'regular',5850000,11700000,null),(15,'intensive',8950000,15800000,null),
(16,'regular',8440000,14880000,null),(16,'intensive',13640000,22320000,null),
(17,'regular',8440000,14880000,null),(17,'intensive',13640000,22320000,null),
(18,'regular',8440000,null,'12 meetings'),(18,'intensive',13640000,null,'16 meetings'),
(19,'regular',6890000,11980000,null),(19,'intensive',8890000,15780000,null),
(20,'regular',12000000,24000000,null),(20,'intensive',18000000,36000000,null),
(21,'regular',14250000,28500000,null),(21,'intensive',21375000,42500000,null),
(22,'regular',6950000,11900000,null),(22,'intensive',9950000,15900000,null),
(23,'regular',6990000,9980000,null),(23,'intensive',9950000,14700000,null),
(24,'regular',6980000,15960000,null),(24,'intensive',10480000,22960000,null),
(25,'regular',6450000,8750000,'16 × 120 min'),(25,'intensive',8950000,15490000,'24 × 120 min'),
(26,'regular',5700000,9980000,'Regular only'),
(27,'regular',6750000,9980000,'12 × 120 min'),(27,'intensive',9350000,null,'16 × 120 min'),

(30,'weekday',490000,null,null),(30,'weekend',590000,null,null),(30,'bundling',1025000,null,'Word Beginner + Intermediate (6 sessions)'),
(31,'weekday',690000,null,null),(31,'weekend',790000,null,null),(31,'bundling',1025000,null,'Word Beginner + Intermediate (6 sessions)'),
(32,'weekday',490000,null,null),(32,'weekend',590000,null,null),(32,'bundling',1100000,null,'Excel Beginner + Intermediate (6 sessions)'),
(33,'weekday',690000,null,null),(33,'weekend',790000,null,null),(33,'bundling',1100000,null,'Excel Beginner + Intermediate (6 sessions)'),
(34,'weekday',490000,null,null),(34,'weekend',590000,null,null),(34,'bundling',1015000,null,'PowerPoint Beginner + Intermediate (6 sessions)'),
(35,'weekday',690000,null,null),(35,'weekend',790000,null,null),(35,'bundling',1015000,null,'PowerPoint Beginner + Intermediate (6 sessions)'),
(36,'weekday',550000,null,null),(36,'weekend',650000,null,null),
(37,'weekday',790000,null,null),(37,'weekend',890000,null,null),

(40,'weekday',2490000,5890000,null),(40,'weekend',2595000,6120000,null),
(41,'weekday',2690000,4890000,null),(41,'weekend',2790000,5120000,null),
(42,'weekday',2890000,4890000,null),(42,'weekend',2995000,5120000,null),

(50,'standard',600000,1200000,null),(51,'standard',600000,1200000,null),(52,'standard',600000,1200000,null),
(53,'standard',550000,1100000,null),(54,'standard',550000,1100000,null),(55,'standard',550000,1100000,null),
(56,'standard',550000,1100000,null),(57,'standard',550000,1100000,null),(58,'standard',600000,1200000,null),
(59,'standard',600000,1200000,null),(60,'standard',600000,1200000,null),

(70,'standard',9600000,null,null),(71,'standard',11200000,null,null),(72,'standard',16499000,null,null),
(73,'standard',11200000,null,null),(74,'standard',11200000,null,null),(75,'standard',9600000,null,null)
on conflict (program_id, package) do nothing;

-- ---------------------------------------------------------------------
-- Tutors. Ids 1–14 are FAKE demo names; 15–16 are real Haltev tutors.
-- ---------------------------------------------------------------------
insert into tutors (id, name, expertise, bio) values
(1,'Rizky Pratama',   '{Web,PHP,Laravel}',            'Fullstack web developer, 7 yrs (demo tutor)'),
(2,'Dimas Saputra',   '{JavaScript,React,React Native}','Frontend & mobile engineer, 6 yrs (demo tutor)'),
(3,'Nadia Putri',     '{Python,Data Science,ML}',      'Data scientist, 6 yrs (demo tutor)'),
(4,'Fajar Nugroho',   '{Android,Java,Kotlin,IoT}',     'Android engineer, 8 yrs (demo tutor)'),
(5,'Sinta Maharani',  '{Digital Marketing,SEO,Ads}',   'Digital marketing lead, 7 yrs (demo tutor)'),
(6,'Hendra Wijaya',   '{Java,Spring Boot,Japanese}',   'Backend engineer for Japanese clients, 9 yrs (demo tutor)'),
(7,'Ayu Lestari',     '{Microsoft Office,Power BI}',   'Microsoft certified trainer (demo tutor)'),
(8,'Bima Aditya',     '{Kids Coding,Scratch,Roblox,Python}','Kids & teens coding teacher (demo tutor)'),
(9,'Galih Ramadhan',  '{DevOps,Cyber Security,Big Data}','DevOps & security engineer, 8 yrs (demo tutor)'),
(10,'Laras Anggraini','{Flutter,Unity,Game Dev}',      'Mobile & game developer, 6 yrs (demo tutor)'),
(11,'Yoga Firmansyah','{Algorithms,C,Fundamentals}',   'Software engineer & lecturer (demo tutor)'),
(12,'Maya Kurniawati','{AI,Prompt Engineering,AWS}',   'AI engineer, 6 yrs (demo tutor)'),
(13,'Andi Setiawan',  '{Web,PHP,Laravel,Django}',      'Backend engineer, 6 yrs (demo tutor)'),
(14,'Putri Amelia',   '{React Native,Flutter,JavaScript}','Mobile engineer, 5 yrs (demo tutor)'),
(15,'Vanya Mayazura', '{Web,Laravel,Python,Data Science,AI,Android,React Native}','Fullstack, AI & mobile instructor'),
(16,'Andrea',         '{Web,Laravel,React,JavaScript,React Native,Flutter,Android}','Web & mobile instructor')
on conflict (id) do nothing;

select setval(pg_get_serial_sequence('tutors','id'), (select max(id) from tutors));

-- ---------------------------------------------------------------------
-- Batches (open as of Nov 2026). seats_taken pre-filled for a realistic demo.
-- Course batches: end_date is the Regular end; Intensive runs longer.
-- ---------------------------------------------------------------------
insert into batches (program_id, tutor_id, batch_no, day_type, days, start_date, end_date, time_start, time_end, mode, capacity, seats_taken) values
-- Bootcamps
(1, 1, 40,'weekday',     'Mon–Tue–Wed','2026-11-16','2027-01-26','08:00','10:00','online_offline',5,2),
(1, 1, 41,'weekend',     'Sat & Sun',  '2026-11-21','2027-02-28','08:00','10:00','online_offline',5,3),
(1,13, 39,'after_office','Mon–Tue–Wed','2026-11-16','2027-01-26','19:00','21:00','online_offline',5,4),
(2, 2, 34,'weekday',     'Mon–Tue–Wed','2026-11-16','2027-01-26','15:00','17:00','online_offline',5,1),
(2, 2, 35,'weekend',     'Sat & Sun',  '2026-11-21','2027-02-28','08:00','12:00','online_offline',5,2),
(2,14, 33,'after_office','Mon–Tue–Wed','2026-11-16','2027-01-26','19:00','21:00','online_offline',5,3),
(3, 3, 34,'weekday',     'Mon–Wed–Fri','2026-11-16','2027-01-26','08:00','10:00','online_offline',5,2),
(3, 3, 35,'weekend',     'Sat & Sun',  '2026-11-21','2027-02-28','13:00','15:00','online_offline',5,1),
(3, 3, 33,'after_office','Mon–Wed–Fri','2026-11-16','2027-01-26','19:00','21:00','online_offline',5,5),
(4, 4, 41,'weekday',     'Mon–Tue–Wed','2026-11-16','2027-01-26','08:00','10:00','online_offline',5,2),
(4, 4, 42,'weekend',     'Sat & Sun',  '2026-11-21','2027-02-28','08:00','10:00','online_offline',5,0),
(4, 4, 40,'after_office','Mon–Tue–Wed','2026-11-16','2027-01-26','19:00','21:00','online_offline',5,3),
(5, 5, 41,'weekday',     'Mon–Wed–Fri','2026-11-16','2027-01-27','13:00','15:00','online_offline',5,2),
(5, 5, 42,'weekend',     'Sat & Sun',  '2026-11-21','2027-02-28','13:00','15:00','online_offline',5,1),
(5, 5, 42,'after_office','Mon–Wed',    '2026-11-16','2027-01-27','19:00','21:00','online_offline',5,2),
(6, 6,  6,'weekday',     'Mon–Fri',    '2026-11-30','2027-02-28','08:00','15:00','online_offline',5,3),
-- Courses
(10,12,22,'weekday',     'Wed–Sat',    '2026-11-25','2026-11-28','10:00','15:00','online_offline',5,1),
(10,12,23,'weekend',     'Sat & Sun',  '2026-11-28','2026-11-29','08:00','12:00','online_offline',5,2),
(11,12,22,'weekday',     'Mon–Tue–Wed','2026-11-16','2026-12-16','10:00','12:00','online_offline',5,1),
(11,12,23,'weekend',     'Sat & Sun',  '2026-11-21','2027-01-03','10:00','12:00','online_offline',5,0),
(12,12,42,'weekday',     'Mon–Thu–Fri','2026-11-16','2026-12-16','08:00','10:00','online_offline',5,2),
(12, 3,41,'weekend',     'Sat & Sun',  '2026-11-21','2027-01-03','10:00','12:00','online_offline',5,3),
(12,12,42,'after_office','Mon–Thu–Fri','2026-11-16','2026-12-16','19:00','21:00','online_offline',5,1),
(13,11,23,'weekday',     'Mon–Wed–Fri','2026-11-19','2027-01-08','15:00','17:00','online_offline',5,2),
(13,11,24,'weekend',     'Sat & Sun',  '2026-11-21','2027-01-03','15:00','17:00','online_offline',5,1),
(13,11,null,'after_office','Mon–Wed–Fri','2026-11-16','2026-12-16','18:00','20:00','online_offline',5,0),
(14,13,30,'weekday',     'Mon–Tue–Wed','2026-11-16','2026-12-16','08:00','10:00','online_offline',5,1),
(14,13,33,'weekend',     'Sat & Sun',  '2026-11-21','2027-01-03','08:00','10:00','online_offline',5,2),
(14, 1,29,'after_office','Mon–Tue–Wed','2026-11-16','2026-12-16','19:00','21:00','online_offline',5,1),
(15, 4,41,'weekday',     'Mon–Tue–Wed','2026-11-16','2026-12-16','10:00','12:00','online_offline',5,0),
(15, 4,46,'weekend',     'Sat & Sun',  '2026-11-21','2027-01-03','10:00','12:00','online_offline',5,1),
(16,13,18,'weekday',     'Mon–Tue–Wed','2026-11-16','2026-12-16','15:00','17:00','online_offline',5,2),
(16,13,21,'weekend',     'Sat & Sun',  '2026-11-21','2027-01-03','15:00','17:00','online_offline',5,1),
(16,13,null,'after_office','Thu & Fri','2026-11-16','2026-12-16','19:00','21:00','online_offline',5,0),
(17, 2,27,'weekday',     'Wed–Thu–Fri','2026-11-16','2026-12-16','15:00','17:00','online_offline',5,1),
(17,14,29,'weekend',     'Sat & Sun',  '2026-11-21','2027-01-03','10:00','12:00','online_offline',5,2),
(17, 2,28,'after_office','Thu & Fri',  '2026-11-16','2026-12-16','19:00','21:00','online_offline',5,1),
(18,13,17,'weekday',     'Wed–Thu–Fri','2026-11-16','2026-12-16','10:00','12:00','online',5,0),
(18,13,20,'weekend',     'Sat & Sun',  '2026-11-21','2027-01-03','09:00','11:00','online',5,1),
(19, 4,39,'weekday',     'Wed–Thu–Fri','2026-11-16','2026-12-16','10:00','12:00','online_offline',5,1),
(19, 4,42,'weekend',     'Sat & Sun',  '2026-11-21','2027-01-03','13:00','15:00','online_offline',5,0),
(20,14,20,'weekday',     'Wed–Thu–Fri','2026-11-16','2026-12-16','15:00','17:00','online_offline',5,2),
(20,14,22,'weekend',     'Sat & Sun',  '2026-11-21','2027-01-03','13:00','15:00','online_offline',5,1),
(21,10,20,'weekday',     'Wed–Thu–Fri','2026-11-16','2026-12-16','10:00','12:00','online_offline',5,1),
(21,10,24,'weekend',     'Sat & Sun',  '2026-11-21','2027-01-03','13:00','15:00','online_offline',5,2),
(22, 9,30,'weekday',     'Wed–Thu–Fri','2026-11-16','2026-12-16','10:00','12:00','online',5,1),
(22, 9,31,'weekend',     'Sat & Sun',  '2026-11-21','2027-01-03','13:00','15:00','online',5,0),
(23, 9,23,'weekend',     'Sat & Sun',  '2026-11-21','2027-01-03','10:00','12:00','online',5,2),
(23, 9,21,'after_office','Wed–Thu–Fri','2026-11-16','2026-12-16','19:00','21:00','online',5,1),
(24, 4,28,'weekday',     'Mon–Tue–Wed','2026-11-16','2026-12-16','13:00','15:00','online_offline',5,1),
(24, 4,26,'weekend',     'Sat & Sun',  '2026-11-21','2027-01-03','15:00','17:00','online_offline',5,0),
(25, 5,28,'weekday',     'Mon–Wed',    '2026-11-16','2026-12-21','10:00','12:00','online_offline',5,2),
(25, 5,29,'weekend',     'Sat & Sun',  '2026-11-21','2027-01-03','10:00','12:00','online_offline',5,1),
(26, 9, 4,'after_office','Mon–Tue–Wed','2026-11-16','2026-12-16','19:00','21:00','online',5,3),
(26, 9, 5,'weekend',     'Sat & Sun',  '2026-11-21','2027-01-03','13:00','15:00','online',5,1),
(27,10, 7,'weekday',     'Mon–Tue–Wed','2026-11-16','2026-12-16','13:00','15:00','online',5,1),
(27,10, 8,'weekend',     'Sat & Sun',  '2026-11-21','2027-01-03','10:00','12:00','online',5,0),
-- Microsoft Office (weekday 25–27 Nov, weekend 28–29 Nov)
(30, 7,39,'weekday','Wed–Fri',                      '2026-11-25','2026-11-27','08:00','09:30','online_offline',5,1),
(30, 7,41,'weekend','Sat 08:00–09:30 + Sun 08:00–11:00','2026-11-28','2026-11-29','08:00','11:00','online_offline',5,2),
(31, 7,39,'weekday','Mon–Wed',                      '2026-11-23','2026-11-25','09:30','11:00','online_offline',5,0),
(31, 7,41,'weekend','Sat 08:00–09:30 + Sun 08:00–11:00','2026-11-28','2026-11-29','08:00','11:00','online_offline',5,1),
(32, 7,39,'weekday','Mon–Wed',                      '2026-11-23','2026-11-25','09:30','11:00','online_offline',5,2),
(32, 7,41,'weekend','Sat 08:00–09:30 + Sun 08:00–11:00','2026-11-28','2026-11-29','08:00','11:00','online_offline',5,3),
(33, 7,39,'weekday','Mon–Wed',                      '2026-11-23','2026-11-25','13:00','14:30','online_offline',5,1),
(33, 7,40,'weekend','Sat 13:00–14:30 + Sun 13:00–16:00','2026-11-28','2026-11-29','13:00','16:00','online_offline',5,2),
(34, 7,39,'weekday','Mon–Wed',                      '2026-11-23','2026-11-25','15:00','16:30','online_offline',5,0),
(34, 7,41,'weekend','Sat 13:00–14:30 + Sun 13:00–16:00','2026-11-28','2026-11-29','13:00','16:00','online_offline',5,1),
(35, 7,39,'weekday','Mon–Wed',                      '2026-11-23','2026-11-25','15:00','16:30','online_offline',5,0),
(35, 7,40,'weekend','Sat 13:00–14:30 + Sun 13:00–16:00','2026-11-28','2026-11-29','13:00','16:00','online_offline',5,0),
(36, 7,40,'weekday','Wed–Fri',                      '2026-11-25','2026-11-27','15:00','16:30','online_offline',5,1),
(36, 7,41,'weekend','Sat 08:00–09:30 + Sun 08:00–11:00','2026-11-28','2026-11-29','08:00','11:00','online_offline',5,1),
(37, 7,40,'weekday','Wed–Fri',                      '2026-11-25','2026-11-27','15:00','16:30','online_offline',5,0),
(37, 7,41,'weekend','Sat 08:00–09:30 + Sun 08:00–11:00','2026-11-28','2026-11-29','08:00','11:00','online_offline',5,2),
-- Kids & Teens
(40, 8,24,'weekday','Thu & Fri','2026-11-16','2026-12-09','15:30','17:00','online_offline',5,2),
(40, 8,28,'weekend','Sat & Sun','2026-11-19','2026-12-25','13:00','15:00','online_offline',5,1),
(41, 8,21,'weekday','Mon & Wed','2026-11-16','2026-12-09','16:00','17:30','online_offline',5,1),
(41, 8,24,'weekend','Sat & Sun','2026-11-19','2026-12-25','13:00','15:00','online_offline',5,3),
(42, 8,22,'weekday','Wed & Fri','2026-11-16','2026-12-09','15:30','17:00','online_offline',5,0),
(42, 8,25,'weekend','Sat & Sun','2026-11-19','2026-12-25','13:00','15:00','online_offline',5,2),
-- Vanya Mayazura (15): Web, AI & Data Science, Mobile
(1, 15,42,'weekday',     'Wed–Thu–Fri','2026-11-18','2027-01-28','13:00','15:00','online_offline',5,1),
(3, 15,36,'weekend',     'Sat & Sun',  '2026-11-21','2027-02-28','08:00','10:00','online_offline',5,0),
(11,15,24,'weekday',     'Mon–Tue–Wed','2026-11-16','2026-12-16','15:00','17:00','online_offline',5,1),
(12,15,43,'after_office','Tue & Thu',  '2026-11-17','2026-12-17','19:00','21:00','online_offline',5,0),
(19,15,43,'weekend',     'Sat & Sun',  '2026-11-21','2027-01-03','13:00','15:00','online_offline',5,0),
(20,15,23,'weekday',     'Mon–Tue–Wed','2026-11-16','2026-12-16','08:00','10:00','online_offline',5,1),
-- Andrea (16): Web, Mobile
(1, 16,43,'after_office','Thu & Fri',  '2026-11-19','2027-01-29','19:00','21:00','online_offline',5,0),
(2, 16,36,'weekday',     'Wed–Thu–Fri','2026-11-18','2027-01-28','08:00','10:00','online_offline',5,1),
(16,16,22,'weekday',     'Mon–Tue–Wed','2026-11-16','2026-12-16','10:00','12:00','online_offline',5,0),
(17,16,30,'weekend',     'Sat & Sun',  '2026-11-21','2027-01-03','13:00','15:00','online_offline',5,1),
(21,16,25,'weekend',     'Sat & Sun',  '2026-11-21','2027-01-03','08:00','10:00','online_offline',5,0),
(15,16,47,'after_office','Mon & Tue',  '2026-11-16','2026-12-16','19:00','21:00','online_offline',5,0);
-- Fundamentals & Private: no fixed batches (flexible, arranged with admin).
