# App Deployment Using Terraform & GitHub Actions

A Node.js Express application with automated CI/CD pipeline deploying to AWS EC2 instances using Terraform for infrastructure provisioning and GitHub Actions for continuous deployment.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Local Development](#local-development)
- [Infrastructure Setup (Terraform)](#infrastructure-setup-terraform)
- [GitHub Actions Configuration](#github-actions-configuration)
- [Deployment Process](#deployment-process)
- [Accessing Your Application](#accessing-your-application)
- [Troubleshooting](#troubleshooting)

## 🎯 Project Overview 

This project demonstrates a complete DevOps workflow:

1. **Infrastructure as Code**: Terraform provisions EC2 instances with VPC, security groups, and networking
2. **CI/CD Pipeline**: GitHub Actions automatically deploys code to DEV and PROD environments
3. **Process Management**: PM2 manages the Node.js application lifecycle on EC2
4. **Health Monitoring**: Built-in health check endpoint for monitoring

### Architecture

- **DEV Environment**: Deploys on push to `dev` branch → EC2 instance at `/home/ubuntu/app-dev`
- **PROD Environment**: Deploys on push to `main` branch → EC2 instance at `/home/ubuntu/app-prod`

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)
- **Terraform** (v1.0+)
- **AWS CLI** configured with credentials
- **Git**
- **SSH key pair** (for EC2 access)
- **GitHub account** with repository access

## 📁 Project Structure

```
.
├── app/
│   ├── index.js          # Express application entry point
│   ├── package.json      # Node.js dependencies
│   └── package-lock.json # Dependency lock file
├── terraform/
│   └── main.tf           # Terraform infrastructure configuration
├── .github/
│   └── workflows/
│       ├── deploy-dev.yaml   # CI/CD workflow for DEV environment
│       └── deploy-prod.yaml  # CI/CD workflow for PROD environment
└── README.md             # This file
```

## 💻 Local Development

### 1. Clone the Repository

```bash
git clone https://github.com/anupsharma329/app_deployment_using_terraform.git
cd app_deployment_using_terraform
```

### 2. Install Dependencies

```bash
cd app
npm install
```

### 3. Run the Application Locally

```bash
# Using Node.js directly
node index.js

# Or using npm script
npm start

# Or using nodemon for auto-reload (if installed globally)
nodemon index.js
```

The application will start on `http://localhost:3000`

### 4. Test Endpoints

- **Home Page**: `http://localhost:3000/`
- **Health Check**: `http://localhost:3000/health`

## 🏗️ Infrastructure Setup (Terraform)

### Step 1: Configure AWS Credentials

```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Enter default region (e.g., us-east-1)
# Enter default output format (json)
```

### Step 2: Prepare SSH Key

Ensure you have an SSH key pair:

```bash
# Check if you have an existing key
ls -la ~/.ssh/id_rsa.pub

# If not, generate one
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

### Step 3: Initialize Terraform

```bash
cd terraform
terraform init
```

### Step 4: Review and Plan

```bash
# Review what will be created
terraform plan
```

### Step 5: Apply Infrastructure

```bash
# Create all AWS resources
terraform apply

# Type 'yes' when prompted
```

This will create:
- VPC with public subnet
- Internet Gateway
- Security Group (SSH port 22, HTTP port 80, App port 3000)
- EC2 instance with Node.js 18 and PM2 pre-installed
- SSH key pair

### Step 6: Get EC2 Instance Details

After `terraform apply` completes, note the outputs:

```bash
terraform output ec2_public_ip
terraform output ec2_instance_id
```

**Save these IPs** - you'll need them for GitHub Actions secrets.

### Step 7: Verify SSH Access

```bash
# Test SSH connection to your EC2 instance
ssh ubuntu@<EC2_PUBLIC_IP>

# If successful, you should see the EC2 prompt
```

## 🔐 GitHub Actions Configuration

### Required Secrets

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add the following secrets: 

| Secret Name | Description | Example Value | 
|------------|-------------|---------------|
| `EC2_HOST_DEV` | Public IP of DEV EC2 instance | `3.85.44.246` |
| `EC2_HOST_PROD` | Public IP of PROD EC2 instance | `54.197.119.18` |
| `EC2_USER` | SSH username (usually `ubuntu`) | `ubuntu` |
| `EC2_SSH_KEY` | Private SSH key content | Content of `~/.ssh/id_rsa` |

### How to Get Your Private Key

```bash
# Display your private key (copy the entire output)
cat ~/.ssh/id_rsa

# Copy everything including:
# -----BEGIN OPENSSH PRIVATE KEY-----
# ... (all lines)
# -----END OPENSSH PRIVATE KEY-----
```

**⚠️ Security Note**: Never commit your private key to the repository. Only add it as a GitHub secret.

## 🚀 Deployment Process

### DEV Environment Deployment

1. **Create/switch to dev branch**:
   ```bash
   git checkout -b dev
   # or if branch exists:
   git checkout dev
   ```

2. **Make your changes** and commit:
   ```bash
   git add .
   git commit -m "Your commit message"
   ```

3. **Push to dev branch**:
   ```bash
   git push origin dev
   ```

4. **GitHub Actions will automatically**:
   - Install dependencies
   - Copy files to `/home/ubuntu/app-dev` on DEV EC2
   - Run `npm install` on the server
   - Start/restart the app with PM2 as `app-dev`

### PROD Environment Deployment

1. **Switch to main branch**:
   ```bash
   git checkout main
   ```

2. **Merge changes from dev** (if needed):
   ```bash
   git merge dev
   ```

3. **Commit and push**:
   ```bash
   git add .
   git commit -m "Deploy to production"
   git push origin main
   ```

4. **GitHub Actions will automatically**:
   - Install dependencies
   - Copy files to `/home/ubuntu/app-prod` on PROD EC2
   - Run `npm install` on the server
   - Start/restart the app with PM2 as `app-prod`

## 🌐 Accessing Your Application

### DEV Environment

- **URL**: `http://<DEV_EC2_IP>:3000/`
- **Health Check**: `http://<DEV_EC2_IP>:3000/health`
- **Example**: `http://3.85.44.246:3000/`

### PROD Environment

- **URL**: `http://<PROD_EC2_IP>:3000/`
- **Health Check**: `http://<PROD_EC2_IP>:3000/health`
- **Example**: `http://54.197.119.18:3000/`

### Verify Deployment

```bash
# SSH into your EC2 instance
ssh ubuntu@<EC2_IP>

# Check PM2 status
pm2 list

# View application logs
pm2 logs app-dev    # for DEV
pm2 logs app-prod   # for PROD

# Check if app is running
curl http://localhost:3000/health
```

## 🔧 Manual Deployment (If Needed)

If you need to manually deploy or troubleshoot:

```bash
# SSH into EC2
ssh ubuntu@<EC2_IP>

# Navigate to app directory
cd /home/ubuntu/app-dev    # or app-prod

# Install/update dependencies
npm install

# Start/restart with PM2
pm2 restart app-dev || pm2 start index.js --name "app-dev"
# or for prod:
pm2 restart app-prod || pm2 start index.js --name "app-prod"

# Check status
pm2 status
pm2 logs
```

## 🛠️ Troubleshooting

### GitHub Actions: SSH Connection Timeout

**Error**: `dial tcp ***:22: i/o timeout`

**Solutions**:
1. Verify Security Group allows SSH (port 22) from `0.0.0.0/0`
2. Check EC2 instance has a public IP
3. Ensure subnet route table has Internet Gateway route
4. Test SSH manually: `ssh ubuntu@<EC2_IP>`

### GitHub Actions: Script Not Found

**Error**: `Script not found: /home/ubuntu/app-dev/index.js`

**Solution**: Ensure `target` in workflow matches the directory where you `cd`:
- `target: "/home/ubuntu/app-dev"` for DEV
- `target: "/home/ubuntu/app-prod"` for PROD

### PM2 Process Not Starting

```bash
# Check PM2 logs
pm2 logs

# Restart PM2 daemon
pm2 kill
pm2 resurrect

# Or start fresh
pm2 start index.js --name "app-dev"
```

### Application Not Accessible

1. **Check Security Group**: Ensure port 3000 is open
2. **Check PM2**: `pm2 list` - process should be `online`
3. **Check logs**: `pm2 logs app-dev`
4. **Test locally on EC2**: `curl http://localhost:3000`

### Terraform Apply Fails

- Verify AWS credentials: `aws sts get-caller-identity`
- Check region matches in `terraform/main.tf`
- Ensure SSH public key exists at `~/.ssh/id_rsa.pub`

## 📝 Environment Variables

The application uses `NODE_ENV` to determine the environment:

- `NODE_ENV=production` → Shows "PROD" environment
- Default → Shows "DEV" environment

Set in GitHub Actions workflows or PM2 commands if needed.

## 🧹 Cleanup

To destroy all infrastructure:

```bash
cd terraform
terraform destroy
```

**⚠️ Warning**: This will delete all AWS resources created by Terraform.

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)

## 📄 License

ISC

---

**Happy Deploying! 🚀**
