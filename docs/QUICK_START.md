# PlushifyMe - Quick Start Guide

**⚡ Get running in 2 minutes**

---

## ✅ Configuration Status

Your environment is configured:
- ✅ OpenAI DALL-E 3
- ✅ AWS S3 Storage
- ✅ PostgreSQL Database
- ✅ Better Auth
- ⚠️ Resend Email (configure when needed)
- ✅ **69/69 unit tests passing**

---

## 🚀 Start Development (3 Commands)

```bash
# 1. Start database
npm run db:start && sleep 5

# 2. Run migrations
npm run db:migrate

# 3. Start dev server
npm run dev
```

**Open:** http://localhost:3000

---

## 🧪 Run Tests

```bash
# All unit tests (69 tests)
npm run test:unit
```

**Expected:** ✅ 69 tests passing in <1 second

---

## ⚠️ Important: Configure S3 CORS

**Required for file uploads to work in browser!**

```bash
# Create CORS config
cat > cors-config.json << 'EOF'
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT", "POST", "GET"],
    "AllowedOrigins": ["http://localhost:3000"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
EOF

# Apply CORS
aws s3api put-bucket-cors \
  --bucket plushifyme-images \
  --cors-configuration file://cors-config.json

# Verify
aws s3api get-bucket-cors --bucket plushifyme-images

# Cleanup
rm cors-config.json
```

---

## 🐛 If Something Fails

### Database Connection Error
```bash
docker ps | grep postgres  # Check if running
npm run db:start           # Restart if needed
```

### Test Failures
```bash
npm run test:unit  # Should show 69/69 passing
```

### OpenAI Not Working
Check `.env` has:
```
OPENAI_API_KEY=sk-proj-...
OPENAI_ORG_ID=org-...
```

### S3 Upload Fails
1. Verify AWS credentials in `.env`
2. **Configure CORS** (see above ⚠️)
3. Check bucket exists: `aws s3 ls`

---

## 📚 Detailed Guides

| Issue | See Document |
|-------|--------------|
| **Configuration problems** | `CONFIGURATION_VERIFICATION.md` |
| **Test results** | `CONFIG_TEST_RESULTS.md` |
| **Complete setup** | `README.md` |
| **Project overview** | `FINAL_PROJECT_SUMMARY.md` |

---

## ✅ Verification Checklist

Run these commands to verify everything works:

```bash
# 1. Tests pass
npm run test:unit
# Expected: ✅ 69/69 passing

# 2. Database running
npm run db:start && sleep 5 && npm run db:migrate
# Expected: ✅ Migration successful

# 3. Dev server starts
npm run dev
# Expected: ✅ Server running on http://localhost:3000

# 4. S3 accessible
aws s3 ls s3://plushifyme-images
# Expected: ✅ List of files (or empty)
```

---

**🎉 You're Ready!** Visit http://localhost:3000 after running `npm run dev`
