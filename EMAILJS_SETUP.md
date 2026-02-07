# EmailJS Setup Guide

Follow these steps to receive messages via email:

## Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account

## Step 2: Add Email Service
1. Go to **Email Services** in your EmailJS dashboard
2. Click **Add New Service**
3. Choose **Gmail** (or your preferred email provider)
4. Connect your email account
5. Copy the **Service ID** (e.g., `service_abc123`) service_pehl2lh

## Step 3: Create Email Template
1. Go to **Email Templates** in your dashboard
2. Click **Create New Template**
3. Set up your template with these variables:
   - `{{message}}` - The user's message
   - `{{timestamp}}` - When the message was sent
   - `{{from_name}}` - Sender name (set as "Your Valentine")
4. Example template content:
   ```
   New Valentine Message!
   
   Time: {{timestamp}}
   From: {{from_name}}
   
   Message:
   {{message}}
   ```
5. Copy the **Template ID** (e.g., `template_xyz789`) template_trc3bb9

## Step 4: Get Public Key
1. Go to **Account** → **General**
2. Copy your **Public Key** (e.g., `AbCdEfGh123456789`) LBBZmTNuRmQBnnIJe

## Step 5: Update Your Code
Open these files and replace the placeholders:

### File: `src/index.html`
Replace `YOUR_PUBLIC_KEY` with your actual public key:
```javascript
publicKey: "YOUR_PUBLIC_KEY",  // Replace this
```

### File: `src/app/app.ts`
Replace these in the `onMessageSubmit` function:
```typescript
'YOUR_SERVICE_ID',  // Replace with your Service ID
'YOUR_TEMPLATE_ID', // Replace with your Template ID
```

## Step 6: Test
1. Run your app: `npm start`
2. Click "Yes" to the Valentine question
3. Submit a test message
4. Check your email!

## Free Tier Limits
- 200 emails per month
- Sufficient for personal use

---

**That's it!** Every message will now be sent directly to your email. 💌
