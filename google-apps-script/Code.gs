/**
 * Faithful Woodworker — Google Apps Script
 *
 * Handles order form submissions, admin data retrieval, and email notifications.
 *
 * SETUP:
 * 1. Create a Google Sheet with two sheets:
 *    - "Orders" with columns: id, timestamp, name, email, phone, projectType,
 *      dimensions, style, colorPreference, budget, description, status, notes
 *    - "Config" with key/value pairs (column A = key, column B = value)
 * 2. In Apps Script (Extensions → Apps Script), paste this code
 * 3. Set Script Properties (Project Settings → Script Properties):
 *    - ADMIN_KEY: must match adminPassword in config.json
 *    - NOTIFICATION_EMAIL: austinhowenstine@gmail.com
 * 4. Deploy as web app:
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the deployment URL to config.json → appsScriptUrl
 */

const ORDERS_SHEET = 'Orders';
const CONFIG_SHEET = 'Config';

function getSheet(name) {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
}

function generateId() {
  return 'ORD-' + Date.now().toString(36).toUpperCase();
}

// --- HTTP Handlers ---

function doGet(e) {
  const action = e.parameter.action;

  if (action === 'admin') {
    return handleAdmin(e);
  }

  return jsonResponse({ error: 'Unknown action' });
}

function doPost(e) {
  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch {
    return jsonResponse({ error: 'Invalid JSON' });
  }

  if (data.action === 'submitOrder') {
    return handleSubmitOrder(data);
  }

  if (data.action === 'updateStatus') {
    return handleUpdateStatus(data);
  }

  return jsonResponse({ error: 'Unknown action' });
}

// --- Order Submission ---

function handleSubmitOrder(data) {
  const sheet = getSheet(ORDERS_SHEET);
  const id = generateId();
  const timestamp = new Date().toISOString();

  const row = [
    id,
    timestamp,
    data.name || '',
    data.email || '',
    data.phone || '',
    data.projectType || '',
    data.dimensions || '',
    data.style || '',
    data.colorPreference || '',
    data.budget || '',
    data.description || '',
    'new',  // status
    '',     // notes
  ];

  sheet.appendRow(row);

  // Send email notification
  sendOrderNotification(data, id);

  return jsonResponse({ success: true, id: id });
}

function sendOrderNotification(data, orderId) {
  const props = PropertiesService.getScriptProperties();
  const email = props.getProperty('NOTIFICATION_EMAIL');

  if (!email) return;

  const subject = `New Order Request: ${data.projectType || 'Custom Project'} — ${data.name}`;

  const body = `
New order received on Faithful Woodworker!

Order ID: ${orderId}
Date: ${new Date().toLocaleString()}

--- Customer Info ---
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}

--- Project Details ---
Type: ${data.projectType || 'Not specified'}
Style: ${data.style || 'Not specified'}
Dimensions: ${data.dimensions || 'Not specified'}
Color/Wood: ${data.colorPreference || 'Not specified'}
Budget: ${data.budget || 'Not specified'}

--- Description ---
${data.description || 'No description provided'}

---
View all orders in your admin dashboard or Google Sheet.
  `.trim();

  MailApp.sendEmail({
    to: email,
    subject: subject,
    body: body,
  });
}

// --- Admin ---

function handleAdmin(e) {
  const props = PropertiesService.getScriptProperties();
  const adminKey = props.getProperty('ADMIN_KEY');

  if (e.parameter.key !== adminKey) {
    return jsonResponse({ error: 'Unauthorized' });
  }

  const sheet = getSheet(ORDERS_SHEET);
  const data = sheet.getDataRange().getValues();

  if (data.length <= 1) {
    return jsonResponse({ orders: [] });
  }

  const headers = data[0];
  const orders = data.slice(1).map(row => {
    const order = {};
    headers.forEach((header, i) => {
      order[header] = row[i];
    });
    return order;
  });

  // Most recent first
  orders.reverse();

  return jsonResponse({ orders: orders });
}

function handleUpdateStatus(data) {
  const props = PropertiesService.getScriptProperties();
  const adminKey = props.getProperty('ADMIN_KEY');

  if (data.key !== adminKey) {
    return jsonResponse({ error: 'Unauthorized' });
  }

  const sheet = getSheet(ORDERS_SHEET);
  const allData = sheet.getDataRange().getValues();
  const headers = allData[0];
  const idCol = headers.indexOf('id');
  const statusCol = headers.indexOf('status');

  if (idCol === -1 || statusCol === -1) {
    return jsonResponse({ error: 'Sheet structure invalid' });
  }

  for (let i = 1; i < allData.length; i++) {
    if (allData[i][idCol] === data.orderId) {
      sheet.getRange(i + 1, statusCol + 1).setValue(data.status);
      return jsonResponse({ success: true });
    }
  }

  return jsonResponse({ error: 'Order not found' });
}

// --- Helpers ---

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
