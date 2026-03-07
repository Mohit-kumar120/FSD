const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let employee = [];
function menu(){
    console.log("1.Add\n2.List\n3.Exit");
    rl.question("choose: ", function(choice){
        if(choice == 1) addemployee();
        else if(choice == 2) listemployee();
        else rl.close();
    });
}

function addemployee(){
    rl.question("Name: ",function(name){
        rl.question("position: ",function(position){
            let emp = {
                name : name,
                position : position
            }
            employee.push(emp);
            menu();
        });
    });
}

function listemployee(){
    console.log(employee);
    menu();
}
menu();