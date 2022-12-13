#!/usr/bin/env node
import '@babel/polyfill'
import inquirer from 'inquirer'
import ora from 'ora'
import chalk from 'chalk'
import path, { resolve } from 'path'
import fs from 'fs'
import archiver from 'archiver'
import process from 'process'
import os from 'os'
import { execute } from './cmd'
import config from '../.site/modules.config'
const argv = process.argv

class Git {
  constructor() {
    let mapInfo = {
      test: {
        branch: 'test',
        info: '测试环境',
      },
      prod: {
        branch: 'master',
        info: '生产环境',
      },
    }
    this.environment = argv.slice(-1)[0]
    this.spinner = {}
    this.info = mapInfo[this.environment]
    this.init()
  }
  async confirmBuild() {
    await new Promise(async (resolve, reject) => {
      let { isSubmit } = await inquirer.prompt([
        {
          name: 'isSubmit',
          type: 'confirm',
          message: chalk.rgb(17, 168, 203)(`确定编译${this.info.info}环境代码吗? \n 编译分支为${this.info.branch}分支`),
        },
      ])
      if (!isSubmit) {
        console.log(chalk.rgb(229, 228, 77)('\n您取消了编译代码'))
        reject()
        return
      }
      resolve()
    })
  }

  async buildCode() {
    console.log(chalk.rgb(17, 168, 203)('\n开始编译代码'))
    this.spinner = ora(chalk.rgb(17, 168, 203)('编译代码中请稍后.....\n'))
    this.spinner.start()
    process.chdir(path.join(__dirname, '../'))

    await new Promise((resolve, reject) => {


      const npm = os.type() === 'Windows_NT' ? 'npm.cmd' : 'npm'

      execute(`${npm}  run build`, {
        callback: () => {
          this.spinner.stop()
          console.log(chalk.rgb(13, 188, 121)('编译完成'))
          resolve()
        },
      })
    })
  }
  // 检查分支代码
  async checkStatus() {
    const reg = /(git add)|(git push)|(committed)|(git checkout)/gi
    let primoseArr = []

    console.log(chalk.rgb(17, 168, 203)('\n检查git是否有未提交代码'))

    for (let key in config) {
      if (config.hasOwnProperty(key)) {
        const { name, dir, repo } = config[key]
        const p = await new Promise((resolve, reject) => {
          console.log(
            chalk.rgb(
              17,
              168,
              203
            )(`
          \n${name}\n模块路径 : ${dir}
          `)
          )
          process.chdir(path.join(__dirname, '../' + dir))
          execute('git status', {
            stdio: null,
            getStdout: (stdout) => {
              if (stdout.match(reg)) {
                console.log(chalk.rgb(251, 15, 33)('编译失败，该模块有未提交代码，请提交该代码'))
                console.log(chalk.rgb(251, 15, 33)(stdout))
                reject()
              } else {
                console.log(stdout)
              }
            },
            callback: () => {
              resolve()
            
            },
          })
        })

        primoseArr.push(p)
      }
    }
    await Promise.all(primoseArr).then(() => {
      console.log(chalk.rgb(13, 188, 121)('全部模块分支代码状态没有未提交代码。'))
    })
  }

  // 切换分支
  async checkoutBranch() {
    let primoseArr = []
    const reg = /(?<=\*\s)(.+?)(?=\n)/g // [] 中括号
    let branch = ''
    console.log(chalk.rgb(17, 168, 203)(`所有模块切换到${this.info.branch}分支`))

    for (let key in config) {
      if (config.hasOwnProperty(key)) {
        const { name, dir, repo } = config[key]

        const p = await new Promise((resolve, reject) => {
          console.log(
            chalk.rgb(
              17,
              168,
              203
            )(`
            \n${name}\n模块路径 : ${dir}
            `)
          )
          process.chdir(path.join(__dirname, '../' + dir))
          execute('git branch', {
            stdio: null,
            getStdout: (stdout) => {
              branch = stdout.match(reg)[0]
              console.log(chalk.rgb(17, 168, 203)(`当前分支为:${branch} ————> 切换到${this.info.branch}分支`))
              execute(`git checkout ${this.info.branch}`, {
                stdio: null,
                getStdout: (stdout) => {
                  console.log(stdout)
                },
                callback: () => {
                  console.log(chalk.rgb(13, 188, 121)('分支切换成功。'))
                  resolve()
                },
              })
            },
            callback: () => {
         
            },
          })
        })

        primoseArr.push(p)
      }
    }

    Promise.all(primoseArr).then(() => {
      console.log(chalk.rgb(13, 188, 121)('全部模块分支切换成功。'))
    })
  }

  // 更新代码
  async pullCode() {
    let primoseArr = []
    const reg = /(?<=\*\s)(.+?)(?=\n)/g // [] 中括号
    console.log(chalk.rgb(17, 168, 203)(`更新所有模块${this.info.branch}分支代码`))

    for (let key in config) {
      if (config.hasOwnProperty(key)) {
        const { name, dir, repo } = config[key]

        const p = await new Promise((resolve, reject) => {
          console.log(
            chalk.rgb(
              17,
              168,
              203
            )(`
              \n${name}\n模块路径 : ${dir}
              `)
          )
          process.chdir(path.join(__dirname, '../' + dir))
          execute(`git pull origin ${this.info.branch}`, {
            callback: () => {
              console.log(chalk.rgb(13, 188, 121)('代码更新成功'))
              resolve()
            },
          })
        })
        primoseArr.push(p)
      }
    }

    Promise.all(primoseArr).then(() => {
      console.log(chalk.rgb(13, 188, 121)('全部模块代码更新成功。'))
    })
  }

  async codeCompression() {
    console.log(chalk.rgb(17, 168, 203)(`开始将dit目录文件，打包成${this.zipName}.zip包文件`))
    this.spinner = ora(chalk.rgb(17, 168, 203)(`在打包成${this.zipName}.zip包中请稍后.....\n`))
    this.spinner.start()

    const filePath = path.join(__dirname, '../zip')
    // 第一步，创建zip文件夹
    await new Promise((resolve, reject) => {
      fs.exists(filePath, (exists) => {
        if (!exists) {
          fs.mkdir(filePath, (err) => {
            resolve()
            if (err) {
              console.log(err)
            }
          })
        } else {
          resolve()
        }
      })
    })

    // 第二步，创建可写流来写入数据
    const output = fs.createWriteStream(path.join(__dirname, `../zip/${this.zipName}.zip`)) // 将压缩包保存到当前项目的目录下，并且压缩包名为this.zipName.zip
    const archive = archiver('zip', { zlib: { level: 9 } }) // 设置压缩等级

    // 第三步，建立管道连接
    archive.pipe(output)

    // 第四步，压缩目录到压缩包中
    archive.directory(path.join(__dirname, '../dist'), false)

    // 第五步，完成压缩
    archive.finalize()
    this.spinner.stop()

    console.log(chalk.rgb(13, 188, 121)(`${this.zipName}.zip包,打包成功 \n在${filePath}目录中`))
  }
  async getZipName() {
    let { commitMessage } = await inquirer.prompt([
      {
        name: 'commitMessage',
        type: 'input',
        message: '请输入打包后的zip包名',
      },
    ])

    this.zipName = commitMessage
  }
  async init() {
    this.confirmBuild()
      .then(async () => {
        await this.getZipName()
        await this.checkStatus()
        await this.checkoutBranch()
        await this.pullCode()
        await this.buildCode()
        await this.codeCompression()
      })
      .catch(() => {})
  }
}

new Git()

export default Git
