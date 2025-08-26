# Troubleshooting Guide & Best Practices

This guide covers common issues, solutions, and best practices for the SEO WordPress AI workflow.

## 🚨 Common Issues & Solutions

### 1. Workflow Execution Issues

#### Problem: Workflow Times Out
**Symptoms**: Execution stops after 5-10 minutes without completing

**Solutions**:
1. **Increase n8n timeout settings**:
   ```bash
   # In n8n environment variables
   EXECUTIONS_TIMEOUT=1200  # 20 minutes
   EXECUTIONS_TIMEOUT_MAX=1800  # 30 minutes
   ```

2. **Split the workflow**:
   - Create separate workflows for research and content generation
   - Use webhook nodes to chain workflows

3. **Optimize API calls**:
   - Use GPT-4o-mini where possible
   - Reduce prompt complexity
   - Add wait nodes between heavy operations

#### Problem: Memory Issues
**Symptoms**: n8n crashes or becomes unresponsive

**Solutions**:
1. Increase Node.js memory:
   ```bash
   NODE_OPTIONS="--max-old-space-size=4096"
   ```

2. Clear execution history regularly:
   - Settings → Execution History → Clear

3. Use smaller data batches

### 2. OpenAI API Issues

#### Problem: Rate Limit Exceeded
**Error**: "Rate limit reached for requests"

**Solutions**:
1. **Add delays between requests**:
   - Insert Wait node (5-10 seconds)
   - Use exponential backoff

2. **Upgrade OpenAI tier**:
   - Check usage limits at platform.openai.com
   - Consider tier upgrade for higher limits

3. **Implement retry logic**:
   ```javascript
   // In Function node
   const maxRetries = 3;
   let retryCount = 0;
   
   while (retryCount < maxRetries) {
     try {
       // API call here
       break;
     } catch (error) {
       retryCount++;
       await new Promise(r => setTimeout(r, 2000 * retryCount));
     }
   }
   ```

#### Problem: Token Limit Exceeded
**Error**: "This model's maximum context length is X tokens"

**Solutions**:
1. **Reduce prompt size**:
   - Summarize research data
   - Remove unnecessary context
   - Use bullet points instead of paragraphs

2. **Split content generation**:
   - Generate sections separately
   - Combine at the end

3. **Use token counting**:
   ```javascript
   // Rough token estimate
   const tokenCount = text.length / 4;
   ```

### 3. WordPress Publishing Issues

#### Problem: Authentication Failed
**Error**: "401 Unauthorized" or "403 Forbidden"

**Solutions**:
1. **Verify credentials**:
   - Regenerate application password
   - Check username spelling
   - Ensure user has correct permissions

2. **Check REST API**:
   ```bash
   curl -u username:app_password \
     https://your-site.com/wp-json/wp/v2/posts
   ```

3. **Security plugin conflicts**:
   - Whitelist n8n IP address
   - Disable security plugins temporarily
   - Check .htaccess rules

#### Problem: Media Upload Fails
**Error**: "Failed to upload media"

**Solutions**:
1. **Check file permissions**:
   ```bash
   chmod 755 wp-content/uploads
   ```

2. **Increase upload limits**:
   ```php
   // In wp-config.php
   @ini_set('upload_max_size', '64M');
   @ini_set('post_max_size', '64M');
   @ini_set('max_execution_time', '300');
   ```

3. **Verify Content-Disposition header**:
   - Must include filename
   - Check special characters in filename

### 4. Content Quality Issues

#### Problem: Generic or Repetitive Content
**Symptoms**: AI generates similar content for different topics

**Solutions**:
1. **Enhance prompts**:
   - Add more specific context
   - Include unique angles
   - Reference current events

2. **Vary temperature settings**:
   ```json
   {
     "temperature": 0.8,  // More creative
     "top_p": 0.9
   }
   ```

3. **Use different models**:
   - GPT-4o for research
   - Claude for creative writing
   - GPT-4o-mini for formatting

#### Problem: SEO Elements Missing
**Symptoms**: Keywords not properly integrated

**Solutions**:
1. **Review prompt instructions**:
   - Make requirements explicit
   - Use numbered checklists
   - Add validation steps

2. **Post-process content**:
   - Add Function node to check keyword density
   - Validate heading structure
   - Ensure meta description length

## 📊 Best Practices

### 1. Workflow Design

#### Modular Architecture
```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Research  │────▶│   Generate   │────▶│   Publish   │
│   Workflow  │     │   Content    │     │  Workflow   │
└─────────────┘     └──────────────┘     └─────────────┘
```

