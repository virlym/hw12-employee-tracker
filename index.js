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
  populateEmployees();
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
      if(answers.choice==="Add info"){
        postItem();
      }
      else if(answers.choice==="View info"){
        bidItem()
      }
      else if(answers.choice==="Update info"){
        bidItem()
      }
      else if(answers.choice==="Delete info"){
        bidItem()
      }
      else if(answers.choice==="Quit"){
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