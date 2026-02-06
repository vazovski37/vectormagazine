# cPanel Deployment Guide

This guide covers how to deploy the Vector Magazine project (Frontend, Admin, and Backend) to a cPanel hosting environment.

> [!NOTE]
> This guide assumes your cPanel account supports **Node.js applications** and **Python (Flask/Django) applications**. If not, you may need to upgrade your hosting plan or request these features.

## Prerequisites
- cPanel access
- Domain name (e.g., `yourdomain.com`)
- **GitHub Repository**: Your code pushed to a GitHub repo.

## Method 1: Git Deployment (Recommended)
This method allows you to pull changes directly from GitHub.

### 1.1 Connect cPanel to GitHub
1. Go to **Git Version Control** in cPanel.
2. Click **Create**.
3. **Clone URL**: Enter your GitHub repo URL (e.g., `git@github.com:username/repo.git`).
   - *Note*: If your repo is **Private**, you must set up an SSH Key first:
     1. Go to **SSH Access** > **Manage SSH Keys** > **Generate a New Key**.
     2. Copy the **Public Key**.
     3. Go to GitHub > Repo Settings > **Deploy Keys** > Add Key.
     4. Now use the SSH Clone URL in cPanel.
4. **Repository Path**: Enter a path (e.g., `repositories/vectormagazine`).
5. Click **Create**.

### 1.2 Deploying Updates
When you push changes to GitHub, go to **Git Version Control** -> **Manage** -> **Pull Deployment** to update files on the server.
*Tip*: You can set up a `.cpanel.yml` file to file-copy changes from your repo folder to your public `public_html` or subdomain folders automatically.

---

## Method 2: Manual Upload (Alternative)

## 1. Backend (Python/Flask) Deployment

### 1.1 Upload Files (if not using Git)
1. Create a folder in your file manager (e.g., `vectormagazine-backend`).
2. Upload all files from the `vectormagazine-backend` directory EXCEPT `venv`, `__pycache__`, and `.git`.
3. Create a `passenger_wsgi.py` file if one doesn't exist (cPanel's Python App Setup usually creates this, but you might need to link it to `app.py`).

### 1.2 Setup Python App
1. Go to **Setup Python App** in cPanel.
2. Click **Create Application**.
3. **Python Version**: Select 3.10 or newer.
4. **Application Root**:
   - **If using Git**: `repositories/vectormagazine/vectormagazine-backend` (adjust based on your clone path).
   - **If manually uploaded**: `vectormagazine-backend`.
5. **Application URL**: `api.yourdomain.com`.
6. **Application Startup File**: `passenger_wsgi.py`.
7. **Application Entry Point**: `application`.
8. Click **Create**.

### 1.3 Install Dependencies
1. Enter the virtual environment command provided at the top of the Python App page (click to copy).
   - E.g., `source /home/user/virtualenv/vectormagazine-backend/3.10/bin/activate`
2. Run: `pip install -r requirements.txt`

### 1.4 Environment Variables
In the "Standard" or "Environment variables" section of the Python App page, add:

| Name | Value | Description |
|------|-------|-------------|
| `FLASK_ENV` | `production` | Enables production mode |
| `FRONTEND_URL` | `https://yourdomain.com` | URL of the frontend |
| `ADMIN_URL` | `https://admin.yourdomain.com` | URL of the admin panel |
| `CORS_ORIGINS` | `https://yourdomain.com,https://admin.yourdomain.com` | Allowed CORS origins |
| `SECRET_KEY` | `(generate_a_random_string)` | Key for session security |
| `JWT_SECRET_KEY` | `(generate_another_random_string)` | Key for authentication tokens |
| `REVALIDATION_SECRET` | `(generate_another_random_string)` | Key for frontend revalidation |
| `DATABASE_URL` | `(your_db_connection_string)` | If using external DB (or use SQLite path) |

### 1.5 Database Setup
You have two choices. cPanel favors MySQL, but SQLite works fine too.

**Option A: SQLite (Default - Easiest)**
- **What is it?**: A single file (`app.db`) inside your `vectormagazine-backend` folder.
- **Pros**: Zero configuration. No usernames/passwords. Works instantly.
- **Cons**: **You will NOT see it in phpMyAdmin**. To view data, you must download the `app.db` file and use a tool like "DB Browser for SQLite".
- **Setup**: Just ensure the folder path is writable.

**Option B: MySQL (Recommended for Production)**
- **What is it?**: The standard database system in cPanel.
- **Pros**: Visible in **phpMyAdmin**, faster, handles more traffic.
- **Cons**: Requires setup.
- **Setup Steps**:
  1. Create a database in "MySQL Databases" (e.g., `user_vectordb`).
  2. Create a user and add it to the DB with "All Privileges".
  3. **Important**: You MUST add `pymysql` to your `requirements.txt` file (e.g., `pymysql` on a new line) before deploying.
  4. Update `DATABASE_URL` env var: `mysql+pymysql://user:password@localhost/db_name`.
  5. Run migrations/tables creation: 
     - `python create_tables.py`
     - `python create_admin.py --interactive` (Follow the prompts to set admin email/password)

