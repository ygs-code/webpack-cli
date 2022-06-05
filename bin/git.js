const inquirer = require('inquirer'); // 与用户互动
const ora = require('ora');
const execSync = require('child_process').execSync;
const exec = require('child_process').exec;
const chalk = require('chalk');
const addReg = /git add/gi;
const pushReg = /git push/gi;
const committedReg = /committed/gi;
let spinner;

const PromiseExec = async (cmd, callback = () => {}) => {
    return new Promise((reslove, reject) => {
        var workerProcess = exec(cmd, (err, stdout, stderr) => {
            if (!err) {
                reslove(stdout);
            } else {
                reject(err);
            }
        });
        workerProcess.on('exit', (code) => {
            callback(code);
        });
    });
};

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
    if (status.match(addReg)) {
        spinner = ora('代码 git add . 中.....');
        spinner.start();
        const add = await PromiseExec('git add .').catch((error) => {
            console.error(chalk.red(`\n 文件 git add . 失败：${error}`));
            throw error;
        });
        spinner.stop();
        console.log(chalk.rgb(13, 188, 121)('\n 文件 git add . 成功。'));
    }

    if (status.match(committedReg)) {
        let { commitType } = await inquirer.prompt([
            {
                type: 'rawlist',
                name: 'commitType',
                message: '提交commit类型',
                choices: [
                    'feat:新功能（feature）',
                    'fix:bug修复',
                    'test:新增测试用例或是更新现有测试',
                    'refactor:重构代码(既没有新增功能，也没有修复 bug)',
                    'style:不影响程序逻辑的代码修改(修改空白字符，补全缺失的分号等)',
                    'build:修改项目构建系统(例如 glup，webpack，rollup 的配置等)的提交',
                    'perf:性能优化',
                    'docs:文档更新（documentation）',
                    'ci:修改项目继续集成流程(例如 Travis，Jenkins，GitLab CI，Circle等)的提交',
                    'revert:回滚某个更早之前的提交',
                    'chore:构建过程或辅助工具的变动',
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
        spinner = ora('代码在检测lint中.....');
        spinner.start();
        const commit = await PromiseExec(
            `git commit -m "${commitType.split(':')[0]}: ${commitMessage}"`
        ).catch((error) => {
            console.error(
                chalk.red(
                    `\n 文件 elint 校验失败：${error}`
                )
            );
            throw error;
        });
        spinner.stop();
        console.log(
            chalk.rgb(13, 188, 121)('\n 检测lint成功，git commit成功：', commit)
        );
    }

    if (status.match(pushReg)) {
        spinner = ora('代码在push中.....');
        spinner.start();
        const push = await PromiseExec('git push').catch((error) => {
            console.error(chalk.red(`\n 文件  git push  失败：${error}`));

            throw error;
        });
        spinner.stop();
        console.log(chalk.rgb(13, 188, 121)('\n git push 成功：', push));
    }
};

gitPush();
