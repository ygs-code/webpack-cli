const inquirer = require('inquirer'); // 与用户互动
const ora = require('ora');
const execSync = require('child_process').execSync;
const exec = require('child_process').exec;
const chalk = require('chalk');
const addReg = /git add/gi;
const pushReg = /git push/gi;
const committedReg = /committed/gi;
let spinner;

// const PromiseExec = async (cmd, callback = () => {}) => {
//     return new Promise((reslove, reject) => {
//         var workerProcess = exec(cmd, (err, stdout, stderr) => {
//             if (!err) {
//                 reslove(stdout);
//             } else {
//                 reject({
//                     err,
//                     stderr,
//                 });
//             }
//         });
//         workerProcess.on('exit', (code) => {
//             callback(code);
//         });
//     });
// };

// const gitPush = async () => {
//     let remote = await PromiseExec('git remote -v');
//     remote = remote.split('\n')[1];
//     let branch = await PromiseExec('git branch');
//     branch = branch.toString().match(/(?<=\*)\s*\w+/)[0];

//     let { isSubmit } = await inquirer.prompt([
//         {
//             name: 'isSubmit',
//             type: 'confirm',
//             message: chalk.rgb(
//                 17,
//                 168,
//                 203
//             )(`确定提交代码么? \n git源地址：${remote}\n git分支:${branch}`),
//         },
//     ]);
//     if (!isSubmit) {
//         console.log(chalk.rgb(13, 188, 121)('\n您取消了代码提交'));
//         return false;
//     }

//     let status = await PromiseExec('git status');
//     status = status.toString();
//     if (status.match(addReg)) {
//         spinner = ora('代码 git add . 中.....');
//         spinner.start();
//         const add = await PromiseExec('git add .').catch((error) => {
//             const { err, stderr } = error;

//             console.error(chalk.red(`\n 文件 git add . 失败：${stderr}`));
//             throw error;
//         });
//         spinner.stop();
//         console.log(chalk.rgb(13, 188, 121)('\n 文件 git add . 成功。'));
//     }

//     if (status.match(committedReg)) {
//         let { commitType } = await inquirer.prompt([
//             {
//                 type: 'rawlist',
//                 name: 'commitType',
//                 message: '提交commit类型',
//                 choices: [
//                     'feat: 新功能（feature）',
//                     'fix: bug修复',
//                     'test: 新增测试用例或是更新现有测试',
//                     'refactor: 重构代码(既没有新增功能，也没有修复 bug)',
//                     'style: 不影响程序逻辑的代码修改(修改空白字符，补全缺失的分号等)',
//                     'build: 修改项目构建系统(例如 glup，webpack，rollup 的配置等)的提交',
//                     'perf: 性能优化',
//                     'docs: 文档更新（documentation）',
//                     'ci: 修改项目继续集成流程(例如 Travis，Jenkins，GitLab CI，Circle等)的提交',
//                     'revert: 回滚某个更早之前的提交',
//                     'chore: 构建过程或辅助工具的变动',
//                 ],
//             },
//         ]);
//         let { commitMessage } = await inquirer.prompt([
//             {
//                 name: 'commitMessage',
//                 type: 'input',
//                 message: '请输入commit信息',
//             },
//         ]);
//         spinner = ora('代码lint校验中.....');
//         spinner.start();

//         const lintStaged = await PromiseExec(`npm run lint-staged`).catch(
//             (error) => {
//                 const { err, stderr } = error;
//                 console.error(chalk.red(`\n代码lint校验失败：${stderr}`));
//                 throw error;
//             }
//         );
//         console.log(chalk.rgb(13, 188, 121)('\n lint校验成功', lintStaged));
//         spinner = ora('代码git commit 中 .....');
//         const commit = await PromiseExec(
//             `git commit -m "${commitType.split(':')[0]}: ${commitMessage}"`
//         ).catch((error) => {
//             console.error(chalk.red(`\n 文件  git commit  失败：${error}`));
//             throw error;
//         });
//         spinner.stop();
//         console.log(chalk.rgb(13, 188, 121)('\n git commit成功：', commit));
//     }

//     if (status.match(pushReg) || status.match(committedReg)) {
//         spinner = ora('代码在push中.....');
//         spinner.start();
//         const push = await PromiseExec('git push').catch((error) => {
//             const { err, stderr } = error;
//             console.error(chalk.red(`\n 文件  git push  失败：${stderr}`));

//             throw error;
//         });
//         spinner.stop();
//         console.log(
//             chalk.rgb(
//                 13,
//                 188,
//                 121
//             )(
//                 `\n git push 代码成功。\n git源地址：${remote}\n git分支:${branch}`
//             )
//         );
//     }
// };

// gitPush();

