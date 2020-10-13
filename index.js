// includes
var mysql = require("mysql");
const inquirer = require("inquirer");
const questionBuilder = require("./assets/questionBuilder.js");

// define mysql connection 
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password + database
  password: "password",
  database: "company12"
});

// establish mysql connection and start the prompts
connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  init();
});

// pull up and show the employees view table then go into the populate employee function
function init(){
  connection.query("SELECT * FROM display_employees", function(err, res) {
    if (err) {
        throw err;
    }
    else{
        console.table(res);
        populateEmployees();
    }
    return;
  });
}

// grab the information from the employee table and set it into an array before going into the populate role function
function populateEmployees(){
  connection.query("SELECT * FROM employees", function(err, res) {
    if (err) {
        throw err;
    }
    else{
        const employeesArray = res;
        populateRoles(employeesArray);
    }
    return;
  });
}

// grab the information from the role table and set it into an array before going into the populate departments function
function populateRoles(employeesArray){
  connection.query("SELECT * FROM roles", function(err, res) {
    if (err) {
        throw err;
    }
    else{
        const rolesArray = res;
        populateDepartments(employeesArray, rolesArray);
    }
    return;
  });
}

// grab the information from the departments table and set it into an array before going into the question function
function populateDepartments(employeesArray, rolesArray){
  connection.query("SELECT * FROM departments", function(err, res) {
    if (err) {
        throw err;
    }
    else{
        const departmentsArray = res;
        promptUser(employeesArray, rolesArray, departmentsArray);
    }
    return;
  });
}

// ask the user what they want to do and call the corresponding function
function promptUser(employeesArray, rolesArray, departmentsArray){
  // create an object array for the names of the roles and their ids
  const roleNames = [];
  for(let i = 0; i < rolesArray.length; i++){
    roleNames.push({
      name : rolesArray[i].title,
      value : rolesArray[i].id
    });
  }

  // create an object array for the names of the departments and their ids
  const departmentNames = [];
  for(let i = 0; i < departmentsArray.length; i++){
    departmentNames.push({
      name : departmentsArray[i].department_name,
      value : departmentsArray[i].id
    });
  }

  // create an object array for the names of the employees and their ids
  const employeeNames = [];
  for(let i = 0; i < employeesArray.length; i++){
    employeeNames.push({
      name : `${employeesArray[i].first_name} ${employeesArray[i].last_name}`,
      value : employeesArray[i].id
    });
  }

  // use the questionBuilder file to generate the questions for the user
  inquirer.prompt(questionBuilder.questionBuilder(roleNames, departmentNames, employeeNames)
  ).then(function(answers){ 
    // if the user wanted to add information
    if(answers.choice === "Add info"){
      if(answers.addItem === "Employee info"){
        addEmployee(answers.addEmpFirst, answers.addEmpLast, answers.addEmpRole, answers.addEmpManager);
      }
      else if(answers.addItem === "Role info"){
        addRole(answers.addRoleTitle, answers.addRoleSalary, answers.addDepartmentId);
      }
      else{
        addDepartment(answers.addDepartment);
      }
    }
    // if the user wanted to view the information
    else if(answers.choice === "View info"){
      if(answers.viewItem === "Employee info"){
        viewEmployees();
      }
      else if(answers.viewItem === "Role info"){
        viewRoles();
      }
      else if(answers.viewItem === "Department info"){
        viewDepartments();
      }
      else if(answers.viewItem === "Employees by manager"){
        viewEmployeesByManager(answers.viewManager);
      }
      else{
        viewBudget(answers.viewBudget);
      }
    }
    // if the user wanted to update the information
    else if(answers.choice === "Update info"){
      if(answers.updateItem === "Employee role"){
        updateEmployeeRole(answers.updateEmployee, answers.updateRoles);
      }
      else{
        updateEmployeeManager(answers.updateEmployee, answers.updateManagers);
      }
    }
    // if the user wanted to delete the information
    else if(answers.choice === "Delete info"){
      if(answers.deleteItem === "Employee info"){
        deleteEmployee(answers.deleteEmp);
      }
      else if(answers.deleteItem === "Role info"){
        deleteRole(answers.deleteRole);
      }
      else{
        deleteDepartment(answers.deleteDepartment);
      }
    }
    // if the user wanted to stop using the application
    else if(answers.choice === "Quit"){
      quitConnection();
    }
  });
  return;
}

