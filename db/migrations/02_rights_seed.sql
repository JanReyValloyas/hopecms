-- M3-PR-02: 4 modules + 9 rights + SUPERADMIN seed
-- Rights Seed Data
-- Sprint 1 | M3 DB Engineer

-- 4 Modules
INSERT INTO "Module" VALUES ('Cust_Mod', 'Customer Module', 'ACTIVE', 'SEEDED');
INSERT INTO "Module" VALUES ('Sales_Mod', 'Sales Module', 'ACTIVE', 'SEEDED');
INSERT INTO "Module" VALUES ('Prod_Mod', 'Product Module', 'ACTIVE', 'SEEDED');
INSERT INTO "Module" VALUES ('Adm_Mod', 'Admin Module', 'ACTIVE', 'SEEDED');

-- 9 Rights
INSERT INTO rights VALUES ('CUST_VIEW','View Customers',1,'Cust_Mod','ACTIVE','SEEDED');
INSERT INTO rights VALUES ('CUST_ADD','Add Customer',1,'Cust_Mod','ACTIVE','SEEDED');
INSERT INTO rights VALUES ('CUST_EDIT','Edit Customer',1,'Cust_Mod','ACTIVE','SEEDED');
INSERT INTO rights VALUES ('CUST_DEL','Soft Delete Customer',1,'Cust_Mod','ACTIVE','SEEDED');
INSERT INTO rights VALUES ('SALES_VIEW','View Sales',1,'Sales_Mod','ACTIVE','SEEDED');
INSERT INTO rights VALUES ('SD_VIEW','View Sales Detail',1,'Sales_Mod','ACTIVE','SEEDED');
INSERT INTO rights VALUES ('PROD_VIEW','View Products',1,'Prod_Mod','ACTIVE','SEEDED');
INSERT INTO rights VALUES ('PRICE_VIEW','View Price History',1,'Prod_Mod','ACTIVE','SEEDED');
INSERT INTO rights VALUES ('ADM_USER','Admin Activate User',1,'Adm_Mod','ACTIVE','SEEDED');

-- SUPERADMIN
INSERT INTO "user" VALUES (
  'SUPERADMIN-UUID-HERE',
  'jcesperanza',
  'SUPERADMIN',
  'ACTIVE',
  'SEEDED'
);
