# Kawa-Face后端

## 技术栈

- Python 3.12+
- FastAPI
- Uvicorn
- mongodb

## 安装与初始化

### 1. 克隆项目

首先，克隆项目到本地：

```bash
git clone https://github.com/kawa-fe/Kawa-face.git
cd server
```

### 2. 创建虚拟环境

建议使用虚拟环境来管理项目的依赖，以避免与其他项目产生冲突。

#### 使用 `venv` 创建虚拟环境

在项目根目录下运行以下命令来创建虚拟环境：

```bash
python -m venv venv
```

#### 激活虚拟环境

- **Windows**:

```bash
.\venv\Scripts\activate
```

- **macOS/Linux**:

```bash
source venv/bin/activate
```

### 3. 安装依赖

使用 `pip` 安装项目依赖：

```bash
pip install -r requirements.txt
```

### 4. 配置环境变量

创建 `.env` 文件，并根据需要配置相关环境变量（例如数据库配置、API 密钥等）。你可以根据项目需求自定义 `.env` 文件的内容：

```env
DATABASE_URL=your_database_url
SECRET_KEY=your_secret_key
DEBUG=True
```

### 5. 数据库迁移（如果有数据库）

如果你的项目有数据库，并且使用了 ORM（如 SQLAlchemy、Tortoise等），需要进行数据库迁移。

根据使用的 ORM，运行迁移命令。以下是 `SQLAlchemy` 示例：

```bash
alembic upgrade head
```

### 6. 启动后端

使用 Uvicorn 启动 FastAPI 后端：

```bash
uvicorn app.main:app --reload
```

默认情况下，后端会启动在 `http://127.0.0.1:8000`。

---

## 贡献

我们欢迎任何形式的贡献！如果你想为本项目做出贡献，请遵循以下步骤：

1. Fork 本项目。
2. 创建新的分支 (`git checkout -b feature-name`)。
3. 提交你的修改 (`git commit -am 'Add new feature'`)。
4. 推送到分支 (`git push origin feature-name`)。
5. 提交 Pull Request。

---
