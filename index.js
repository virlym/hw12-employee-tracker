var mysql = require("mysql");
const inquirer = require("inquirer");
const questionBuilder = require("./assets/questionBuilder.js");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "company12"
});


connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  init();
  //connection.end();
});

// function printBidders(){
//     console.log("getting all bidders");
//     connection.query("SELECT * FROM bidder", function(err, res) {
//         if (err) {
//             throw err;
//         }
//         else{
//             console.table(res);
//             connection.end();
//         }
//         return;
//       });
    
// }

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

function populateEmployees(){
  connection.query("SELECT * FROM employees", function(err, res) {
    if (err) {
        throw err;
    }
    else{
        const employeesArray = res;
        //console.table(bidderArray);
        populateRoles(employeesArray);
    }
    return;
  });
}

function populateRoles(employeesArray){
  connection.query("SELECT * FROM roles", function(err, res) {
    if (err) {
        throw err;
    }
    else{
        const rolesArray = res;
        //console.table(auctionArray);
        populateDepartments(employeesArray, rolesArray);
    }
    return;
  });
}

function populateDepartments(employeesArray, rolesArray){
  connection.query("SELECT * FROM departments", function(err, res) {
    if (err) {
        throw err;
    }
    else{
        const departmentsArray = res;
        //console.table(auctionArray);
        promptUser(employeesArray, rolesArray, departmentsArray);
    }
    return;
  });
}

function quitConnection(){
  connection.end();
}

function promptUser(employeesArray, rolesArray, departmentsArray){
  const roleNames = [];
  for(let i = 0; i < rolesArray.length; i++){
    roleNames.push({
      name : rolesArray[i].title,
      value : rolesArray[i].id
    });
  }

  const departmentNames = [];
  for(let i = 0; i < departmentsArray.length; i++){
    departmentNames.push({
      name : departmentsArray[i].department_name,
      value : departmentsArray[i].id
    });
  }

  const employeeNames = [];
  for(let i = 0; i < employeesArray.length; i++){
    employeeNames.push({
      name : `${employeesArray[i].first_name} ${employeesArray[i].last_name}`,
      value : employeesArray[i].id
    });
  }

  inquirer.prompt(questionBuilder.questionBuilder(roleNames, departmentNames, employeeNames)
  ).then(function(answers){ 
      // ["Employee info", "Role info", "Department info"]
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
      // ["Employee info", "Role info", "Department info", "Employees by manager", "Budget info"]
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
      // [`Employee role`, `Employee manager`]
      else if(answers.choice === "Update info"){
        if(answers.updateItem === "Employee role"){
          updateEmployeeRole(answers.updateEmployee, answers.updateRoles);
        }
        else{
          updateEmployeeManager(answers.updateEmployee, answers.updateManagers);
        }
      }
      // ["Employee info", "Role info", "Department info"]
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
      else if(answers.choice === "Quit"){
        quitConnection();
      }
  })
}

function bidItem(auction_id, auctionArray, user_bid, bidderArray){
  if((parseInt(auctionArray[auction_id - 1].highest_bid) < user_bid) || (auctionArray[auction_id - 1].highest_bid === null )){
    connection.query(`UPDATE auction SET ? WHERE ?`, [{highest_bid : user_bid}, {id : auction_id}], function(err, res) {
      if (err) {
          throw err;
      }
      else{
        console.table(res);
        promptUser(bidderArray, auctionArray);
      }
    });
  }
  else{
    console.log("your bid is too low");
    promptUser(bidderArray, auctionArray);
  }
  return;
}

function postItem(category, name, bidderArray, auctionArray){
  console.log(category);
  console.log(name);
  if(name !== ""){
    connection.query(`INSERT INTO auction SET ?`, [{auction_category : category, auction_name : name}], function(err, res) {
      if (err) {
          throw err;
      }
      else{
        console.table(res);
        promptUser(bidderArray, auctionArray);
      }
    });
  }
  else{
    console.log("your bid is too low");
    promptUser(bidderArray, auctionArray);
  }
  return;
}