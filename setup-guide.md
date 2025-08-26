# Setup Guide: WordPress API & OpenAI Configuration

This guide will walk you through setting up the necessary credentials and configurations for the SEO WordPress AI workflow.

## 🔑 OpenAI API Setup

### 1. Get Your OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign in or create an account
3. Navigate to **API Keys** section
4. Click **Create new secret key**
5. Copy and save your API key securely

### 2. Configure OpenAI in n8n

1. In n8n, go to **Credentials** → **Create New**
2. Search for "OpenAI"
3. Add the following:
   ```
   API Key: sk-...your-api-key...
   Organization ID: (optional)
   ```
4. Name it "OpenAI API" and save

### 3. Required OpenAI Models

Ensure your OpenAI account has access to:
- **GPT-4o** (for research)
- **GPT-4o-mini** (for content generation)

## 🔐 WordPress API Setup

### 1. Enable WordPress REST API

The REST API is enabled by default in WordPress 4.7+. Verify it's working:
```
https://your-site.com/wp-json/wp/v2/posts
```

### 2. Create Application Password

1. Log into WordPress admin
2. Go to **Users** → **Your Profile**
3. Scroll to **Application Passwords**
4. Enter a name (e.g., "n8n Integration")
5. Click **Add New Application Password**
6. Copy the generated password

### 3. Configure WordPress in n8n

1. In n8n, go to **Credentials** → **Create New**
2. Search for "WordPress"
3. Add the following:
   ```
   Username: your-wordpress-username
   Password: application-password-from-step-2
   WordPress URL: https://your-site.com
   Ignore SSL Issues: No (unless using self-signed cert)
   ```
4. Name it "WordPress API" and save

### 4. Set Up HTTP Basic Auth (for media uploads)

1. Create new **HTTP Request** credentials
2. Choose **Basic Auth**
3. Add:
   ```
   Username: your-wordpress-username
   Password: application-password
   ```

## ⚙️ Workflow Configuration

### 1. Update Node Credentials

After importing the workflow, update these nodes with your credentials:

#### OpenAI Nodes:
- **OpenAI Research**
- **OpenAI Chat Model**
- **gpt-4o-mini**
- **Create HTML**

#### WordPress Nodes:
- **WordPress**
- **Upload Image to WordPress**
- **Set Image on WordPress Post**

### 2. Configure WordPress Settings

In the **WordPress** node, update:
```javascript
{
  "additionalFields": {
    "authorId": 1,  // Your WordPress user ID
    "categories": [1],  // Your category IDs
    "status": "draft"  // or "publish"
  }
}
```

### 3. Update URLs

Search and replace these URLs in the workflow:
- `https://contextqa.com` → Your WordPress site URL
- Update webhook URLs if needed

## 🔍 Finding WordPress IDs

### Get User ID
```bash
# Via REST API
curl https://your-site.com/wp-json/wp/v2/users

# Or in WordPress admin
Users → hover over username → check URL
```

### Get Category IDs
```bash
# Via REST API
curl https://your-site.com/wp-json/wp/v2/categories

# Or in WordPress admin
Posts → Categories → hover over category → check URL
```

## ✅ Testing Your Setup

### 1. Test OpenAI Connection
1. Create a simple workflow with OpenAI node
2. Try a basic prompt
3. Check for successful response

### 2. Test WordPress Connection
1. Create a test workflow
2. Try listing posts:
   ```
   GET https://your-site.com/wp-json/wp/v2/posts
   ```
3. Try creating a draft post

### 3. Test Media Upload
1. Use HTTP Request node
2. Upload a test image
3. Verify it appears in Media Library

## 🚨 Common Setup Issues

### OpenAI Issues

**Error: Invalid API Key**
- Double-check your API key
- Ensure no extra spaces
- Verify key hasn't been revoked

**Error: Rate Limit**
- Check your OpenAI usage limits
- Add delays between requests
- Upgrade your OpenAI plan if needed

### WordPress Issues

**Error: 401 Unauthorized**
- Verify application password
- Check username is correct
- Ensure REST API is enabled

**Error: 403 Forbidden**
- Check user permissions
- Verify user can create posts
- Check security plugins blocking API

**Error: Cannot Upload Media**
- Verify user has upload_files capability
- Check file size limits
- Ensure correct Content-Type headers

## 🔒 Security Best Practices

1. **Use Application Passwords**
   - Never use your main WordPress password
   - Create separate passwords for each integration

2. **Limit Permissions**
   - Create dedicated user for n8n
   - Grant only necessary capabilities

3. **Use HTTPS**
   - Ensure WordPress uses SSL
   - Don't ignore SSL warnings

4. **Secure n8n**
   - Use environment variables for credentials
   - Enable n8n authentication
   - Use HTTPS for n8n

## 📊 Monitoring & Logs

### Enable WordPress Debugging
```php
// In wp-config.php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
```

### Check n8n Execution Logs
1. Go to **Workflow Executions**
2. Click on execution
3. Check each node's output
4. Look for error messages

## 🔄 Next Steps

Once setup is complete:

1. Test the complete workflow with a sample query
2. Review the generated content
3. Adjust prompts if needed
4. Set up monitoring
5. Create content calendar

## 📞 Support Resources

- [n8n Community Forum](https://community.n8n.io/)
- [WordPress REST API Handbook](https://developer.wordpress.org/rest-api/)
- [OpenAI Support](https://help.openai.com/)

Remember to keep your API keys secure and never commit them to version control!