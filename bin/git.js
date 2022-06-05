const inquirer = require('inquirer'); // 与用户互动
const execSync = require('child_process').execSync;
const addReg = /git add/gi;
const pushReg = /git push/gi;
const committedReg = /committed/gi;

// console.log('git push'.match(pushReg));
// inquirer
//     .prompt([
//         { commit: 'git', type: 'input', message: '请输入commit信息' },
//     ])
//     .then((answer) => {
//         console.log(answer);
//     });

// inquirer
//     .prompt([
//         {
//             name: 'wants_pizza',
//             type: 'confirm',
//             message: 'Do you want a free pizza?',
//         },
//     ])
//     .then((answer) => {
//         console.log(answer.wants_pizza);
//     });

const gitPush = async () => {
    let { isSubmit } = await inquirer.prompt([
        {
            name: 'isSubmit',
            type: 'confirm',
            message: '确定提交代码么？',
        },
    ]);
    if (!isSubmit) {
        return false;
    }
    const status = execSync('git status').toString();
    // console.log('status=', status);
    // console.log('status.match(addReg)=', status.match(addReg));

    if (status.match(addReg)) {
        const add = execSync('git add .');
        console.log('add=', add);
    }

    if (status.match(committedReg)) {
        let { commitMessage } = await inquirer.prompt([
            {
                name: 'commitMessage',
                type: 'input',
                message: '请输入commit信息',
            },
        ]);

       
      const   commit =   execSync(`git commit -m "${commitMessage}"`);
        console.log('commit=',commit)
    }

    if (status.match(pushReg)) {
        const push = execSync('git push');
        console.log('push=', push);
    }

    // const add = execSync('git add .');
    // console.log('add=', add.toString());
    // let { commitMessage } = await inquirer.prompt([
    //     { name: 'commitMessage', type: 'input', message: '请输入commit信息' },
    // ]);

    // .then((answer) => {
    //     console.log(answer);
    // });
};

gitPush();
