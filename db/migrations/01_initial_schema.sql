-- M3-PR-01: HopeDB 5 tables + record_status/stamp on customer only

-- HopeDB Initial Schema
-- Sprint 1 | M3 DB Engineer

-- TABLE 1: customer
CREATE TABLE customer (
  custno VARCHAR(5) PRIMARY KEY,
  custname VARCHAR(20) NOT NULL,
  address VARCHAR(50),
  payterm VARCHAR(3) CHECK (payterm IN ('COD','30D','45D')),
  record_status VARCHAR(10) DEFAULT 'ACTIVE',
  stamp VARCHAR(60)
);

-- TABLE 2: sales
CREATE TABLE sales (
  transNo VARCHAR(8) PRIMARY KEY,
  salesDate DATE,
  custNo VARCHAR(5) REFERENCES customer(custno),
  empNo VARCHAR(5)
);

-- TABLE 3: salesDetail
CREATE TABLE salesDetail (
  transNo VARCHAR(8) REFERENCES sales(transNo),
  prodCode VARCHAR(6),
  quantity DECIMAL(10,2) CHECK (quantity >= 0),
  PRIMARY KEY (transNo, prodCode)
);

-- TABLE 4: product
CREATE TABLE product (
  prodCode VARCHAR(6) PRIMARY KEY,
  description VARCHAR(30),
  unit VARCHAR(3) CHECK (unit IN ('pc','ea','mtr','pkg','ltr'))
);

-- TABLE 5: priceHist
CREATE TABLE priceHist (
  effDate DATE,
  prodCode VARCHAR(6) REFERENCES product(prodCode),
  unitPrice DECIMAL(10,2) CHECK (unitPrice > 0),
  PRIMARY KEY (effDate, prodCode)
);

-- Rights Tables
CREATE TABLE "user" (
  userId VARCHAR(50) PRIMARY KEY,
  username VARCHAR(30),
  user_type VARCHAR(15) CHECK (user_type IN ('SUPERADMIN','ADMIN','USER')),
  record_status VARCHAR(10) DEFAULT 'INACTIVE',
  stamp VARCHAR(60)
);

CREATE TABLE "Module" (
  moduleCode VARCHAR(20) PRIMARY KEY,
  moduleDesc VARCHAR(50),
  record_status VARCHAR(10),
  stamp VARCHAR(60)
);

CREATE TABLE user_module (
  userId VARCHAR(50) REFERENCES "user"(userId),
  moduleCode VARCHAR(20) REFERENCES "Module"(moduleCode),
  rights_value INTEGER DEFAULT 0,
  PRIMARY KEY (userId, moduleCode)
);

CREATE TABLE rights (
  rightCode VARCHAR(20) PRIMARY KEY,
  rightDesc VARCHAR(50),
  rights_value INTEGER,
  moduleCode VARCHAR(20) REFERENCES "Module"(moduleCode),
  record_status VARCHAR(10),
  stamp VARCHAR(60)
);

CREATE TABLE "UserModule_Rights" (
  userId VARCHAR(50) REFERENCES "user"(userId),
  rightCode VARCHAR(20) REFERENCES rights(rightCode),
  right_value INTEGER DEFAULT 0,
  PRIMARY KEY (userId, rightCode)
);