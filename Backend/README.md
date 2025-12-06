# HMCTS Backend API

API for creating tasks using MySQL and Python FastAPI.

## Setup

1. Install dependencies using `uv`:
   ```bash
   uv sync
   ```

2. Make sure MySQL is running and the database `hmcts` exists.

## Running the Server

**Important:** Always run the server using `uv run` to ensure it uses the correct virtual environment with all dependencies:

```bash
uv run python src/main.py
```

Or alternatively:

```bash
uv run uvicorn src.main:app --host 127.0.0.1 --port 8000
```

The server will start on `http://127.0.0.1:8000`

## API Endpoints

### Create Task
- **Endpoint:** `POST /`
- **Status Code:** `201 Created`
- **Request Body:**
  ```json
  {
    "title": "Task title",
    "description": "Task description (optional)",
    "status": "pending" | "in_progress" | "completed",
    "deadline": "2024-12-31T18:30:00"
  }
  ```
  Note: `deadline` must be in ISO datetime format (YYYY-MM-DDTHH:mm:ss)
- **Response:**
  ```json
  {
    "id": 1,
    "title": "Task title",
    "description": "Task description",
    "status": "pending",
    "deadline": "2024-12-31T18:30:00",
    "created_at": "2024-01-01T12:00:00"
  }
  ```

## Troubleshooting

### Cryptography Package Error

**Error:** `RuntimeError: 'cryptography' package is required for sha256_password or caching_sha2_password auth methods`

**Solution:**
- Ensure you're running the server with `uv run`:
  ```bash
  uv run python src/main.py
  ```
- If the error persists, reinstall dependencies:
  ```bash
  uv sync
  ```
- The `cryptography` package is required for MySQL 8.0+ authentication and should be automatically installed with `uv sync`

### Database Connection Errors

**Error:** `OperationalError: (2003, "Can't connect to MySQL server")` or similar connection errors

**Solutions:**
1. **Verify MySQL is running:**
   - Windows: Check Services or Task Manager
   - Linux/Mac: `sudo systemctl status mysql` or `brew services list`
   - Start MySQL if it's not running

2. **Check database exists:**
   ```sql
   SHOW DATABASES;
   ```
   If `hmcts` doesn't exist, create it:
   ```sql
   CREATE DATABASE hmcts;
   ```

3. **Verify connection credentials:**
   - Check `Backend/src/tasks/database.py` for the connection string
   - Default: `mysql+pymysql://root:root@localhost:3306/hmcts`
   - Update username, password, host, or port if needed

4. **Test MySQL connection:**
   ```bash
   mysql -u root -p -h localhost -P 3306
   ```

### MySQL Authentication Errors

**Error:** `Access denied for user` or authentication method errors

**Solutions:**
1. **Verify MySQL user credentials:**
   - Ensure the username and password in `database.py` match your MySQL setup
   - Test login: `mysql -u root -p`

2. **Check MySQL authentication plugin:**
   - MySQL 8.0+ uses `caching_sha2_password` by default
   - Ensure `cryptography` package is installed (see Cryptography Package Error above)

3. **Alternative: Change MySQL user authentication:**
   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
   FLUSH PRIVILEGES;
   ```

### Port Already in Use

**Error:** `Address already in use` or `Port 8000 is already in use`

**Solutions:**
1. **Find and stop the process using port 8000:**
   - Windows: `netstat -ano | findstr :8000` then `taskkill /PID <pid> /F`
   - Linux/Mac: `lsof -ti:8000 | xargs kill -9`

2. **Use a different port:**
   ```bash
   uv run uvicorn src.main:app --host 127.0.0.1 --port 8001
   ```
   Update frontend API URL accordingly

### Missing Dependencies

**Error:** `ModuleNotFoundError: No module named 'fastapi'` or similar

**Solution:**
- Ensure you're using `uv run` to execute scripts:
  ```bash
  uv run python src/main.py
  ```
- Reinstall dependencies:
  ```bash
  uv sync
  ```

### Python Version Issues

**Error:** `requires-python = ">=3.12"` or version compatibility errors

**Solution:**
- Verify Python version: `python --version` or `python3 --version`
- Install Python 3.12 or higher if needed
- Ensure `uv` is using the correct Python version:
  ```bash
  uv python list
  uv python install 3.12
  ```

### Database Schema Issues

**Error:** `Table 'hmcts.tasks' doesn't exist` or similar table errors

**Solution:**
1. **Check if tables exist:**
   ```sql
   USE hmcts;
   SHOW TABLES;
   ```

2. **Create tables using SQLAlchemy (if models are set up):**
   - Run the schema creation script if available
   - Or create tables manually based on the models

3. **Verify database schema:**
   - Check `Backend/mysql_schemas/dbcreate.sql` for the schema
   - Apply it if needed: `mysql -u root -p hmcts < mysql_schemas/dbcreate.sql`

### SQLAlchemy Connection Pool Errors

**Error:** Connection pool exhaustion or timeout errors

**Solutions:**
1. **Check connection pool settings in `database.py`**
2. **Restart MySQL server if connections are stuck**
3. **Verify MySQL max_connections setting:**
   ```sql
   SHOW VARIABLES LIKE 'max_connections';
   ```

### CORS Errors (from Frontend)

**Error:** CORS policy errors when frontend tries to connect

**Solution:**
- Verify CORS middleware is configured in `Backend/src/main.py`
- Check that `allow_origins` includes your frontend URL
- Ensure backend server is running before starting frontend

### API Documentation Not Accessible

**Issue:** Cannot access `/docs` or `/redoc` endpoints

**Solution:**
- Ensure server is running: `uv run python src/main.py`
- Check server logs for errors
- Verify you're accessing `http://127.0.0.1:8000/docs` (not `localhost`)
- Check firewall settings if accessing from another machine

### General Debugging Tips

1. **Check server logs** - Look for detailed error messages in the terminal
2. **Verify environment** - Ensure you're in the Backend directory when running commands
3. **Test database connection** - Use MySQL client to verify database accessibility
4. **Check Python path** - Ensure `uv run` is using the correct virtual environment
5. **Review error messages** - FastAPI provides detailed error information in responses


