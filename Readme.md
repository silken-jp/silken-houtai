## 项目说明

silken物流系统后台部分，使用learn管理多个子后台。

### packages

- core：个项目公用代码
  - constant：公用常量（localStorage的key值等）
  - components：公用组件
  - locales：多语言设定
  - useHooks: 公用react hooks
  - utils：公用方法（时间转换等）

>> TODO：类型导出问题

### 命令说明

```shell
# 使用本地api启动项目
yarn start <项目名，例：impt-cn-jp> 
```

```shell
# 使用线上api启动项目
yarn start:prod <项目名，例：impt-cn-jp> 
```

```shell
# build项目
yarn build <项目名，例：impt-cn-jp> 
```

```shell
# 使用ts生成core包，每次core改动都需执行
yarn tsc
```

#### 项目名录

- 输出管理系统：
  - expt-jp-cn （日中）
- 输入管理系统：
  - impt-cn-jp （中日）

### learn常用命令

```shell
# 清空所有包
lerna clean
```

```shell
# 把所有包安装到根node_modules
lerna bootstrap
```

```shell
# 运行每个包中的script命令
lerna run <script> --[...args]
```

```shell
lerna add <package>[@version] [--dev] [--exact] [--peer]
#--dev 将新包添加到devDependencies而不是dependencies.
#--exact 添加具有确切版本（例如1.0.1）而不是默认^semver 范围（例如^1.0.1）的新包。
#--peer 将新包添加到peerDependencies而不是dependencies.

#将 module-1 包添加到 'prefix-' 前缀文件夹中的包中
lerna add module-1 packages/prefix-*

#将模块 1 安装到模块 2
lerna add module-1 --scope=module-2

#在 devDependencies 中将 module-1 安装到 module-2
lerna add module-1 --scope=module-2 --dev

#在 peerDependencies 中安装 module-1 到 module-2
lerna add module-1 --scope=module-2 --peer

#在除module-1之外的所有模块中安装module-1
lerna add module-1

#在所有模块中安装 babel-core 
lerna add babel-core
```