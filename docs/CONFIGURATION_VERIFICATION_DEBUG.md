# Configuration Verification & Debugging Guide

**Last Updated:** November 19, 2025
**Purpose:** Comprehensive troubleshooting guide for external service configurations with differential diagnosis decision trees

---

## Table of Contents

1. [Quick Diagnostic Overview](#quick-diagnostic-overview)
2. [AWS S3 Configuration & Debugging](#aws-s3-configuration--debugging)
3. [OpenAI API Configuration & Debugging](#openai-api-configuration--debugging)
4. [Resend Email Configuration & Debugging](#resend-email-configuration--debugging)
5. [Stripe Webhook Configuration & Debugging](#stripe-webhook-configuration--debugging)
6. [PostgreSQL Database Debugging](#postgresql-database-debugging)
7. [Better Auth Configuration & Debugging](#better-auth-configuration--debugging)
8. [Automated Test-Based Diagnostics](#automated-test-based-diagnostics)

---

## Quick Diagnostic Overview

### Pre-Flight System Check

Run this complete diagnostic in one command:

```bash
# Complete system diagnostic
cat > diagnostic.sh << 'EOF'
#!/bin/bash
echo "=== PlushifyMe Configuration Diagnostic ==="
echo "Date: $(date)"
echo ""

# Check .env file
echo "1. Environment File Check"
if [ -f .env ]; then
  echo "   ✅ .env file exists"
else
  echo "   ❌ .env file missing - copy from .env.example"
fi
echo ""

# Check critical environment variables
echo "2. Critical Environment Variables"
source .env 2>/dev/null
for var in DATABASE_URL BETTER_AUTH_SECRET OPENAI_API_KEY AWS_ACCESS_KEY_ID AWS_S3_BUCKET; do
  if [ -n "${!var}" ]; then
    echo "   ✅ $var is set"
  else
    echo "   ❌ $var is NOT set"
  fi
done
echo ""

# Check Docker containers
echo "3. Docker Services"
if docker ps | grep -q plushifyme-postgres; then
  echo "   ✅ PostgreSQL container running"
else
  echo "   ⚠️  PostgreSQL container not running - run: npm run db:start"
fi
echo ""

# Check PostgreSQL connectivity
echo "4. Database Connectivity"
if docker exec plushifyme-postgres pg_isready -U plushifyme 2>/dev/null | grep -q "accepting connections"; then
  echo "   ✅ PostgreSQL accepting connections"
else
  echo "   ❌ PostgreSQL not responding"
fi
echo ""

# Check AWS CLI
echo "5. AWS CLI Configuration"
if command -v aws &> /dev/null; then
  echo "   ✅ AWS CLI installed"
  if aws sts get-caller-identity &>/dev/null; then
    echo "   ✅ AWS credentials valid"
  else
    echo "   ❌ AWS credentials invalid or not configured"
  fi
else
  echo "   ⚠️  AWS CLI not installed - install: brew install awscli"
fi
echo ""

# Check Node.js and npm
echo "6. Development Environment"
echo "   Node.js: $(node --version)"
echo "   npm: $(npm --version)"
echo ""

# Check package installation
if [ -d node_modules ]; then
  echo "   ✅ node_modules installed"
else
  echo "   ❌ node_modules missing - run: npm install"
fi
echo ""

echo "=== End Diagnostic ==="
EOF

chmod +x diagnostic.sh
./diagnostic.sh
rm diagnostic.sh
```

---

## AWS S3 Configuration & Debugging

### Common S3 Errors Decision Tree

```
S3 Error Occurred
│
├─ Error: InvalidAccessKeyId
│  └─ DIAGNOSIS: Access key is wrong or doesn't exist
│     ├─ CHECK 1: Verify AWS_ACCESS_KEY_ID in .env matches IAM console
│     ├─ CHECK 2: Ensure IAM user wasn't deleted
│     └─ FIX: Regenerate access keys in IAM console
│
├─ Error: SignatureDoesNotMatch
│  └─ DIAGNOSIS: Secret access key is incorrect
│     ├─ CHECK 1: Verify AWS_SECRET_ACCESS_KEY has no extra spaces
│     ├─ CHECK 2: Check for copy/paste errors
│     └─ FIX: Regenerate access keys in IAM console
│
├─ Error: AccessDenied
│  └─ DIAGNOSIS: IAM policy missing required permissions
│     ├─ CHECK 1: Verify IAM user has S3 policy attached
│     ├─ CHECK 2: Check policy allows required actions
│     └─ FIX: Attach correct IAM policy (see below)
│
├─ Error: NoSuchBucket
│  └─ DIAGNOSIS: Bucket doesn't exist or wrong name
│     ├─ CHECK 1: Verify bucket exists: aws s3 ls
│     ├─ CHECK 2: Check AWS_S3_BUCKET matches exact bucket name
│     └─ FIX: Create bucket or update .env with correct name
│
├─ Error: CORS Policy Error (in browser)
│  └─ DIAGNOSIS: CORS not configured on S3 bucket
│     ├─ CHECK 1: Verify CORS rules: aws s3api get-bucket-cors --bucket NAME
│     ├─ CHECK 2: Check AllowedOrigins includes your domain
│     └─ FIX: Apply CORS configuration (see below)
│
├─ Error: Presigned URL returns 403
│  └─ DIAGNOSIS: IAM permissions or KMS encryption issue
│     ├─ CHECK 1: IAM user has s3:GetObject permission
│     ├─ CHECK 2: If using KMS, check key policy allows user
│     ├─ CHECK 3: Check URL expiration time hasn't passed
│     └─ FIX: Update IAM policy or KMS key policy
│
└─ Error: Upload succeeds but can't download
   └─ DIAGNOSIS: Bucket policy or ACL blocking public access
      ├─ CHECK 1: Check bucket's "Block Public Access" settings
      ├─ CHECK 2: Verify presigned URLs are being used
      └─ FIX: Use presigned URLs for all downloads
```

### Step-by-Step S3 Configuration

#### 1. Install AWS CLI (if not installed)

```bash
# macOS
brew install awscli

# Verify installation
aws --version
```

#### 2. Configure AWS Credentials

```bash
# Method 1: Environment variables (recommended for development)
# Already done via .env file

# Method 2: AWS CLI configuration (alternative)
aws configure
# Enter: Access Key ID, Secret Access Key, Region (us-east-1), Output format (json)

# Verify configuration
aws sts get-caller-identity
```

**Expected Output:**
```json
{
    "UserId": "AIDAI...",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/plushifyme-app"
}
```

#### 3. Test S3 Access

```bash
# Create comprehensive S3 diagnostic script
cat > test-s3-complete.sh << 'EOF'
#!/bin/bash
source .env

echo "=== AWS S3 Complete Diagnostic ==="
echo "Date: $(date)"
echo ""

# Test 1: AWS CLI installation
echo "1. AWS CLI Check"
if command -v aws &> /dev/null; then
  echo "   ✅ AWS CLI installed: $(aws --version)"
else
  echo "   ❌ AWS CLI not installed"
  echo "   FIX: brew install awscli"
  exit 1
fi
echo ""

# Test 2: Credentials validity
echo "2. AWS Credentials Check"
IDENTITY=$(aws sts get-caller-identity 2>&1)
if [ $? -eq 0 ]; then
  echo "   ✅ AWS credentials valid"
  echo "   User ARN: $(echo $IDENTITY | jq -r '.Arn')"
else
  echo "   ❌ AWS credentials invalid"
  echo "   Error: $IDENTITY"
  echo "   FIX: Check AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in .env"
  exit 1
fi
echo ""

# Test 3: List buckets
echo "3. S3 Bucket Access Check"
BUCKETS=$(aws s3 ls 2>&1)
if [ $? -eq 0 ]; then
  echo "   ✅ Can list S3 buckets"
  echo "$BUCKETS" | while read line; do
    echo "      - $line"
  done
else
  echo "   ❌ Cannot list buckets"
  echo "   Error: $BUCKETS"
  exit 1
fi
echo ""

# Test 4: Check target bucket exists
echo "4. Target Bucket Check: $AWS_S3_BUCKET"
if aws s3 ls "s3://$AWS_S3_BUCKET" &>/dev/null; then
  echo "   ✅ Bucket exists and is accessible"
else
  echo "   ❌ Bucket not found or not accessible"
  echo "   FIX: Create bucket: aws s3 mb s3://$AWS_S3_BUCKET --region $AWS_REGION"
  exit 1
fi
echo ""

# Test 5: Check bucket region
echo "5. Bucket Region Check"
BUCKET_REGION=$(aws s3api get-bucket-location --bucket $AWS_S3_BUCKET --query LocationConstraint --output text 2>&1)
if [ "$BUCKET_REGION" == "None" ]; then
  BUCKET_REGION="us-east-1"
fi
if [ "$BUCKET_REGION" == "$AWS_REGION" ]; then
  echo "   ✅ Bucket region matches: $AWS_REGION"
else
  echo "   ⚠️  Bucket region mismatch:"
  echo "      Bucket: $BUCKET_REGION"
  echo "      Config: $AWS_REGION"
  echo "   FIX: Update AWS_REGION in .env to $BUCKET_REGION"
fi
echo ""

# Test 6: Test write permission
echo "6. Write Permission Test"
TEST_FILE="test/diagnostic-$(date +%s).txt"
echo "Test file created at $(date)" > /tmp/test-s3.txt
if aws s3 cp /tmp/test-s3.txt "s3://$AWS_S3_BUCKET/$TEST_FILE" &>/dev/null; then
  echo "   ✅ Write permission OK"
else
  echo "   ❌ Cannot write to bucket"
  echo "   FIX: Attach IAM policy with s3:PutObject permission"
  exit 1
fi
echo ""

# Test 7: Test read permission
echo "7. Read Permission Test"
if aws s3 cp "s3://$AWS_S3_BUCKET/$TEST_FILE" /tmp/test-s3-download.txt &>/dev/null; then
  echo "   ✅ Read permission OK"
else
  echo "   ❌ Cannot read from bucket"
  echo "   FIX: Attach IAM policy with s3:GetObject permission"
fi
echo ""

# Test 8: Test delete permission
echo "8. Delete Permission Test"
if aws s3 rm "s3://$AWS_S3_BUCKET/$TEST_FILE" &>/dev/null; then
  echo "   ✅ Delete permission OK"
else
  echo "   ❌ Cannot delete from bucket"
  echo "   FIX: Attach IAM policy with s3:DeleteObject permission"
fi
rm -f /tmp/test-s3.txt /tmp/test-s3-download.txt
echo ""

# Test 9: Check CORS configuration
echo "9. CORS Configuration Check"
CORS=$(aws s3api get-bucket-cors --bucket $AWS_S3_BUCKET 2>&1)
if [ $? -eq 0 ]; then
  echo "   ✅ CORS is configured"
  echo "$CORS" | jq -r '.CORSRules[] | "      Origin: \(.AllowedOrigins[]) | Methods: \(.AllowedMethods | join(", "))"'
else
  echo "   ⚠️  CORS not configured"
  echo "   FIX: Run CORS configuration script (see below)"
fi
echo ""

# Test 10: Check bucket encryption
echo "10. Bucket Encryption Check"
ENCRYPTION=$(aws s3api get-bucket-encryption --bucket $AWS_S3_BUCKET 2>&1)
if [ $? -eq 0 ]; then
  echo "   ✅ Bucket encryption enabled"
  ENCRYPTION_TYPE=$(echo $ENCRYPTION | jq -r '.Rules[0].ApplyServerSideEncryptionByDefault.SSEAlgorithm')
  echo "      Type: $ENCRYPTION_TYPE"
  if [[ "$ENCRYPTION_TYPE" == *"KMS"* ]]; then
    KMS_KEY=$(echo $ENCRYPTION | jq -r '.Rules[0].ApplyServerSideEncryptionByDefault.KMSMasterKeyID')
    echo "      KMS Key: $KMS_KEY"
    echo "   ⚠️  If using KMS, ensure IAM user has kms:Decrypt permission"
  fi
else
  echo "   ⚠️  Bucket encryption not enabled (optional)"
fi
echo ""

echo "=== S3 Diagnostic Complete ==="
EOF

chmod +x test-s3-complete.sh
./test-s3-complete.sh
```

#### 4. Required IAM Policy

Create this exact IAM policy for your S3 user:

```bash
cat > s3-iam-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PlushifyMeS3Access",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::plushifyme-images",
        "arn:aws:s3:::plushifyme-images/*"
      ]
    }
  ]
}
EOF

# Create IAM policy (if it doesn't exist)
aws iam create-policy \
  --policy-name PlushifyMeS3Access \
  --policy-document file://s3-iam-policy.json

# Attach to your IAM user
aws iam attach-user-policy \
  --user-name plushifyme-app \
  --policy-arn arn:aws:iam::YOUR_ACCOUNT_ID:policy/PlushifyMeS3Access

rm s3-iam-policy.json
```

#### 5. CORS Configuration

```bash
# Create and apply CORS configuration
cat > cors-config.json << 'EOF'
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT", "POST", "GET", "DELETE"],
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://*.plushifyme.com",
      "https://plushifyme.com"
    ],
    "ExposeHeaders": ["ETag", "x-amz-request-id"],
    "MaxAgeSeconds": 3000
  }
]
EOF

# Apply CORS
source .env
aws s3api put-bucket-cors \
  --bucket $AWS_S3_BUCKET \
  --cors-configuration file://cors-config.json

# Verify CORS
aws s3api get-bucket-cors --bucket $AWS_S3_BUCKET | jq '.'

rm cors-config.json
```

#### 6. Test CORS with curl

```bash
# Test CORS preflight request
source .env

curl -X OPTIONS "https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/test-file.txt" \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: PUT" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v

# Look for these headers in response:
# Access-Control-Allow-Origin: http://localhost:3000
# Access-Control-Allow-Methods: PUT, POST, GET
```

#### 7. Presigned URL Testing

```bash
# Test presigned URL generation
cat > test-presigned-url.js << 'EOF'
require('dotenv').config()
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
})

async function testPresignedUrl() {
  try {
    console.log('🔍 Testing Presigned URL Generation...')

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `test/presigned-test-${Date.now()}.txt`,
      ContentType: 'text/plain'
    })

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 })

    console.log('✅ Presigned URL generated successfully')
    console.log('URL:', presignedUrl)
    console.log('')
    console.log('Test upload with:')
    console.log(`curl -X PUT "${presignedUrl}" -H "Content-Type: text/plain" -d "test data"`)

  } catch (error) {
    console.error('❌ Presigned URL generation failed:', error.message)
    if (error.name === 'InvalidAccessKeyId') {
      console.error('🔧 FIX: Check AWS_ACCESS_KEY_ID in .env')
    } else if (error.name === 'SignatureDoesNotMatch') {
      console.error('🔧 FIX: Check AWS_SECRET_ACCESS_KEY in .env')
    }
  }
}

testPresignedUrl()
EOF

node test-presigned-url.js
rm test-presigned-url.js
```

---

## OpenAI API Configuration & Debugging

### Common OpenAI Errors Decision Tree

```
OpenAI Error Occurred
│
├─ Error 401: Unauthorized
│  └─ DIAGNOSIS: API key issue
│     ├─ CHECK 1: Verify OPENAI_API_KEY starts with "sk-proj-" or "sk-"
│     ├─ CHECK 2: Check key wasn't revoked at platform.openai.com
│     ├─ CHECK 3: Ensure no extra spaces/newlines in .env
│     └─ FIX: Regenerate API key from OpenAI dashboard
│
├─ Error 401: Incorrect organization
│  └─ DIAGNOSIS: Organization ID mismatch
│     ├─ CHECK 1: Verify OPENAI_ORG_ID matches your organization
│     ├─ CHECK 2: Check you have access to the organization
│     ├─ CHECK 3: If multiple orgs, ensure correct one is specified
│     └─ FIX: Get correct org ID from platform.openai.com/settings/organization
│
├─ Error 403: Forbidden / No access to organization
│  └─ DIAGNOSIS: Permission or billing issue
│     ├─ CHECK 1: Verify billing is set up (platform.openai.com/account/billing)
│     ├─ CHECK 2: Check payment method is valid
│     ├─ CHECK 3: Ensure you haven't been removed from organization
│     └─ FIX: Add payment method or contact organization admin
│
├─ Error 429: Rate limit exceeded
│  └─ DIAGNOSIS: Too many requests or quota exceeded
│     ├─ CHECK 1: Check usage limits (platform.openai.com/account/limits)
│     ├─ CHECK 2: Verify billing limits aren't exceeded
│     ├─ CHECK 3: Check for runaway loops in code
│     └─ FIX: Wait for rate limit reset or upgrade plan
│
├─ Error 429: Insufficient quota
│  └─ DIAGNOSIS: Billing or quota issue
│     ├─ CHECK 1: Add credits to account
│     ├─ CHECK 2: Set up monthly billing
│     └─ FIX: Add payment method and credits
│
└─ Error 500: Server error
   └─ DIAGNOSIS: OpenAI service issue
      ├─ CHECK 1: Check OpenAI status (status.openai.com)
      ├─ CHECK 2: Retry with exponential backoff
      └─ FIX: Wait for service restoration
```

### Step-by-Step OpenAI Configuration

#### 1. Verify API Key Format

```bash
# Check API key format
source .env

if [[ $OPENAI_API_KEY =~ ^sk-proj-[A-Za-z0-9_-]{48,}$ ]] || [[ $OPENAI_API_KEY =~ ^sk-[A-Za-z0-9]{48,}$ ]]; then
  echo "✅ API key format appears valid"
else
  echo "❌ API key format invalid"
  echo "Expected: sk-proj-... or sk-..."
  echo "Got: ${OPENAI_API_KEY:0:20}..."
fi

if [[ $OPENAI_ORG_ID =~ ^org-[A-Za-z0-9]{24,}$ ]]; then
  echo "✅ Organization ID format appears valid"
else
  echo "⚠️  Organization ID format may be invalid"
  echo "Expected: org-..."
  echo "Got: $OPENAI_ORG_ID"
fi
```

#### 2. Test OpenAI Connection

```bash
# Comprehensive OpenAI diagnostic
cat > test-openai-complete.js << 'EOF'
require('dotenv').config()
const OpenAI = require('openai')

async function testOpenAI() {
  console.log('=== OpenAI Complete Diagnostic ===')
  console.log('Date:', new Date().toISOString())
  console.log('')

  // Check 1: Environment variables
  console.log('1. Environment Variables Check')
  const apiKey = process.env.OPENAI_API_KEY
  const orgId = process.env.OPENAI_ORG_ID

  if (!apiKey) {
    console.log('   ❌ OPENAI_API_KEY not set')
    console.log('   FIX: Add OPENAI_API_KEY to .env file')
    return
  }
  console.log(`   ✅ OPENAI_API_KEY set: ${apiKey.substring(0, 10)}...`)

  if (!orgId) {
    console.log('   ⚠️  OPENAI_ORG_ID not set (optional but recommended)')
  } else {
    console.log(`   ✅ OPENAI_ORG_ID set: ${orgId}`)
  }
  console.log('')

  // Check 2: API key format
  console.log('2. API Key Format Check')
  if (apiKey.startsWith('sk-proj-') || apiKey.startsWith('sk-')) {
    console.log('   ✅ API key format valid')
  } else {
    console.log('   ❌ API key format invalid')
    console.log('   Expected: sk-proj-... or sk-...')
    return
  }
  console.log('')

  // Check 3: Initialize client
  console.log('3. OpenAI Client Initialization')
  let openai
  try {
    openai = new OpenAI({
      apiKey: apiKey,
      organization: orgId || undefined
    })
    console.log('   ✅ Client initialized')
  } catch (error) {
    console.log('   ❌ Client initialization failed:', error.message)
    return
  }
  console.log('')

  // Check 4: Simple API call (chat completion)
  console.log('4. API Connection Test (Chat Completion)')
  console.log('   Cost: ~$0.0001')
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Say "OK"' }],
      max_tokens: 5
    })
    console.log('   ✅ Chat API working')
    console.log('   Response:', response.choices[0].message.content)
    console.log('   Model:', response.model)
  } catch (error) {
    console.log('   ❌ Chat API failed:', error.message)
    console.log('')
    console.log('   Error Details:')
    console.log('   Status:', error.status)
    console.log('   Type:', error.type)
    console.log('')

    if (error.status === 401) {
      console.log('   🔧 DIAGNOSIS: Authentication failed')
      console.log('   FIX 1: Verify API key at https://platform.openai.com/api-keys')
      console.log('   FIX 2: Check for spaces/newlines in .env file')
      console.log('   FIX 3: Regenerate API key if compromised')
    } else if (error.status === 403) {
      console.log('   🔧 DIAGNOSIS: Forbidden - billing or org access issue')
      console.log('   FIX 1: Check billing: https://platform.openai.com/account/billing')
      console.log('   FIX 2: Verify org ID: https://platform.openai.com/settings/organization')
      console.log('   FIX 3: Ensure you have access to the organization')
    } else if (error.status === 429) {
      console.log('   🔧 DIAGNOSIS: Rate limit or quota exceeded')
      console.log('   FIX 1: Check limits: https://platform.openai.com/account/limits')
      console.log('   FIX 2: Add payment method or credits')
      console.log('   FIX 3: Wait for rate limit reset')
    }
    return
  }
  console.log('')

  // Check 5: DALL-E 3 availability (don't actually call, just check models)
  console.log('5. DALL-E 3 Model Check')
  try {
    const models = await openai.models.list()
    const dalle3 = models.data.find(m => m.id === 'dall-e-3')
    if (dalle3) {
      console.log('   ✅ DALL-E 3 model available')
    } else {
      console.log('   ⚠️  DALL-E 3 not in models list (may still work)')
    }
  } catch (error) {
    console.log('   ⚠️  Could not list models:', error.message)
  }
  console.log('')

  console.log('=== OpenAI Diagnostic Complete ===')
  console.log('✅ All checks passed - OpenAI API is properly configured')
}

testOpenAI()
EOF

node test-openai-complete.js
rm test-openai-complete.js
```

#### 3. Test DALL-E 3 Image Generation (Optional - Uses Credits)

```bash
# WARNING: This costs approximately $0.04 per test
cat > test-dalle3.js << 'EOF'
require('dotenv').config()
const OpenAI = require('openai')

async function testDALLE3() {
  console.log('⚠️  WARNING: This test will cost approximately $0.04')
  console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...')
  await new Promise(resolve => setTimeout(resolve, 5000))

  console.log('')
  console.log('=== DALL-E 3 Image Generation Test ===')

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_ORG_ID
  })

  try {
    console.log('Generating test image...')
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: 'A simple white cube on a black background, minimal, test image',
      size: '1024x1024',
      quality: 'standard',
      n: 1
    })

    console.log('✅ DALL-E 3 image generation successful')
    console.log('Image URL:', response.data[0].url)
    console.log('Revised Prompt:', response.data[0].revised_prompt)
    console.log('')
    console.log('Cost: ~$0.04')

  } catch (error) {
    console.log('❌ DALL-E 3 generation failed:', error.message)

    if (error.status === 400) {
      console.log('🔧 DIAGNOSIS: Invalid request')
      console.log('FIX: Check prompt and parameters')
    } else if (error.status === 429) {
      console.log('🔧 DIAGNOSIS: Rate limit or insufficient quota')
      console.log('FIX: Add credits or wait for rate limit reset')
    }
  }
}

testDALLE3()
EOF

# Uncomment to run (costs $0.04)
# node test-dalle3.js
# rm test-dalle3.js

echo "DALL-E 3 test script created but not run (costs money)"
echo "To run: node test-dalle3.js"
```

#### 4. Check Usage and Billing

```bash
# Open usage dashboard
echo "Check your OpenAI usage and billing:"
echo "https://platform.openai.com/usage"
echo "https://platform.openai.com/account/billing"
```

---

## Resend Email Configuration & Debugging

### Common Resend Errors Decision Tree

```
Resend Error Occurred
│
├─ Error 401: Unauthorized
│  └─ DIAGNOSIS: Invalid API key
│     ├─ CHECK 1: Verify RESEND_API_KEY starts with "re_"
│     ├─ CHECK 2: Check key wasn't revoked
│     └─ FIX: Generate new API key from resend.com/api-keys
│
├─ Error 403: Domain not verified
│  └─ DIAGNOSIS: Sending domain not verified
│     ├─ CHECK 1: Check domain status at resend.com/domains
│     ├─ CHECK 2: Verify DNS records (SPF, DKIM, DMARC)
│     └─ FIX: Add DNS records and wait for verification
│
├─ Error 422: Validation error
│  └─ DIAGNOSIS: Invalid email parameters
│     ├─ CHECK 1: Verify EMAIL_FROM matches verified domain
│     ├─ CHECK 2: Check recipient email format
│     ├─ CHECK 3: Validate email content
│     └─ FIX: Correct invalid parameters
│
└─ Emails not arriving
   └─ DIAGNOSIS: DNS or spam filter issue
      ├─ CHECK 1: Verify SPF record published
      ├─ CHECK 2: Verify DKIM record published
      ├─ CHECK 3: Check spam folder
      ├─ CHECK 4: Verify DMARC policy
      └─ FIX: Complete DNS configuration
```

### Step-by-Step Resend Configuration

#### 1. Sign Up and Get API Key

```bash
echo "1. Sign up at https://resend.com"
echo "2. Go to https://resend.com/api-keys"
echo "3. Click 'Create API Key'"
echo "4. Copy the key (starts with re_)"
echo "5. Add to .env:"
echo "   RESEND_API_KEY=re_..."
```

#### 2. Configure Domain (Production)

```bash
echo "=== Resend Domain Configuration ==="
echo ""
echo "For production, you need to verify your domain:"
echo ""
echo "1. Go to https://resend.com/domains"
echo "2. Click 'Add Domain'"
echo "3. Enter your domain (e.g., plushifyme.com)"
echo "4. Add these DNS records to your domain provider:"
echo ""
echo "   SPF Record (TXT):"
echo "   Name: @ or domain.com"
echo "   Value: v=spf1 include:_spf.resend.com ~all"
echo ""
echo "   DKIM Record (TXT):"
echo "   Name: resend._domainkey"
echo "   Value: (provided by Resend)"
echo ""
echo "   DMARC Record (TXT) - Optional but recommended:"
echo "   Name: _dmarc"
echo "   Value: v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com"
echo ""
echo "5. Wait for DNS propagation (up to 48 hours)"
echo "6. Resend will verify automatically"
```

#### 3. Test DNS Records

```bash
# Test SPF record
source .env
DOMAIN=$(echo $EMAIL_FROM | cut -d@ -f2)

echo "=== DNS Records Check for $DOMAIN ==="
echo ""

# Check SPF
echo "1. SPF Record Check"
SPF=$(dig +short TXT $DOMAIN | grep "v=spf1")
if [[ $SPF == *"resend.com"* ]]; then
  echo "   ✅ SPF record found and includes Resend"
  echo "   Value: $SPF"
else
  echo "   ❌ SPF record missing or incorrect"
  echo "   FIX: Add TXT record: v=spf1 include:_spf.resend.com ~all"
fi
echo ""

# Check DKIM
echo "2. DKIM Record Check"
DKIM=$(dig +short TXT resend._domainkey.$DOMAIN)
if [ -n "$DKIM" ]; then
  echo "   ✅ DKIM record found"
  echo "   Value: ${DKIM:0:50}..."
else
  echo "   ❌ DKIM record not found"
  echo "   FIX: Add DKIM record provided by Resend"
fi
echo ""

# Check DMARC
echo "3. DMARC Record Check"
DMARC=$(dig +short TXT _dmarc.$DOMAIN)
if [ -n "$DMARC" ]; then
  echo "   ✅ DMARC record found"
  echo "   Value: $DMARC"
else
  echo "   ⚠️  DMARC record not found (optional but recommended)"
  echo "   FIX: Add TXT record: v=DMARC1; p=none; rua=mailto:dmarc@$DOMAIN"
fi
```

#### 4. Test Email Sending

```bash
# Test Resend API
cat > test-resend.js << 'EOF'
require('dotenv').config()

async function testResend() {
  console.log('=== Resend Email Test ===')
  console.log('')

  // Check environment variables
  const apiKey = process.env.RESEND_API_KEY
  const emailFrom = process.env.EMAIL_FROM

  if (!apiKey) {
    console.log('❌ RESEND_API_KEY not set in .env')
    console.log('FIX: Get API key from https://resend.com/api-keys')
    return
  }

  if (!emailFrom) {
    console.log('❌ EMAIL_FROM not set in .env')
    console.log('FIX: Set EMAIL_FROM=noreply@yourdomain.com')
    return
  }

  console.log(`✅ API Key: ${apiKey.substring(0, 8)}...`)
  console.log(`✅ From Email: ${emailFrom}`)
  console.log('')

  // For development, you can use Resend's test domain
  // For production, you need a verified domain
  const domain = emailFrom.split('@')[1]
  console.log('Domain:', domain)
  console.log('')

  console.log('To test sending:')
  console.log('1. Install Resend SDK: npm install resend')
  console.log('2. Use this code:')
  console.log('')
  console.log('const { Resend } = require("resend")')
  console.log('const resend = new Resend(process.env.RESEND_API_KEY)')
  console.log('')
  console.log('await resend.emails.send({')
  console.log('  from: process.env.EMAIL_FROM,')
  console.log('  to: "your-test-email@example.com",')
  console.log('  subject: "Test Email",')
  console.log('  html: "<p>Test email from PlushifyMe</p>"')
  console.log('})')
  console.log('')
  console.log('Note: For development, you can send to any email.')
  console.log('For production, verify your domain first.')
}

testResend()
EOF

node test-resend.js
rm test-resend.js
```

---

## Stripe Webhook Configuration & Debugging

### Common Stripe Errors Decision Tree

```
Stripe Error Occurred
│
├─ Error: Invalid API Key
│  └─ DIAGNOSIS: Wrong or revoked API key
│     ├─ CHECK 1: Verify key starts with sk_test_ or sk_live_
│     ├─ CHECK 2: Ensure using correct environment (test vs live)
│     └─ FIX: Get new key from dashboard.stripe.com/apikeys
│
├─ Webhook Error: Signature verification failed
│  └─ DIAGNOSIS: Wrong webhook secret or body modification
│     ├─ CHECK 1: Using correct secret (CLI vs Dashboard)
│     ├─ CHECK 2: Raw body not being modified by middleware
│     ├─ CHECK 3: Middleware order in Express/Next.js
│     └─ FIX: Use correct secret, ensure raw body handling
│
├─ Webhook Error: URL not reachable (404)
│  └─ DIAGNOSIS: Endpoint not deployed or wrong URL
│     ├─ CHECK 1: Verify webhook endpoint exists
│     ├─ CHECK 2: Check URL is correct in Stripe dashboard
│     ├─ CHECK 3: Ensure HTTPS (required for production)
│     └─ FIX: Deploy endpoint, update webhook URL
│
├─ Webhook Error: Timeout
│  └─ DIAGNOSIS: Endpoint taking too long to respond
│     ├─ CHECK 1: Check for slow database queries
│     ├─ CHECK 2: Look for external API calls in webhook
│     ├─ CHECK 3: Check for infinite loops
│     └─ FIX: Process webhooks asynchronously, return 200 quickly
│
└─ Payment Failed
   └─ DIAGNOSIS: Card or account issue
      ├─ CHECK 1: Use Stripe test cards for testing
      ├─ CHECK 2: Verify payment method requirements
      ├─ CHECK 3: Check for 3D Secure requirements
      └─ FIX: Use valid test cards or fix payment flow
```

### Step-by-Step Stripe Configuration

#### 1. Install Stripe CLI

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Verify installation
stripe --version
```

#### 2. Login to Stripe CLI

```bash
# Login to Stripe
stripe login

# This opens browser for authentication
# Follow prompts to authorize

# Verify login
stripe config --list
```

#### 3. Get API Keys

```bash
echo "Get your Stripe API keys:"
echo "1. Go to https://dashboard.stripe.com/test/apikeys"
echo "2. Copy 'Secret key' (starts with sk_test_)"
echo "3. Copy 'Publishable key' (starts with pk_test_)"
echo ""
echo "Add to .env:"
echo "STRIPE_SECRET_KEY=sk_test_..."
echo "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_..."
```

#### 4. Test Stripe Connection

```bash
# Test Stripe API
cat > test-stripe.js << 'EOF'
require('dotenv').config()

async function testStripe() {
  console.log('=== Stripe API Test ===')
  console.log('')

  const secretKey = process.env.STRIPE_SECRET_KEY
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

  // Check environment variables
  if (!secretKey) {
    console.log('❌ STRIPE_SECRET_KEY not set')
    console.log('FIX: Get from https://dashboard.stripe.com/test/apikeys')
    return
  }

  if (!secretKey.startsWith('sk_test_') && !secretKey.startsWith('sk_live_')) {
    console.log('❌ STRIPE_SECRET_KEY has invalid format')
    console.log('Expected: sk_test_... or sk_live_...')
    console.log(`Got: ${secretKey.substring(0, 10)}...`)
    return
  }

  const isTest = secretKey.startsWith('sk_test_')
  console.log(`✅ Secret Key: ${secretKey.substring(0, 12)}... (${isTest ? 'TEST' : 'LIVE'} mode)`)

  if (publishableKey) {
    console.log(`✅ Publishable Key: ${publishableKey.substring(0, 12)}...`)
  } else {
    console.log('⚠️  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY not set')
  }
  console.log('')

  console.log('To test Stripe API:')
  console.log('1. Install Stripe SDK: npm install stripe')
  console.log('2. Use this code:')
  console.log('')
  console.log('const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)')
  console.log('const customers = await stripe.customers.list({ limit: 1 })')
  console.log('console.log("Stripe API working:", customers)')
}

testStripe()
EOF

node test-stripe.js
rm test-stripe.js
```

#### 5. Set Up Webhook Endpoint (Local Testing)

```bash
# Forward webhooks to local server
echo "=== Stripe Webhook Local Testing ==="
echo ""
echo "1. Start your dev server:"
echo "   npm run dev"
echo ""
echo "2. In another terminal, forward webhooks:"
echo "   stripe listen --forward-to localhost:3000/api/webhooks/stripe"
echo ""
echo "3. Copy the webhook signing secret (whsec_...)"
echo "4. Add to .env:"
echo "   STRIPE_WEBHOOK_SECRET=whsec_..."
echo ""
echo "5. Test webhook:"
echo "   stripe trigger payment_intent.succeeded"
```

#### 6. Test Webhook Signature Verification

```bash
cat > test-webhook-signature.js << 'EOF'
require('dotenv').config()

function testWebhookSignature() {
  console.log('=== Stripe Webhook Signature Test ===')
  console.log('')

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.log('❌ STRIPE_WEBHOOK_SECRET not set')
    console.log('')
    console.log('For local testing:')
    console.log('1. Run: stripe listen --forward-to localhost:3000/api/webhooks/stripe')
    console.log('2. Copy the webhook signing secret (whsec_...)')
    console.log('3. Add to .env: STRIPE_WEBHOOK_SECRET=whsec_...')
    console.log('')
    console.log('For production:')
    console.log('1. Go to https://dashboard.stripe.com/webhooks')
    console.log('2. Create webhook endpoint')
    console.log('3. Copy the signing secret')
    return
  }

  if (!webhookSecret.startsWith('whsec_')) {
    console.log('❌ STRIPE_WEBHOOK_SECRET has invalid format')
    console.log('Expected: whsec_...')
    console.log(`Got: ${webhookSecret.substring(0, 10)}...`)
    return
  }

  console.log(`✅ Webhook Secret: ${webhookSecret.substring(0, 12)}...`)
  console.log('')
  console.log('Webhook endpoint ready for signature verification')
  console.log('')
  console.log('IMPORTANT: In Next.js API route, ensure:')
  console.log('1. Export config: export const config = { api: { bodyParser: false } }')
  console.log('2. Use raw body for verification')
  console.log('3. Verify signature before processing')
}

testWebhookSignature()
EOF

node test-webhook-signature.js
rm test-webhook-signature.js
```

#### 7. Test Cards Reference

```bash
cat << 'EOF'
=== Stripe Test Cards ===

SUCCESS SCENARIOS:
Card Number: 4242 4242 4242 4242
Expiry: Any future date (e.g., 12/34)
CVC: Any 3 digits
ZIP: Any 5 digits
Result: Payment succeeds

FAILURE SCENARIOS:
Card: 4000 0000 0000 0002
Result: Card declined

Card: 4000 0000 0000 9995
Result: Insufficient funds

3D SECURE:
Card: 4000 0025 0000 3155
Result: Requires 3D Secure authentication

Full list: https://stripe.com/docs/testing#cards
EOF
```

---

## PostgreSQL Database Debugging

### Common PostgreSQL Errors Decision Tree

```
PostgreSQL Error Occurred
│
├─ Error: Can't reach database server
│  └─ DIAGNOSIS: Database not running or wrong connection
│     ├─ CHECK 1: Docker container running: docker ps | grep postgres
│     ├─ CHECK 2: Port 5432 not blocked by firewall
│     ├─ CHECK 3: DATABASE_URL has correct host/port
│     └─ FIX: Start container: npm run db:start
│
├─ Error: Authentication failed
│  └─ DIAGNOSIS: Wrong username/password
│     ├─ CHECK 1: Verify credentials in DATABASE_URL
│     ├─ CHECK 2: Check docker-compose.yml matches .env
│     └─ FIX: Update DATABASE_URL or recreate container
│
├─ Error: Database does not exist
│  └─ DIAGNOSIS: Database not created
│     ├─ CHECK 1: Run migrations: npm run db:migrate
│     ├─ CHECK 2: Check database name in DATABASE_URL
│     └─ FIX: Create database or run migrations
│
└─ Error: Migration failed
   └─ DIAGNOSIS: Schema issue or connection problem
      ├─ CHECK 1: Check migration files in prisma/migrations
      ├─ CHECK 2: Verify database is empty or compatible
      └─ FIX: Reset database: npm run db:reset && npm run db:migrate
```

### Step-by-Step PostgreSQL Debugging

```bash
# Comprehensive PostgreSQL diagnostic
cat > test-postgres.sh << 'EOF'
#!/bin/bash
source .env

echo "=== PostgreSQL Complete Diagnostic ==="
echo "Date: $(date)"
echo ""

# Test 1: Docker installation
echo "1. Docker Check"
if command -v docker &> /dev/null; then
  echo "   ✅ Docker installed: $(docker --version)"
else
  echo "   ❌ Docker not installed"
  echo "   FIX: Install Docker Desktop from docker.com"
  exit 1
fi
echo ""

# Test 2: Docker running
echo "2. Docker Daemon Check"
if docker info &>/dev/null; then
  echo "   ✅ Docker daemon running"
else
  echo "   ❌ Docker daemon not running"
  echo "   FIX: Start Docker Desktop"
  exit 1
fi
echo ""

# Test 3: PostgreSQL container
echo "3. PostgreSQL Container Check"
CONTAINER=$(docker ps -a --filter "name=plushifyme-postgres" --format "{{.Names}}:{{.Status}}")
if [ -n "$CONTAINER" ]; then
  echo "   ✅ Container exists: $CONTAINER"
  if docker ps | grep -q plushifyme-postgres; then
    echo "   ✅ Container is running"
  else
    echo "   ❌ Container is stopped"
    echo "   FIX: Start container: npm run db:start"
    exit 1
  fi
else
  echo "   ❌ PostgreSQL container not found"
  echo "   FIX: Create container: npm run db:start"
  exit 1
fi
echo ""

# Test 4: PostgreSQL accepting connections
echo "4. PostgreSQL Connection Check"
if docker exec plushifyme-postgres pg_isready -U plushifyme 2>/dev/null | grep -q "accepting connections"; then
  echo "   ✅ PostgreSQL accepting connections"
else
  echo "   ❌ PostgreSQL not responding"
  echo "   FIX: Restart container: docker restart plushifyme-postgres"
  exit 1
fi
echo ""

# Test 5: Database exists
echo "5. Database Existence Check"
DB_EXISTS=$(docker exec plushifyme-postgres psql -U plushifyme -lqt 2>/dev/null | cut -d \| -f 1 | grep -w plushifyme | wc -l)
if [ "$DB_EXISTS" -gt 0 ]; then
  echo "   ✅ Database 'plushifyme' exists"
else
  echo "   ❌ Database 'plushifyme' does not exist"
  echo "   FIX: Run migrations: npm run db:migrate"
fi
echo ""

# Test 6: Connection from Node.js
echo "6. Connection String Test"
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.\$connect()
  .then(() => {
    console.log('   ✅ Prisma connection successful');
    return prisma.\$disconnect();
  })
  .catch(err => {
    console.log('   ❌ Prisma connection failed:', err.message);
    process.exit(1);
  });
" 2>&1
echo ""

# Test 7: Check tables
echo "7. Schema Check"
TABLES=$(docker exec plushifyme-postgres psql -U plushifyme -d plushifyme -c "\dt" 2>/dev/null | grep "public" | wc -l)
if [ "$TABLES" -gt 0 ]; then
  echo "   ✅ Database has $TABLES table(s)"
  docker exec plushifyme-postgres psql -U plushifyme -d plushifyme -c "\dt" 2>/dev/null | grep "public" | while read line; do
    echo "      $line"
  done
else
  echo "   ⚠️  Database has no tables"
  echo "   FIX: Run migrations: npm run db:migrate"
fi
echo ""

echo "=== PostgreSQL Diagnostic Complete ==="
EOF

chmod +x test-postgres.sh
./test-postgres.sh
rm test-postgres.sh
```

---

## Better Auth Configuration & Debugging

### Common Better Auth Errors Decision Tree

```
Better Auth Error Occurred
│
├─ Error: Invalid secret
│  └─ DIAGNOSIS: BETTER_AUTH_SECRET not set or wrong format
│     ├─ CHECK 1: Verify BETTER_AUTH_SECRET is set in .env
│     ├─ CHECK 2: Ensure it's a strong random string (32+ bytes)
│     └─ FIX: Generate with: openssl rand -base64 32
│
├─ Error: Session not found / Invalid session
│  └─ DIAGNOSIS: Session expired or cookie issue
│     ├─ CHECK 1: Verify session expiry settings in lib/auth.ts
│     ├─ CHECK 2: Check cookie settings (secure, sameSite)
│     ├─ CHECK 3: Clear browser cookies and retry
│     └─ FIX: Regenerate session or adjust settings
│
└─ Error: OAuth callback failed
   └─ DIAGNOSIS: OAuth provider misconfiguration
      ├─ CHECK 1: Verify callback URL in provider dashboard
      ├─ CHECK 2: Check client ID/secret are correct
      ├─ CHECK 3: Ensure BETTER_AUTH_URL matches deployment URL
      └─ FIX: Update OAuth provider settings
```

### Step-by-Step Better Auth Debugging

```bash
# Test Better Auth configuration
cat > test-better-auth.sh << 'EOF'
#!/bin/bash
source .env

echo "=== Better Auth Configuration Check ==="
echo ""

# Check 1: Secret exists
echo "1. Auth Secret Check"
if [ -n "$BETTER_AUTH_SECRET" ]; then
  LENGTH=${#BETTER_AUTH_SECRET}
  echo "   ✅ BETTER_AUTH_SECRET is set ($LENGTH characters)"

  if [ $LENGTH -lt 32 ]; then
    echo "   ⚠️  Secret is short (recommended: 44+ characters)"
    echo "   FIX: Generate new secret: openssl rand -base64 32"
  else
    echo "   ✅ Secret length is good"
  fi
else
  echo "   ❌ BETTER_AUTH_SECRET not set"
  echo "   FIX: Generate and add to .env: openssl rand -base64 32"
fi
echo ""

# Check 2: Auth URL
echo "2. Auth URL Check"
if [ -n "$BETTER_AUTH_URL" ]; then
  echo "   ✅ BETTER_AUTH_URL is set: $BETTER_AUTH_URL"

  if [[ $BETTER_AUTH_URL =~ ^https?:// ]]; then
    echo "   ✅ URL format valid"
  else
    echo "   ⚠️  URL should start with http:// or https://"
  fi
else
  echo "   ❌ BETTER_AUTH_URL not set"
  echo "   FIX: Add to .env: BETTER_AUTH_URL=http://localhost:3000"
fi
echo ""

# Check 3: Database connection (required for sessions)
echo "3. Database Check (for session storage)"
if [ -n "$DATABASE_URL" ]; then
  echo "   ✅ DATABASE_URL is set"
else
  echo "   ❌ DATABASE_URL not set"
  echo "   FIX: Better Auth requires database for session storage"
fi
echo ""

echo "=== Better Auth Check Complete ==="
EOF

chmod +x test-better-auth.sh
./test-better-auth.sh
rm test-better-auth.sh
```

---

## Automated Test-Based Diagnostics

### Run Unit Tests with Diagnostic Output

```bash
# Run tests with detailed output
npm run test:unit -- --verbose --no-coverage 2>&1 | tee test-output.txt

# Analyze test results
cat > analyze-tests.sh << 'EOF'
#!/bin/bash

echo "=== Test Results Analysis ==="
echo ""

PASSING=$(grep "PASS" test-output.txt | wc -l)
FAILING=$(grep "FAIL" test-output.txt | wc -l)
TOTAL_TESTS=$(grep "Tests:" test-output.txt | awk '{print $2}')

echo "Test Suites:"
echo "  ✅ Passed: $PASSING"
echo "  ❌ Failed: $FAILING"
echo ""

if [ $FAILING -gt 0 ]; then
  echo "Failed Tests:"
  grep "●" test-output.txt
  echo ""
  echo "Common Fixes:"
  echo "1. Check mock configurations in jest.setup.js"
  echo "2. Verify environment variables in test environment"
  echo "3. Ensure all dependencies are installed: npm install"
fi

rm test-output.txt
EOF

chmod +x analyze-tests.sh
./analyze-tests.sh
rm analyze-tests.sh
```

### Integration Test Diagnostics

```bash
# Run integration tests and diagnose issues
cat > diagnose-integration-tests.sh << 'EOF'
#!/bin/bash

echo "=== Integration Test Diagnostic ==="
echo ""

# Check 1: Test database
echo "1. Test Database Check"
if docker exec plushifyme-postgres psql -U plushifyme -lqt 2>/dev/null | grep -q "plushifyme_test"; then
  echo "   ✅ Test database exists"
else
  echo "   ❌ Test database missing"
  echo "   FIX: Create test database:"
  echo "   docker exec plushifyme-postgres createdb -U plushifyme plushifyme_test"
fi
echo ""

# Check 2: Run migrations on test database
echo "2. Test Database Migrations"
DATABASE_URL="postgresql://plushifyme:plushifyme_dev_password@localhost:5432/plushifyme_test" \
  npx prisma migrate deploy 2>&1 | grep -q "applied"
if [ $? -eq 0 ]; then
  echo "   ✅ Test database migrations applied"
else
  echo "   ⚠️  Test database may need migrations"
fi
echo ""

# Check 3: Run integration tests
echo "3. Running Integration Tests"
npm run test:integration 2>&1 | head -50
echo ""

echo "If integration tests fail:"
echo "1. Check API route implementations"
echo "2. Verify better-auth session mocking"
echo "3. Check database connection in test environment"
echo "4. Review jest.setup.js for proper mocks"
EOF

chmod +x diagnose-integration-tests.sh
./diagnose-integration-tests.sh
rm diagnose-integration-tests.sh
```

---

## Complete System Diagnostic Script

```bash
# Run all diagnostics in one command
cat > complete-diagnostic.sh << 'EOF'
#!/bin/bash

echo "========================================="
echo "  PlushifyMe Complete System Diagnostic"
echo "========================================="
echo "Date: $(date)"
echo ""

# Load environment
if [ -f .env ]; then
  source .env
  echo "✅ .env file loaded"
else
  echo "❌ .env file not found"
  exit 1
fi
echo ""

# 1. Environment Variables
echo "--- 1. ENVIRONMENT VARIABLES ---"
for var in DATABASE_URL BETTER_AUTH_SECRET OPENAI_API_KEY AWS_ACCESS_KEY_ID AWS_S3_BUCKET EMAIL_FROM; do
  if [ -n "${!var}" ]; then
    echo "✅ $var"
  else
    echo "❌ $var (not set)"
  fi
done
echo ""

# 2. Docker & Database
echo "--- 2. DOCKER & DATABASE ---"
if docker ps | grep -q plushifyme-postgres; then
  echo "✅ PostgreSQL container running"
  if docker exec plushifyme-postgres pg_isready -U plushifyme 2>/dev/null | grep -q "accepting"; then
    echo "✅ PostgreSQL accepting connections"
  else
    echo "❌ PostgreSQL not responding"
  fi
else
  echo "❌ PostgreSQL container not running"
fi
echo ""

# 3. AWS S3
echo "--- 3. AWS S3 ---"
if command -v aws &> /dev/null; then
  echo "✅ AWS CLI installed"
  if aws sts get-caller-identity &>/dev/null; then
    echo "✅ AWS credentials valid"
    if aws s3 ls "s3://$AWS_S3_BUCKET" &>/dev/null; then
      echo "✅ S3 bucket accessible"
    else
      echo "❌ S3 bucket not accessible"
    fi
  else
    echo "❌ AWS credentials invalid"
  fi
else
  echo "⚠️  AWS CLI not installed"
fi
echo ""

# 4. Node.js Environment
echo "--- 4. NODE.JS ENVIRONMENT ---"
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
if [ -d node_modules ]; then
  echo "✅ node_modules installed"
else
  echo "❌ node_modules missing - run: npm install"
fi
echo ""

# 5. Unit Tests
echo "--- 5. UNIT TESTS ---"
npm run test:unit --silent 2>&1 | grep -E "(PASS|FAIL|Tests:)"
echo ""

echo "========================================="
echo "  Diagnostic Complete"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Fix any ❌ items above"
echo "2. Run detailed diagnostics for specific services"
echo "3. See docs/CONFIGURATION_VERIFICATION_DEBUG.md for detailed troubleshooting"
EOF

chmod +x complete-diagnostic.sh
./complete-diagnostic.sh
```

---

## Quick Reference Commands

### Daily Development Checklist

```bash
# Quick pre-development check
source .env && \
docker ps | grep postgres && \
echo "✅ Database running" && \
npm run test:unit --silent && \
echo "✅ All systems ready"
```

### Emergency Reset

```bash
# Nuclear option: reset everything
docker-compose down -v
rm -rf node_modules package-lock.json
npm install
npm run db:start
sleep 5
npm run db:migrate
npm run test:unit
```

### Service Status URLs

```bash
echo "Check service status:"
echo "OpenAI: https://status.openai.com"
echo "AWS: https://health.aws.amazon.com/health/status"
echo "Stripe: https://status.stripe.com"
echo "Resend: https://resend.com/status"
```

---

## Troubleshooting Decision Tree

```
Application Issue?
│
├─ Can't start dev server
│  ├─ Check: npm install completed?
│  ├─ Check: Port 3000 in use?
│  └─ Fix: lsof -ti:3000 | xargs kill -9
│
├─ Authentication not working
│  ├─ Check: BETTER_AUTH_SECRET set?
│  ├─ Check: Database running?
│  └─ Fix: Regenerate secret, restart database
│
├─ File upload failing
│  ├─ Check: AWS credentials valid?
│  ├─ Check: S3 CORS configured?
│  └─ Fix: Run S3 diagnostic, apply CORS
│
├─ Image generation failing
│  ├─ Check: OpenAI API key valid?
│  ├─ Check: Billing configured?
│  └─ Fix: Run OpenAI diagnostic, check billing
│
└─ Tests failing
   ├─ Check: All mocks in jest.setup.js?
   ├─ Check: Database running?
   └─ Fix: Run test diagnostic, fix mocks
```

---

**Last Updated:** November 19, 2025
**Version:** 1.0
**Maintainer:** PlushifyMe Development Team
