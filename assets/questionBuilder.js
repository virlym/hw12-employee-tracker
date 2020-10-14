// a function that defines the questions for inquirer
// takes in the role, department, and employee name object arrays, returns a string of objects that inquirer can use for prompt
function questionBuilder(roleNames, departmentNames, employeeNames) {

    questionArray = [
        {
            name:"choice",
            message:"What would like to do?",
            type:"list",
            choices:["Add info", "View info", "Update info", "Delete info", "Quit"]
        },
        {
            name:'addItem',
            message:"What info would you like to add?",
            type:"list",
            choices:["Employee info", "Role info", "Department info"],
            when:function(answers){
                if(answers.choice==="Add info"){
                    return true
                } else {
                    return false
                }
            }
        },
        {
            name:'addEmpFirst',
            message:"What is the employee's first name?",
            type:"prompt",
            when:function(answers){
                if((answers.choice==="Add info") && (answers.addItem === "Employee info")){
                    return true
                } else {
                    return false
                }
            }
        },
        {
            name:'addEmpLast',
            message:"What is the employee's last name?",
            type:"prompt",
            when:function(answers){
                if((answers.choice==="Add info") && (answers.addItem === "Employee info")){
                    return true
                } else {
                    return false
                }
            }
        },
        {
            name:'addEmpRole',
            message:"What is the employee's role?",
            type:"list",
            choices:[...roleNames],
            when:function(answers){
                if((answers.choice==="Add info") && (answers.addItem === "Employee info")){
                    return true
                } else {
                    return false
                }
            }
        },
        {
            name:'addEmpManager',
            message:"Who is the employee's manager?",
            type:"list",
            choices:[...employeeNames, "None"],
            when:function(answers){
                if((answers.choice==="Add info") && (answers.addItem === "Employee info")){
                    return true
                } else {
                    return false
                }
            }
        },
        {
            name:'addRoleTitle',
            message:"What role would you like to add?",
            type:"prompt",
            when:function(answers){
                if((answers.choice==="Add info") && (answers.addItem === "Role info")){
                    return true
                } else {
                    return false
                }
            }
        },
        {
            name:'addRoleSalary',
            message:"What is the role's salary?",
            type:"number",
            when:function(answers){
                if((answers.choice==="Add info") && (answers.addItem === "Role info")){
                    return true
                } else {
                    return false
                }
            }
        },
        {
            name:'addDepartmentId',
            message:"Which department does the role belong to?",
            type:"list",
            choices:[...departmentNames],
            when:function(answers){
                if((answers.choice==="Add info") && (answers.addItem === "Role info")){
                    return true
                } else {
                    return false
                }
            }
        },
        {
            name:'addDepartment',
            message:"What department would you like to add?",
            type:"prompt",
            when:function(answers){
                if((answers.choice==="Add info") && (answers.addItem === "Department info")){
                    return true
                } else {
                    return false
                }
            }
        },
        {
            name:'viewItem',
            message:"What info would you like to view?",
            type:"list",
            choices:["Employee info", "Role info", "Department info", "Employees by manager", "Budget info"],
            when:function(answers){
                if(answers.choice==="View info"){
                    return true
                } else {
                    return false
                }
            }
        },
        {
            name:'viewManager',
            message:"Which team would you like to view?",
            type:"list",
            choices:[...employeeNames],
            when:function(answers){
                if((answers.choice === "View info") && (answers.viewItem === "Employees by manager")){
                    return true
                } else {
                    return false
                }
            }
        },
        {
            name:'viewBudget',
            message:"Which department's budget would you like to view?",
            type:"list",
            choices:[...departmentNames],
            when:function(answers){
                if((answers.choice==="View info") && (answers.viewItem === "Budget info")){
                    return true
                } else {
                    return false
                }
            }
        },
        {
            name:'updateEmployee',
            message:"Which employee would you like to update?",
            type:"list",
            choices:[...employeeNames],
            when:function(answers){
                if(answers.choice==="Update info"){
                    return true
                } else {
                    return false
                }
            }
        },
        {
            name:'updateItem',
            message:"What info would you like to update?",
            type:"list",
            choices:[`Employee role`, `Employee manager`],
            when:function(answers){
                if(answers.choice==="Update info"){
                    return true
                } else {
                    return false
                }
            }
        },
        {
            name:'updateRoles',
            message:`Which role should they have?`,
            type:"list",
            choices:[...roleNames],
            when:function(answers){
                if((answers.choice === "Update info") && (answers.updateItem === `Employee role`)){
                    return true
                } else {
                    return false
                }
            }
        },
        { 
            name:'updateManagers',
            message:`Which manager should they have?`,
            type:"list",
            choices:[...employeeNames, "None"],
            when:function(answers){
                if((answers.choice==="Update info") && (answers.updateItem === `Employee manager`)){
                    return true
                } else {
                    return false
                }
            }
        },
        {
            name:'deleteItem',
            message:"What info would you like to delete?",
            type:"list",
            choices:["Employee info", "Role info", "Department info"],
            when:function(answers){
                if(answers.choice==="Delete info"){
                    return true
                } else {
                    return false
                }
            }
        },
        {
            name:'deleteEmp',
            message:"Which employee would you like to delete?",
            type:"list",
            choices:[...employeeNames],
            when:function(answers){
                if((answers.choice === "Delete info") && (answers.deleteItem === "Employee info")){
                    return true
                } else {
                    return false
                }
            }
        },
        {
            name:'deleteRole',
            message:"Which role would you like to delete?",
            type:"list",
            choices:[...roleNames],
            when:function(answers){
                if((answers.choice === "Delete info") && (answers.deleteItem === "Role info")){
                    return true
                } else {
                    return false
                }
            }
        },
        {
            name:'deleteDepartment',
            message:"Which department would you like to delete?",
            type:"list",
            choices:[...departmentNames],
            when:function(answers){
                if((answers.choice === "Delete info") && (answers.deleteItem === "Department info")){
                    return true
                } else {
                    return false
                }
            }
        }
    ];
        return questionArray;
}

module.exports = {
    questionBuilder : questionBuilder
}