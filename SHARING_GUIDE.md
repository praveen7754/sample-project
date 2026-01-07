# How to Share Your Bookstore Website Project

## Option 1: Share as ZIP File

1. **Create a ZIP archive** of the entire project folder:
   - Right-click on the "Bookstore Website" folder
   - Select "Send to" → "Compressed (zipped) folder"
   - This creates a `Bookstore Website.zip` file
   - Share this ZIP file via email, cloud storage, or file sharing service

2. **Before sharing**, make sure to:
   - Remove any `.env` files (contains sensitive database credentials)
   - Remove `__pycache__` folders and `.pyc` files
   - The `.gitignore` file will help exclude unnecessary files

## Option 2: Share via GitHub

1. **Create a GitHub repository**:
   ```bash
   cd "Bookstore Website"
   git init
   git add .
   git commit -m "Initial commit: Online Bookstore Website"
   ```

2. **Create repository on GitHub** and push:
   ```bash
   git remote add origin https://github.com/yourusername/bookstore-website.git
   git push -u origin main
   ```

3. **Share the repository URL** with others

## Option 3: Share Individual Files

You can share specific files:
- **README.md** - Complete setup instructions
- **backend/requirements.txt** - All Python dependencies
- Individual HTML/CSS/JS files for frontend

## Important Notes Before Sharing

⚠️ **Security Checklist**:
- ✅ Remove `backend/.env` file (contains database credentials)
- ✅ Make sure no passwords or API keys are hardcoded
- ✅ The project uses environment variables for sensitive data

📝 **What Recipients Need**:
- Python 3.8+
- MySQL Server
- pip package manager
- Follow the setup instructions in README.md

## Quick Share Instructions for Recipients

Tell recipients to:
1. Extract the ZIP file (if shared as ZIP)
2. Follow the **Setup Instructions** section in README.md
3. Set up MySQL database
4. Configure `.env` file with their database credentials
5. Run the setup commands

