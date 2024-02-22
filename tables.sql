CREATE TABLE companies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  UNIQUE KEY unique_company_name (name)
);

CREATE TABLE branches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  manager VARCHAR(255) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  UNIQUE KEY unique_branch_name (company_id, name),
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role ENUM('general_manager', 'area_manager', 'store_manager') NOT NULL,
  branch_access VARCHAR(255), -- Store Manager memiliki satu cabang
  company_id INT, -- Company ID untuk mengaitkan pengguna dengan perusahaan
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id)
);