## 2. Frontend & Admin (Next.js) Deployment

You have two options for Next.js: **Static Export** (easiest, free) or **Node.js Server** (requires Node.js support).

> [!RECOMMENDED]
> **Node.js Server** mode is required for features like ISR (Incremental Static Regeneration) and image optimization used in this project.

### 2.1 Build Locally
Run the build command locally to ensure everything works (we already did this!).
- `npm run build` in both folders.

### 2.2 Setup Node.js App (for both Frontend and Admin)
Repeat these steps for both applications (Frontend -> `yourdomain.com`, Admin -> `admin.yourdomain.com`).

1. **Application Root**:
   - **If using Git**: `repositories/vectormagazine/vectormagazine-frontend` (or `...-admin`).
   - **If manually uploaded**: `vectormagazine-frontend`.
2. Go to **Setup Node.js App** in cPanel.
3. **Application URL**: `yourdomain.com` (or `admin...`).
4. **Startup File**: `server.js` (or `npm start` command).
6. **Environment Variables**:

**Frontend (`vectormagazine-frontend`) Variables:**
| Name | Value |
|------|-------|
| `NEXT_PUBLIC_API_URL` | `https://api.yourdomain.com` |

**Admin (`vectormagazine-admin`) Variables:**
| Name | Value |
|------|-------|
| `NEXT_PUBLIC_API_URL` | `https://api.yourdomain.com` |
| `BACKEND_URL` | `https://api.yourdomain.com` |

7. **Install Dependencies**: Click "Run NPM Install" in the Node.js App dashboard.
8. **Start App**: Click "Start App".

### Troubleshooting Images
If images don't load:
1. Ensure `https://yourdomain.com` is added to `remotePatterns` in `next.config.ts` if images are hosted there.
2. If using local file uploads from the backend, ensure the `static/uploads` folder in Backend is accessible or served correctly via Nginx/Apache alias if possible, OR use an S3 bucket (recommended).

## 3. Verification

### 3.1 Verify Backend
Visit `https://api.yourdomain.com/health` in your browser.
- **Success**: You see `{"status": "healthy", "version": "1.0.0"}`.
- **Failure**: You see a 404, 500 Error, or "Python App Not Found". Check your **Application Root** path and **Startup File** (`app.py`) in cPanel.

### 3.2 Verify Frontend
Visit `https://yourdomain.com`.
- **Success**: The homepage loads and shows articles (fetched from backend).
- **Failure**: 
  - If page loads but no articles: Backend connection failed. Check `NEXT_PUBLIC_API_URL`.
  - If 500/404: Node.js app failed to start. Check cPanel logs.

### 3.3 Troubleshooting Missing .htaccess (Persistent 404)
If you do not see an `.htaccess` file in your backend folder and restarting the app doesn't create it, create it manually.

1. Create a new file named `.htaccess` in your backend folder.
2. Paste this content (you **MUST** replace the paths with your actual paths):

```apache
# DO NOT REMOVE. CLOUDLINUX PASSENGER CONFIGURATION BEGIN
PassengerAppRoot "/home/YOUR_USERNAME/repositories/vectormagazine/vectormagazine-backend"
PassengerBaseURI "/"
PassengerPython "/home/YOUR_USERNAME/virtualenv/vectormagazine-backend/3.10/bin/python"
# DO NOT REMOVE. CLOUDLINUX PASSENGER CONFIGURATION END
```

**Where to find the paths?**
- Look at the "Enter to the virtual environment" command in the Python App Setup page. 
- It looks like `source /home/user/virtualenv/.../bin/activate`.
- Use that path pattern to fill in `PassengerPython` (ending in `python` instead of `activate`).
- Use the `/home/user` part for `PassengerAppRoot`.

### 3.4 Troubleshooting Permissions (403/404 Errors)
If you still see 404s after fixing `.htaccess`, the web server likely cannot read your `repositories` folder due to strict permissions.

Run these commands in the cPanel Terminal:
```bash
chmod 755 /home/YOUR_USERNAME/repositories
chmod 755 /home/YOUR_USERNAME/repositories/vectormagazine
chmod 755 /home/YOUR_USERNAME/repositories/vectormagazine/vectormagazine-backend
```
(Replace `YOUR_USERNAME` with your actual cPanel username).

**Alternative: Edit via Terminal (SSH)**
If File Manager refuses to show the file:
1. Open **Terminal** in cPanel.
2. Navigate to the folder: `cd repositories/vectormagazine/vectormagazine-backend`
3. Edit the file using nano: `nano .htaccess`
4. Paste the content (Right-click -> Paste).
5. Save: Press `Ctrl+O`, `Enter`, then `Ctrl+X`.