class Git {
    constructor() {
        this.addReg = /git add/gi;
        this.pushReg = /git push/gi;
        this.committedReg = /committed/gi;
        this.spinner;
        this.init();
    }
    async init() {
        let remote = await this.PromiseExec('git remote -v');
        this.remote = remote.split('\n')[1];
        let branch = await this.PromiseExec('git branch');
        this.branch = branch.toString().match(/(?<=\*)\s*\w+/)[0];

        await this.submit();
        await this.add();
        await this.committed();
        await this.push();

    }
    PromiseExec(cmd, callback = () => {}) {
        return new Promise((reslove, reject) => {
            var workerProcess = exec(cmd, (err, stdout, stderr) => {
                if (!err) {
                    // console.log('stderr====',stderr)
                    reslove(stdout);
                } else {
                    reject({
                        err,
                        stderr,
                    });
                }
            });
            workerProcess.on('exit', (code) => {
                callback(code);
            });
        });
    }
    async submit() {
        let { status, remote, branch, addReg, pushReg, committedReg, spinner } =
            this;
        let { isSubmit } = await inquirer.prompt([
            {
                name: 'isSubmit',
                type: 'confirm',
                message: chalk.rgb(
                    17,
                    168,
                    203
                )(
                    `确定提交代码么? \n git源地址：${remote}\n git分支:${branch}`
                ),
            },
        ]);
        if (!isSubmit) {
            console.log(chalk.rgb(13, 188, 121)('\n您取消了代码提交'));
            return Promise.reject();
        }
    }

    async add() {
        let { remote, branch, addReg, pushReg, committedReg, spinner } = this;
        this.status = await this.PromiseExec('git status');
        this.status = this.status.toString();
        if (this.status.match(addReg)) {
            spinner = ora('代码 git add . 中.....');
            spinner.start();
            const add = await this.PromiseExec('git add .').catch((error) => {
                const { err, stderr } = error;

                console.error(chalk.red(`\n 文件 git add . 失败：${stderr}`));
                spinner.stop();
                throw error;
            });
            spinner.stop();
            console.log(chalk.rgb(13, 188, 121)('\n 文件 git add . 成功。'));
        }
    }
    async committed() {
        let { status, remote, branch, addReg, pushReg, committedReg, spinner } =
            this;
        if (status.match(committedReg)) {
            let { commitType } = await inquirer.prompt([
                {
                    type: 'rawlist',
                    name: 'commitType',
                    message: '提交commit类型',
                    choices: [
                        'feat: 新功能（feature）',
                        'fix: bug修复',
                        'test: 新增测试用例或是更新现有测试',
                        'refactor: 重构代码(既没有新增功能，也没有修复 bug)',
                        'style: 不影响程序逻辑的代码修改(修改空白字符，补全缺失的分号等)',
                        'build: 修改项目构建系统(例如 glup，webpack，rollup 的配置等)的提交',
                        'perf: 性能优化',
                        'docs: 文档更新（documentation）',
                        'ci: 修改项目继续集成流程(例如 Travis，Jenkins，GitLab CI，Circle等)的提交',
                        'revert: 回滚某个更早之前的提交',
                        'chore: 构建过程或辅助工具的变动',
                    ],
                },
            ]);
            let { commitMessage } = await inquirer.prompt([
                {
                    name: 'commitMessage',
                    type: 'input',
                    message: '请输入commit信息',
                },
            ]);
            spinner = ora('代码lint校验中.....');
            spinner.start();

            const lintStaged = await this.PromiseExec(`npm run lint-staged`).catch(
                (error) => {
                    const { err, stderr } = error;
                    console.error(chalk.red(`\n代码lint校验失败：${stderr}`));
                    throw error;
                }
            );
            spinner.stop();
            console.log(chalk.rgb(13, 188, 121)('\n lint校验成功', lintStaged));
            spinner = ora('代码git commit 中 .....');
            spinner.start();
            const commit = await this.PromiseExec(
                `git commit -m "${commitType.split(':')[0]}: ${commitMessage}"`
            ).catch((error) => {
                console.error(chalk.red(`\n 文件  git commit  失败：${error}`));
                throw error;
            });
            spinner.stop();
            console.log(chalk.rgb(13, 188, 121)('\n git commit成功：', commit));
        }
    }
    async push() {
        let { status, remote, branch, addReg, pushReg, committedReg, spinner } =
            this;
        if (status.match(pushReg) || status.match(committedReg)) {
            spinner = ora('代码在push中.....');
            spinner.start();
            const push = await this.PromiseExec('git push').catch((error) => {
                const { err, stderr } = error;
                console.error(chalk.red(`\n 文件  git push  失败：${stderr}`));

                throw error;
            });
            spinner.stop();
            console.log(
                chalk.rgb(
                    13,
                    188,
                    121
                )(
                    `\n git push 代码成功。\n git源地址：${remote}\n git分支:${branch}`
                )
            );
        }
    }
}


new Git()