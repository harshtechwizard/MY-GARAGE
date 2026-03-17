# 🚀 Deployment Checklist

Use this checklist before deploying to production to ensure everything is secure and configured correctly.

---

## Pre-Deployment Checklist

### 🔒 Security Configuration

- [ ] **JWT Secret Generated**
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
  - [ ] Secret is at least 32 characters
  - [ ] Secret is random and unique
  - [ ] Secret is stored in environment variables, not code

- [ ] **Environment Variables Set**
  - [ ] `MONGO_URI` - MongoDB connection string
  - [ ] `JWT_SECRET` - Secure random string
  - [ ] `JWT_EXPIRES_IN` - Token expiration (e.g., "7d")
  - [ ] `NODE_ENV` - Set to "production"
  - [ ] `ALLOWED_ORIGINS` - Your frontend domain(s)
  - [ ] `PORT` - Server port (usually provided by host)

- [ ] **MongoDB Security**
  - [ ] Strong password used
  - [ ] IP whitelist configured
  - [ ] Database user has minimal required permissions
  - [ ] Connection string uses SSL/TLS
  - [ ] Regular backups configured

- [ ] **Code Security**
  - [ ] `.env` file is in `.gitignore`
  - [ ] No secrets in code
  - [ ] No console.logs with sensitive data
  - [ ] Error messages don't expose internal details
  - [ ] All dependencies updated (`npm update`)
  - [ ] No vulnerabilities (`npm audit` shows 0)

---

## Backend Deployment

### Render / Heroku / Railway

- [ ] **Repository Connected**
  - [ ] GitHub repository linked
  - [ ] Auto-deploy enabled (optional)
  - [ ] Branch selected (usually `main` or `master`)

- [ ] **Build Configuration**
  - [ ] Build command: `npm install`
  - [ ] Start command: `npm start`
  - [ ] Root directory: `backend` (if in monorepo)
  - [ ] Node version specified (if needed)

- [ ] **Environment Variables**
  - [ ] All variables from `.env.example` are set
  - [ ] Values are production-ready
  - [ ] No trailing spaces in values
  - [ ] ALLOWED_ORIGINS includes your frontend URL

- [ ] **Health Check**
  - [ ] Health check endpoint configured: `/`
  - [ ] Expected response: `200 OK`
  - [ ] Timeout set appropriately (30s recommended)

- [ ] **Post-Deployment Tests**
  - [ ] Health check responds: `curl https://your-api.com/`
  - [ ] User registration works
  - [ ] User login works and returns token
  - [ ] Protected routes require authentication
  - [ ] Rate limiting is active
  - [ ] CORS is properly configured

---

## Frontend Deployment

### Netlify / Vercel / GitHub Pages

- [ ] **Build Configuration**
  - [ ] Publish directory: `frontend` or `.`
  - [ ] No build command needed (static site)

- [ ] **API Configuration**
  - [ ] Update API URLs in JavaScript files
  - [ ] Replace `http://localhost:5000` with production URL
  - [ ] Test all API calls work

- [ ] **Custom Domain** (Optional)
  - [ ] Domain configured
  - [ ] SSL certificate active
  - [ ] DNS records updated
  - [ ] HTTPS redirect enabled

- [ ] **Post-Deployment Tests**
  - [ ] All pages load correctly
  - [ ] Forms submit successfully
  - [ ] API calls work
  - [ ] No console errors
  - [ ] Mobile responsive
  - [ ] Cross-browser compatible

---

## Security Verification

### Test Authentication
```bash
# Register a user
curl -X POST https://your-api.com/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"SecurePass123"}'

# Login
curl -X POST https://your-api.com/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123"}'

# Try protected route without token (should fail)
curl https://your-api.com/api/users/profile

# Try protected route with token (should succeed)
curl https://your-api.com/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test Rate Limiting
```bash
# Make 6 rapid requests (6th should be blocked)
for i in {1..6}; do
  curl -X POST https://your-api.com/api/users/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrong"}'
done
```

### Test Input Validation
```bash
# Try invalid email (should fail)
curl -X POST https://your-api.com/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"invalid","password":"pass"}'

