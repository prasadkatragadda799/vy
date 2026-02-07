# Google Sheets Setup for Vibhuti Yoga

This document explains how to set up Google Sheets to receive both **Course Registrations** and **Donation Submissions** from the Vibhuti Yoga website.

## 📋 Overview

The website now supports two submission types:
1. **Course Registrations** - When users register for yoga classes
2. **Donation Submissions** - When donors submit their donation details via Google Sheets

Both use the same Google Apps Script endpoint but are stored in different sheets.

---

## 🔧 Google Apps Script Code

Copy and paste this code into your Google Apps Script (Extensions → Apps Script):

```javascript
// Vibhuti Yoga - Web Form Handler
// Handles both Course Registrations and Donation Submissions

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const data = JSON.parse(e.postData.contents);
    
    // Create timestamp
    const timestamp = new Date();
    const formattedDate = Utilities.formatDate(timestamp, "Asia/Kolkata", "dd-MMM-yyyy HH:mm:ss");
    
    // Check if this is a donation or registration
    if (data.type === 'donation') {
      // Handle Donation Submission
      let donationSheet = ss.getSheetByName('Donations');
      
      // Create sheet if it doesn't exist
      if (!donationSheet) {
        donationSheet = ss.insertSheet('Donations');
        // Add headers
        donationSheet.appendRow([
          'Timestamp',
          'Name',
          'Phone',
          'Amount (₹)',
          'Transaction ID',
          'Status'
        ]);
        // Format header row
        donationSheet.getRange(1, 1, 1, 6).setFontWeight('bold').setBackground('#4CAF50').setFontColor('white');
      }
      
      // Add the donation data
      donationSheet.appendRow([
        formattedDate,
        data.name || '',
        data.phone || '',
        data.amount || '',
        data.transactionId || 'Not provided',
        'Pending Verification'
      ]);
      
    } else {
      // Handle Course Registration (default)
      let regSheet = ss.getSheetByName('Registrations');
      
      // Create sheet if it doesn't exist
      if (!regSheet) {
        regSheet = ss.insertSheet('Registrations');
        // Add headers
        regSheet.appendRow([
          'Timestamp',
          'Name',
          'Phone',
          'Email',
          'Course',
          'Preferred Time',
          'Message',
          'Status'
        ]);
        // Format header row
        regSheet.getRange(1, 1, 1, 8).setFontWeight('bold').setBackground('#d4a574').setFontColor('white');
      }
      
      // Add the registration data
      regSheet.appendRow([
        formattedDate,
        data.name || '',
        data.phone || '',
        data.email || '',
        data.classSelected || '',
        data.preferredTime || '',
        data.message || '',
        'New'
      ]);
    }
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Log error and return failure response
    console.error('Error:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// GET handler for testing
function doGet(e) {
  return ContentService
    .createTextOutput('Vibhuti Yoga Form Handler is running!')
    .setMimeType(ContentService.MimeType.TEXT);
}
```

---

## 📝 Setup Instructions

### Step 1: Open Google Sheets
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet or open your existing one
3. Name it something like "Vibhuti Yoga - Submissions"

### Step 2: Open Apps Script
1. Click on **Extensions** → **Apps Script**
2. Delete any existing code
3. Paste the code from above
4. Click **Save** (Ctrl+S or Cmd+S)

### Step 3: Deploy as Web App
1. Click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Select **Web app**
4. Configure:
   - **Description**: "Vibhuti Yoga Form Handler"
   - **Execute as**: "Me"
   - **Who has access**: "Anyone"
5. Click **Deploy**
6. **Authorize** the script when prompted
7. Copy the **Web app URL**

### Step 4: Update Website
The website is already configured with your Apps Script URL:
```javascript
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbzvtNAw6N4wdH-NBM-LZW6_xiWFW58-XFmsKugNifz66vMtqS4VWPRyEcN4SnK7V4Pctw/exec';
```
✅ **No changes needed** - this is already set in your `index.html` file.

---

## 📊 Sheet Structure

### Registrations Sheet
| Timestamp | Name | Phone | Email | Course | Preferred Time | Message | Status |
|-----------|------|-------|-------|--------|----------------|---------|--------|
| 07-Feb-2026 15:30:00 | John Doe | 9876543210 | john@email.com | Mind Power - 1st Level | Morning (6 AM - 9 AM) | I'm a beginner | New |

### Donations Sheet
| Timestamp | Name | Phone | Amount (₹) | Transaction ID | Status |
|-----------|------|-------|------------|----------------|--------|
| 07-Feb-2026 15:30:00 | Jane Doe | 9876543210 | 1000 | TXN123456789 | Pending Verification |

---

## ✅ Testing

1. After deploying, visit your website
2. Go to the **Donate** section
3. Fill in the donation form
4. Select **Google Sheets** as the submission method
5. Click **Submit**
6. Check your Google Sheet - a new row should appear in the "Donations" sheet!

---

## 🔄 Updating the Script

If you need to make changes to the Apps Script:
1. Edit the code in Apps Script
2. Click **Deploy** → **Manage deployments**
3. Click the pencil icon ✏️ to edit
4. Select **New version**
5. Click **Deploy**

---

## 🆘 Troubleshooting

### "Data not appearing in sheet"
- Ensure the Web app URL is correct in your website code
- Check that the script is deployed with "Anyone" access
- Open Apps Script and check the Execution log for errors

### "Error saving"
- Verify the script has permission to edit the spreadsheet
- Try redeploying the web app

### "CORS errors in console"
- This is expected behavior with `no-cors` mode
- The data should still be saved despite console errors

---

## 📞 Support

If you need help, contact the development team.
