DROP DATABASE IF EXISTS company12;

CREATE DATABASE company12;

USE company12;

-- 
CREATE TABLE departments (
  id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE roles (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(45) NOT NULL,
  salary DECIMAL(10, 2) NOT NULL,
  department_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
);

CREATE TABLE employees (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE SET NULL
);


INSERT INTO departments (department_name) VALUES 
("Sales"),
("Engineering"),
("Finance"),
("Legal");

INSERT INTO roles (title, salary, department_id) VALUES
("Salesperson", 47000, 1),
("Sales Lead", 67000, 1),
("Software Engineer", 86000, 2),
("Lead Engineer", 118000, 2),
("Accountant", 51000, 3),
("Account Manager", 55000, 3),
("Lawyer", 85000, 4),
("Legal Team Lead", 112000, 4);

INSERT INTO employees (first_name, last_name, role_id) VALUES
("Chris", "Morrison", 2),
("Devin", "Gillogly", 4),
("Kirstin", "Bardroff", 6),
("Jeff", "Grunewald", 8);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
("Kiel", "Duggar", 1, 1),
("Chris", "Austin", 3, 2),
("Maria", "Austin", 5, 3),
("Peter", "Lam", 7, 4);

CREATE VIEW display_employees AS (

  SELECT e.id, CONCAT(e.first_name, " ", e.last_name) as "Name", r.title as "Job Title", d.department_name as "Department", r.salary as "Salary", CONCAT(e2.first_name," ",  e2.last_name) AS "Manager" 
  FROM
    employees AS e
    LEFT JOIN
    roles AS r
    ON
    e.role_id = r.id
    LEFT JOIN
    departments AS d
    ON
    r.department_id = d.id
    LEFT JOIN
    employees e2
    ON
    e.manager_id = e2.id
    ORDER BY
    d.department_name, e.last_name, e.first_name
);
-- log into mysql command :
-- mysql -u root -p

-- run sql seed file
-- mysql> source seed.sql

-- quit mysql to run js file
-- mysql> quit

-- run the js file
-- C:{path}> node index.js