**Benefits**:
- Easier debugging
- Reusable components
- Better error handling
- Parallel processing

#### Error Handling
1. **Use Try-Catch nodes**:
   - Wrap critical operations
   - Send notifications on failure
   - Log errors for debugging

2. **Implement fallbacks**:
   ```javascript
   try {
     // Primary operation
   } catch (error) {
     // Fallback operation
     // Or default content
   }
   ```

### 2. Content Optimization

#### Research Phase
1. **Multiple sources**:
   - Use web search for current info
   - Reference authoritative sites
   - Include statistics and data

2. **Fact verification**:
   - Cross-reference claims
   - Check publication dates
   - Verify statistics

#### Content Generation
1. **Iterative improvement**:
   - Generate outline first
   - Expand section by section
   - Review and refine

2. **Quality checks**:
   ```javascript
   // Keyword density check
   const keywordCount = content.match(/primary keyword/gi).length;
   const wordCount = content.split(' ').length;
   const density = (keywordCount / wordCount) * 100;
   
   if (density < 0.5 || density > 2.5) {
     // Adjust content
   }
   ```

### 3. SEO Enhancement

#### Technical SEO
1. **Schema markup validation**:
   - Use Google's Rich Results Test
   - Validate JSON-LD syntax
   - Include all required fields

2. **Meta tag optimization**:
   ```html
   <!-- Essential meta tags -->
   <meta name="description" content="...">
   <meta property="og:title" content="...">
   <meta property="og:description" content="...">
   <meta name="twitter:card" content="summary_large_image">
   ```

#### Content Structure
1. **Heading hierarchy**:
   ```
   H1 (Primary Keyword)
   ├── H2 (Secondary Topic)
   │   ├── H3 (Subtopic)
   │   └── H3 (Subtopic)
   └── H2 (Secondary Topic)
   ```

2. **Internal linking strategy**:
   - Link to pillar content
   - Use descriptive anchor text
   - Maintain topic relevance

### 4. Performance Monitoring

#### Workflow Metrics
1. **Track execution time**:
   ```javascript
   const startTime = Date.now();
   // ... workflow operations ...
   const executionTime = Date.now() - startTime;
   console.log(`Execution time: ${executionTime}ms`);
   ```

2. **Monitor API usage**:
   - Log token consumption
   - Track API costs
   - Set usage alerts

#### Content Performance
1. **SEO metrics**:
   - Google Search Console integration
   - Track keyword rankings
   - Monitor organic traffic

2. **Engagement metrics**:
   - Time on page
   - Bounce rate
   - Social shares

## 🛡️ Security Best Practices

### 1. Credential Management
```javascript
// Use environment variables
process.env.OPENAI_API_KEY
process.env.WP_APP_PASSWORD

// Never hardcode credentials
// ❌ const apiKey = "sk-abc123...";
// ✅ const apiKey = process.env.OPENAI_API_KEY;
```

### 2. Access Control
1. **Limit webhook access**:
   - Use authentication
   - Implement rate limiting
   - Log access attempts

2. **WordPress security**:
   - Use application passwords
   - Limit user permissions
   - Enable 2FA

### 3. Data Protection
1. **Sanitize inputs**:
   ```javascript
   // Clean user input
   const sanitized = input
     .replace(/<script>/gi, '')
     .replace(/javascript:/gi, '')
     .trim();
   ```

2. **Validate outputs**:
   - Check for malicious code
   - Validate HTML structure
   - Scan for suspicious links

## 🔄 Maintenance Schedule

### Daily
- Monitor workflow executions
- Check error logs
- Verify content quality

### Weekly
- Review API usage
- Update keyword lists
- Clear old executions

### Monthly
- Update dependencies
- Review security settings
- Analyze content performance
- Optimize underperforming workflows

### Quarterly
- Audit API costs
- Update prompts with new techniques
- Review and update documentation
- Test disaster recovery procedures

## 📞 Getting Help

### Resources
1. **n8n Community**: community.n8n.io
2. **WordPress Forums**: wordpress.org/support
3. **OpenAI Discord**: discord.com/invite/openai
4. **Stack Overflow**: Tag with n8n, wordpress-rest-api

### Debug Information to Collect
When seeking help, provide:
1. n8n version
2. Error messages (full text)
3. Workflow JSON (sanitized)
4. Execution logs
5. Node.js version
6. Operating system

Remember: Always test changes in a development environment before deploying to production!