# KawaFace - AI 视频通话

KawaFace 是一个基于人工智能的高效视频通话系统，旨在通过 AI 技术优化视频通话体验，包括但不限于人脸识别、背景替换、实时语音处理等。

`pnpm` 是一个快速、节省磁盘空间的包管理器，`husky` 是一个能让你方便地使用 `Git Hooks` 的工具。以下是使用 `pnpm` 在项目中配置 `husky` 的详细步骤：

### 步骤 1：初始化项目
如果你还没有项目，先创建一个新的项目目录并初始化 `package.json` 文件：
```bash
mkdir my-project
cd my-project
pnpm init -y
```

### 步骤 2：安装 `husky`
使用 `pnpm` 安装 `husky` 作为开发依赖：
```bash
pnpm add husky -D
```

### 步骤 3：启用 `Git Hooks` 支持
执行以下命令来启用 `husky`，这会在项目根目录下创建一个 `.husky` 文件夹，并配置 `Git` 使用这些钩子：
```bash
pnpm exec husky install
```
为了在项目克隆后自动启用 `husky`，可以在 `package.json` 中添加一个 `prepare` 脚本：
```json
{
  "scripts": {
    "prepare": "husky install"
  }
}
```

### 步骤 4：添加 `Git Hook`
下面以添加 `pre-commit` 钩子为例，这个钩子会在每次执行 `git commit` 之前运行。使用以下命令添加一个 `pre-commit` 钩子：
```bash
pnpm exec husky add .husky/pre-commit "pnpm test"
```
上述命令会在 `.husky` 文件夹下创建一个 `pre-commit` 文件，并在其中添加一行命令 `pnpm test`。这意味着在每次执行 `git commit` 之前，会先运行 `pnpm test` 命令。如果 `pnpm test` 命令执行失败（返回非零退出码），`git commit` 操作将被阻止。

你可以根据需要修改 `pre-commit` 文件中的命令。例如，如果你想在提交前运行代码格式化工具（如 `prettier`），可以这样修改：
```bash
pnpm exec husky add .husky/pre-commit "pnpm prettier --write . && git add ."
```

### 步骤 5：验证配置
现在你可以尝试提交代码来验证 `husky` 是否正常工作：
```bash
git add .
git commit -m "Test husky"
```
如果 `pre-commit` 钩子中的命令执行成功，提交操作将正常完成；如果命令执行失败，提交操作将被阻止，并显示相应的错误信息。

### 总结
通过以上步骤，你就可以使用 `pnpm` 在项目中成功配置 `husky`，并利用 `Git Hooks` 在特定的 `Git` 操作前执行自定义脚本。