# Try weak password (should fail)
curl -X POST https://your-api.com/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test2@example.com","password":"weak"}'
```

### Verify Security Headers
```bash
curl -I https://your-api.com/
```

Should include:
- `X-Frame-Options`
- `X-Content-Type-Options`
- `X-XSS-Protection`
- `Strict-Transport-Security` (if HTTPS)

---

## Database Verification

- [ ] **MongoDB Atlas**
  - [ ] Connection successful
  - [ ] Passwords are hashed (check a user document)
  - [ ] Indexes created (if any)
  - [ ] Backup schedule active
  - [ ] Monitoring enabled
  - [ ] Alerts configured

- [ ] **Data Integrity**
  - [ ] Test user registration creates proper document
  - [ ] Test garage registration creates proper document
  - [ ] Test booking creation creates proper document
  - [ ] All required fields are enforced
  - [ ] Validation rules work

---

## Performance & Monitoring

- [ ] **Performance**
  - [ ] API response time < 500ms
  - [ ] Database queries optimized
  - [ ] No N+1 query problems
  - [ ] Proper indexes on frequently queried fields

- [ ] **Monitoring Setup**
  - [ ] Error logging configured
  - [ ] Uptime monitoring active
  - [ ] Performance monitoring active
  - [ ] Alert notifications configured

- [ ] **Logging**
  - [ ] Application logs accessible
  - [ ] Error logs reviewed
  - [ ] No sensitive data in logs
  - [ ] Log retention policy set

---

## Documentation

- [ ] **Code Documentation**
  - [ ] README.md updated
  - [ ] API documentation current
  - [ ] Environment variables documented
  - [ ] Deployment process documented

- [ ] **User Documentation**
  - [ ] User guide available (if needed)
  - [ ] API documentation published (if public)
  - [ ] Support contact information provided

---

## Final Checks

### Security Audit
```bash
cd backend
npm audit
```
- [ ] 0 vulnerabilities

### Dependency Updates
```bash
npm outdated
```
- [ ] All dependencies reasonably up-to-date

### Code Quality
- [ ] No TODO comments left
- [ ] No debug code left
- [ ] No commented-out code
- [ ] Consistent code style
- [ ] No console.logs in production code

### Testing
- [ ] All endpoints tested
- [ ] Error cases tested
- [ ] Edge cases tested
- [ ] Load testing performed (if high traffic expected)

### Backup & Recovery
- [ ] Database backup tested
- [ ] Recovery procedure documented
- [ ] Backup schedule automated
- [ ] Backup retention policy set

---

## Post-Deployment

### Immediate (Within 1 hour)
- [ ] Monitor logs for errors
- [ ] Test all critical flows
- [ ] Verify monitoring alerts work
- [ ] Check performance metrics

### First 24 Hours
- [ ] Monitor error rates
- [ ] Check user registrations
- [ ] Verify bookings work
- [ ] Review performance
- [ ] Check database growth

### First Week
- [ ] Review all logs
- [ ] Analyze user behavior
- [ ] Check for security issues
- [ ] Optimize slow queries
- [ ] Update documentation if needed

---

## Rollback Plan

If something goes wrong:

1. **Identify the Issue**
   - Check logs
   - Review recent changes
   - Test specific functionality

2. **Quick Fixes**
   - Revert environment variables
   - Restart services
   - Clear caches

3. **Full Rollback**
   - Revert to previous deployment
   - Restore database backup (if needed)
   - Notify users (if needed)

4. **Post-Mortem**
   - Document what went wrong
   - Update deployment checklist
   - Implement preventive measures

---

## Emergency Contacts

- **Hosting Support**: [Platform support link]
- **Database Support**: MongoDB Atlas support
- **Team Lead**: [Contact info]
- **DevOps**: [Contact info]

---

## Compliance & Legal

- [ ] **Privacy**
  - [ ] Privacy policy updated
  - [ ] GDPR compliance (if applicable)
  - [ ] Data retention policy set
  - [ ] User data deletion process

- [ ] **Terms of Service**
  - [ ] Terms of service updated
  - [ ] User agreement in place
  - [ ] Liability disclaimers

- [ ] **Security**
  - [ ] Security policy documented
  - [ ] Incident response plan ready
  - [ ] Security contact published

---

## Success Criteria

Deployment is successful when:

✅ All checklist items completed
✅ Health check returns 200
✅ Users can register and login
✅ Garages can register and login
✅ Bookings can be created
✅ Dashboard loads and displays data
✅ No errors in logs
✅ Performance is acceptable
✅ Security tests pass
✅ Monitoring is active

---

## Maintenance Schedule

### Daily
- Check error logs
- Monitor uptime
- Review performance metrics

### Weekly
- Review security logs
- Check database size
- Update dependencies (if needed)
- Review user feedback

### Monthly
- Full security audit
- Performance optimization
- Backup verification
- Documentation update

### Quarterly
- Dependency major updates
- Security penetration testing
- Disaster recovery drill
- Architecture review

---

**Remember**: It's better to delay deployment than to deploy with security issues!

---

## Additional Resources

- [Installation Guide](./INSTALLATION_GUIDE.md)
- [Security Documentation](./backend/SECURITY.md)
- [API Documentation](./backend/README.md)
- [Security Fixes Summary](./SECURITY_FIXES_SUMMARY.md)

---

**Last Updated**: 2024
**Version**: 2.0.0
