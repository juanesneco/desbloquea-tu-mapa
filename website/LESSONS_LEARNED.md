# Lessons Learned

## Local Development Server

### Issue: Python HTTP Server Not Responding on Port 8000

**Problem:** Running `python3 -m http.server 8000` in the background did not respond to requests.

**Solution:** Use explicit binding and a different port:
```bash
cd /path/to/website && python3 -m http.server 3000 --bind 127.0.0.1
```

**Key takeaways:**
1. Use `--bind 127.0.0.1` to explicitly bind to localhost
2. Port 8000 may be blocked or in use - try alternative ports (3000, 8080, etc.)
3. Always verify the server is responding with `curl` before assuming it's working
4. Access via `http://127.0.0.1:3000` or `http://localhost:3000`

### Quick Start Command
```bash
python3 -m http.server 3000 --bind 127.0.0.1
```