// takes in employee variables and adds the employee to the table
function addEmployee(firstName, lastName, role, manager){
  if(manager === "None"){
    connection.query(`INSERT INTO employees (first_name, last_name, role_id) VALUES ("${firstName}", "${lastName}", ${role});`, function(err, res) {
      if (err) {
          throw err;
      }
      else{
          console.log(`${res.affectedRows} record(s) inserted`);
          populateEmployees();
      }
      return;
    });
  }
  else{
    connection.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("${firstName}", "${lastName}", ${role}, ${manager});`, function(err, res) {
      if (err) {
          throw err;
      }
      else{
          console.log(`${res.affectedRows} record(s) inserted`);
          populateEmployees();
      }
      return;
    });
  }
}

// takes in role variables and adds the role to the table
function addRole(title, salary, department){
  connection.query(`INSERT INTO roles (title, salary, department_id) VALUES ("${title}", ${salary}, ${department});`, function(err, res) {
    if (err) {
        throw err;
    }
    else{
        console.log(`${res.affectedRows} record(s) inserted`);
        populateEmployees();
    }
    return;
  });
}

// takes in department name and adds the department to the table
function addDepartment(name){
  connection.query(`INSERT INTO departments (department_name) VALUES ("${name}");`, function(err, res) {
    if (err) {
        throw err;
    }
    else{
        console.log(`${res.affectedRows} record(s) inserted`);
        populateEmployees();
    }
    return;
  });
}

// calls the init function that displays the employee view
function viewEmployees(){
  init();
  return;
}

// calls the roles table and displays it
function viewRoles(){
  connection.query(`SELECT * FROM roles;`, function(err, res) {
    if (err) {
        throw err;
    }
    else{
        console.table(res);
        populateEmployees();
    }
    return;
  });
}

// calls the departments table and displays it
function viewDepartments(){
  connection.query(`SELECT * FROM departments;`, function(err, res) {
    if (err) {
        throw err;
    }
    else{
        console.table(res);
        populateEmployees();
    }
    return;
  });
}

// calls the employee view, filtered by the selected manager and displays it
function viewEmployeesByManager(manager){
  connection.query(`SELECT e.id, CONCAT(e.first_name, " ", e.last_name) as "Name", r.title as "Job Title", d.department_name as "Department", r.salary as "Salary", CONCAT(e2.first_name," ",  e2.last_name) AS "Manager" FROM employees AS e LEFT JOIN roles AS r ON e.role_id = r.id LEFT JOIN departments AS d ON r.department_id = d.id LEFT JOIN employees e2 ON e.manager_id = e2.id WHERE e.manager_id = ${manager} ORDER BY d.department_name, e.last_name, e.first_name;`, function(err, res) {
    if (err) {
        throw err;
    }
    else{
        console.table(res);
        populateEmployees();
    }
    return;
  });
}

// shows the specified department and sum of the salaries of the employees in that department
function viewBudget(department){
  connection.query(`SELECT d.department_name AS "Department", SUM(r.salary) AS "Salary" FROM roles AS r LEFT JOIN departments AS d ON r.department_id = d.id RIGHT JOIN employees AS e ON e.role_id = r.id WHERE d.id = ${department};`, function(err, res) {
    if (err) {
        throw err;
    }
    else{
        console.table(res);
        populateEmployees();
    }
    return;
  });
}

// updates an employee's role to the specified one
function updateEmployeeRole(employee, newRole){
  connection.query(`UPDATE employees SET role_id = ${newRole} WHERE id = ${employee};`, function(err, res) {
    if (err) {
        throw err;
    }
    else{
      console.log(`${res.affectedRows} record(s) updated`);
      populateEmployees();
    }
  });
  return;
}

// updates the employee's manager to the specified one
function updateEmployeeManager(employee, manager){
  // the employee shouldn't be their own manager
  if(employee === manager){
    console.log(`Please don't set an individual's manager as themselves`);
    populateEmployees();
    return;
  }
  // if you wanted to remove someone's manager
  else if(manager === "None"){
    connection.query(`UPDATE employees SET manager_id = null WHERE id = ${employee};`, function(err, res) {
      if (err) {
          throw err;
      }
      else{
        console.log(`${res.affectedRows} record(s) updated`);
        populateEmployees();
      }
    });
    return;
  }
  else{
    connection.query(`UPDATE employees SET manager_id = ${manager} WHERE id = ${employee};`, function(err, res) {
      if (err) {
          throw err;
      }
      else{
        console.log(`${res.affectedRows} record(s) updated`);
        populateEmployees();
      }
    });
    return;
  }
}

// deletes an employee row based on employee id
function deleteEmployee(employee){
  connection.query(`DELETE FROM employees WHERE id = ${employee};`, function(err, res) {
    if (err) {
        throw err;
    }
    else{
      console.log(`${res.affectedRows} record(s) deleted`);
      populateEmployees();
    }
  });
  return;
}

// deletes a role row based on role id
function deleteRole(role){
  connection.query(`DELETE FROM roles WHERE id = ${role};`, function(err, res) {
    if (err) {
        throw err;
    }
    else{
      console.log(`${res.affectedRows} record(s) deleted`);
      populateEmployees();
    }
  });
  return;
}

// deletes a department row based on department id
function deleteDepartment(department){
  connection.query(`DELETE FROM departments WHERE id = ${department};`, function(err, res) {
    if (err) {
        throw err;
    }
    else{
      console.log(`${res.affectedRows} record(s) deleted`);
      populateEmployees();
    }
  });
  return;
}

// close the mysql connection
function quitConnection(){
  connection.end();
}