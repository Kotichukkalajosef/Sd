<?php
/**
 * ==============================================================================
 * SD ENTERPRISES - Outage Inquiry & Contact Form Mail Dispatcher
 * ==============================================================================
 * 
 * Optimized for GoDaddy cPanel Linux Hosting & Webmail / Microsoft 365.
 * 
 * SETUP INSTRUCTIONS FOR GODADDY CPANEL:
 * 1. Default Mode (Recommended for GoDaddy cPanel):
 *    - Leaves SMTP_ENABLED = false.
 *    - Uses standard PHP mail() which executes through GoDaddy cPanel's local Exim MTA.
 *    - Works immediately out-of-the-box without entering any passwords!
 * 
 * 2. Authenticated SMTP Mode (Optional):
 *    - Set SMTP_ENABLED = true.
 *    - Provide your GoDaddy email address and password below.
 *    - Typical GoDaddy Ports:
 *        - cPanel Webmail / Exim: Port 465 (SSL) or Port 587 (TLS)
 *        - GoDaddy Workspace: Host: smtpout.secureserver.net, Port: 465
 *        - GoDaddy cPanel Relay (No Auth): Host: relay-hosting.secureserver.net, Port: 25
 *        - GoDaddy Microsoft 365: Host: smtp.office365.com, Port: 587
 * ==============================================================================
 */

// ------------------------------------------------------------------------------
// 1. CONFIGURATION SETTINGS (Customize as needed)
// ------------------------------------------------------------------------------

// Destination: Where inquiry notification emails will be delivered
define('RECIPIENT_EMAIL', 'info@sdenterprises.co');
define('RECIPIENT_NAME',  'SD Enterprises');

// Sender identity used in outgoing mail headers
define('SENDER_EMAIL',    'info@sdenterprises.co');
define('SENDER_NAME',     'SD Enterprises Portal');

// SMTP Settings (Optional - set to true only if you prefer authenticated SMTP)
define('SMTP_ENABLED',    false);
define('SMTP_HOST',       'smtpout.secureserver.net'); // or 'localhost' or 'mail.sdenterprises.in'
define('SMTP_PORT',       465);                         // 465 (SSL), 587 (TLS), or 25 (Relay)
define('SMTP_SECURE',     'ssl');                       // 'ssl', 'tls', or ''
define('SMTP_USERNAME',   'info@sdenterprises.co');
define('SMTP_PASSWORD',   'YourPasswordHere');          // Set if SMTP_ENABLED is true

// Send an automatic receipt confirmation to the person submitting the form
define('SEND_AUTOREPLY',  true);

// ------------------------------------------------------------------------------
// 2. RESPONSE HEADER & REQUEST METHOD VERIFICATION
// ------------------------------------------------------------------------------

$isAjax = (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') 
          || (isset($_SERVER['CONTENT_TYPE']) && strpos($_SERVER['CONTENT_TYPE'], 'application/json') !== false)
          || (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false);

function sendResponse($success, $message, $extra = []) {
    global $isAjax;
    if ($isAjax) {
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode(array_merge([
            'success' => $success,
            'message' => $message
        ], $extra));
        exit;
    } else {
        // Direct POST fallback redirect
        $statusParam = $success ? 'success' : 'error';
        $msgParam = urlencode($message);
        header("Location: contact.html?status={$statusParam}&msg={$msgParam}#rfp-form");
        exit;
    }
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Invalid request method. Only POST submissions are accepted.');
}

// ------------------------------------------------------------------------------
// 3. ANTI-SPAM HONEYPOT CHECK
// ------------------------------------------------------------------------------
if (!empty($_POST['_hp_company_check'])) {
    // Hidden field was filled by automated bot; silently terminate
    sendResponse(true, 'Your request has been received.');
}

// ------------------------------------------------------------------------------
// 4. SANITIZATION & INPUT EXTRACTION
// ------------------------------------------------------------------------------
function sanitize($value) {
    if (is_array($value)) {
        return array_map('sanitize', $value);
    }
    return htmlspecialchars(trim((string)$value), ENT_QUOTES, 'UTF-8');
}

$name        = sanitize($_POST['name'] ?? '');
$designation = sanitize($_POST['designation'] ?? 'Not Specified');
$email       = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$phone       = sanitize($_POST['phone'] ?? '');
$description = sanitize($_POST['description'] ?? $_POST['notes'] ?? '');

// ------------------------------------------------------------------------------
// 5. VALIDATION
// ------------------------------------------------------------------------------
$errors = [];
if (empty($name))        $errors[] = 'Your Name is required.';
if (!$email)             $errors[] = 'A valid official email address is required.';
if (empty($phone))       $errors[] = 'Phone Number is required.';
if (empty($description)) $errors[] = 'Please provide a brief description of your requirements.';

if (!empty($errors)) {
    sendResponse(false, implode(' ', $errors));
}

// Submission metadata
$submittedAt = date('Y-m-d H:i:s T');
$clientIp    = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';
$userAgent   = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';

// ------------------------------------------------------------------------------
// 6. BUILD EMAIL CONTENTS (HTML + PLAIN TEXT)
// ------------------------------------------------------------------------------
$desgDisplay = (!empty($designation) && $designation !== 'Not Specified') ? " ({$designation})" : "";
$subject = "⚡ NEW INQUIRY: {$name}{$desgDisplay}";

// Clean, high-contrast industrial HTML email template
$htmlBody = <<<HTML
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Outage Inquiry</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #0c2d48; }
    .container { max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #cbd5e1; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
    .header { background: #0c2d48; padding: 24px 30px; border-bottom: 3px solid #38bdf8; }
    .header h1 { color: #ffffff; margin: 0 0 6px 0; font-size: 22px; font-weight: 800; letter-spacing: -0.02em; }
    .header p { color: #38bdf8; margin: 0; font-family: monospace; font-size: 13px; font-weight: 700; }
    .content { padding: 30px; }
    .alert-strip { background: #e0f2fe; border-left: 4px solid #0284c7; padding: 12px 16px; margin-bottom: 24px; border-radius: 4px; font-size: 14px; color: #0369a1; }
    table.data-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px; }
    table.data-table th { width: 35%; text-align: left; padding: 11px 12px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; color: #475569; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
    table.data-table td { padding: 11px 12px; border-bottom: 1px solid #e2e8f0; color: #0c2d48; font-weight: 600; }
    .desc-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin-bottom: 24px; }
    .desc-box h3 { margin: 0 0 10px 0; font-size: 12px; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; }
    .desc-box p { margin: 0; font-size: 14px; color: #0c2d48; line-height: 1.6; white-space: pre-line; }
    .footer { background: #f8fafc; padding: 16px 30px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; font-family: monospace; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>SD ENTERPRISES &middot; CLIENT INQUIRY</h1>
      <p>NEW MESSAGE RECEIVED VIA CONTACT FORM</p>
    </div>
    <div class="content">
      <div class="alert-strip">
        <strong>⚡ Action:</strong> A client has sent a message via the website. Review details below and reply to discuss scope over email or phone.
      </div>

      <table class="data-table">
        <tr>
          <th>Name</th>
          <td>{$name}</td>
        </tr>
        <tr>
          <th>Designation / Org</th>
          <td>{$designation}</td>
        </tr>
        <tr>
          <th>Email Address</th>
          <td><a href="mailto:{$email}">{$email}</a></td>
        </tr>
        <tr>
          <th>Phone Number</th>
          <td><a href="tel:{$phone}">{$phone}</a></td>
        </tr>
      </table>

      <div class="desc-box">
        <h3>Description &amp; Inquiry Details</h3>
        <p>{$description}</p>
      </div>
    </div>
    <div class="footer">
      Dispatched via SD Enterprises Web Portal &middot; {$submittedAt} &middot; Client IP: {$clientIp}
    </div>
  </div>
</body>
</html>
HTML;

$textBody = <<<TEXT
SD ENTERPRISES - NEW CONTACT INQUIRY
===================================
A new inquiry has been submitted via the website contact form.

CLIENT DETAILS:
- Name:        {$name}
- Designation: {$designation}
- Email:       {$email}
- Phone:       {$phone}

DESCRIPTION:
{$description}

-----------------------------------
Submitted: {$submittedAt}
IP Address: {$clientIp}
TEXT;

// ------------------------------------------------------------------------------
// 7. DISPATCH LOGIC (cPanel mail() vs Socket SMTP)
// ------------------------------------------------------------------------------

/**
 * Socket-based SMTP Client (Zero Dependencies)
 * Handles standard GoDaddy SMTP on ports 465, 587, and 25
 */
function sendViaSmtp($to, $subject, $htmlContent, $textContent, $fromEmail, $fromName, $replyTo) {
    $host = SMTP_HOST;
    $port = SMTP_PORT;
    $secure = strtolower(SMTP_SECURE);
    $user = SMTP_USERNAME;
    $pass = SMTP_PASSWORD;

    $connectHost = ($secure === 'ssl') ? "ssl://{$host}" : $host;
    $socket = @fsockopen($connectHost, $port, $errno, $errstr, 20);

    if (!$socket) {
        error_log("SMTP Connect Failed: {$errstr} ({$errno})");
        return false;
    }

    $read = function() use ($socket) {
        $res = '';
        while ($line = fgets($socket, 512)) {
            $res .= $line;
            if (substr($line, 3, 1) === ' ') break;
        }
        return $res;
    };

    $send = function($cmd) use ($socket) {
        fputs($socket, $cmd . "\r\n");
    };

    $read();
    $send("EHLO " . gethostname());
    $ehloResp = $read();

    if ($secure === 'tls' && strpos($ehloResp, 'STARTTLS') !== false) {
        $send("STARTTLS");
        $read();
        stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
        $send("EHLO " . gethostname());
        $read();
    }

    if (!empty($user) && !empty($pass)) {
        $send("AUTH LOGIN");
        $read();
        $send(base64_encode($user));
        $read();
        $send(base64_encode($pass));
        $authResp = $read();
        if (substr($authResp, 0, 3) !== '235') {
            error_log("SMTP Auth Failed: {$authResp}");
            fclose($socket);
            return false;
        }
    }

    $send("MAIL FROM: <{$fromEmail}>");
    $read();
    $send("RCPT TO: <{$to}>");
    $read();
    $send("DATA");
    $read();

    $boundary = "----=_Part_" . md5(uniqid(time()));
    $headers = [];
    $headers[] = "From: {$fromName} <{$fromEmail}>";
    $headers[] = "Reply-To: {$replyTo}";
    $headers[] = "To: {$to}";
    $headers[] = "Subject: {$subject}";
    $headers[] = "MIME-Version: 1.0";
    $headers[] = "Content-Type: multipart/alternative; boundary=\"{$boundary}\"";
    $headers[] = "Date: " . date('r');

    $message = implode("\r\n", $headers) . "\r\n\r\n";
    $message .= "--{$boundary}\r\n";
    $message .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $message .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
    $message .= $textContent . "\r\n\r\n";
    $message .= "--{$boundary}\r\n";
    $message .= "Content-Type: text/html; charset=UTF-8\r\n";
    $message .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
    $message .= $htmlContent . "\r\n\r\n";
    $message .= "--{$boundary}--\r\n.";

    $send($message);
    $dataResp = $read();

    $send("QUIT");
    fclose($socket);

    return (substr($dataResp, 0, 3) === '250');
}

/**
 * Native PHP mail() with Proper MIME Multi-part
 */
function sendViaNativeMail($to, $subject, $htmlContent, $textContent, $fromEmail, $fromName, $replyTo) {
    $boundary = "----=_Part_" . md5(uniqid(time()));

    $headers = [];
    $headers[] = "From: {$fromName} <{$fromEmail}>";
    $headers[] = "Reply-To: {$replyTo}";
    $headers[] = "MIME-Version: 1.0";
    $headers[] = "Content-Type: multipart/alternative; boundary=\"{$boundary}\"";
    $headers[] = "X-Mailer: PHP/" . phpversion();

    $body = "--{$boundary}\r\n";
    $body .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $body .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
    $body .= $textContent . "\r\n\r\n";
    $body .= "--{$boundary}\r\n";
    $body .= "Content-Type: text/html; charset=UTF-8\r\n";
    $body .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
    $body .= $htmlContent . "\r\n\r\n";
    $body .= "--{$boundary}--";

    // Use -f envelope sender parameter for GoDaddy / cPanel sendmail
    return @mail($to, $subject, $body, implode("\r\n", $headers), "-f{$fromEmail}");
}

// Perform Delivery
$deliverySuccess = false;
if (SMTP_ENABLED) {
    $deliverySuccess = sendViaSmtp(RECIPIENT_EMAIL, $subject, $htmlBody, $textBody, SENDER_EMAIL, SENDER_NAME, $email);
} else {
    $deliverySuccess = sendViaNativeMail(RECIPIENT_EMAIL, $subject, $htmlBody, $textBody, SENDER_EMAIL, SENDER_NAME, $email);
}

// ------------------------------------------------------------------------------
// 8. OPTIONAL CLIENT AUTOREPLY
// ------------------------------------------------------------------------------
if ($deliverySuccess && SEND_AUTOREPLY && !empty($email)) {
    $autoSubject = "Inquiry Received: SD Enterprises Engineering Desk";
    $autoHtml = <<<HTML
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: sans-serif; background: #f1f5f9; padding: 24px; color: #0c2d48;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; padding: 30px; border: 1px solid #cbd5e1;">
    <h2 style="color: #0c2d48; margin-top: 0;">Message Acknowledged: SD Enterprises</h2>
    <p>Dear {$name},</p>
    <p>Thank you for contacting SD Enterprises. We have received your inquiry.</p>
    <p>Our engineering team will review your message and reply directly to this email address or phone within <strong>2 to 4 working hours</strong> to discuss your requirements.</p>
    <p>If you require immediate 24/7 emergency assistance, please call our outage desk directly at <a href="tel:+919876543210" style="color: #0284c7; font-weight: bold;">+91 80886 40058</a>.</p>
    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
    <p style="font-size: 13px; color: #64748b; margin-bottom: 0;">
      <strong>SD Enterprises Engineering &amp; Turnaround Services</strong><br>
      Specialized STG Outages &middot; TDBFP &middot; Erection &middot; Fabrication &middot; Valves<br>
      Email: info@sdenterprises.co | Web: www.sdenterprises.in
    </p>
  </div>
</body>
</html>
HTML;
    $autoText = "Dear {$name},\n\nThank you for reaching out to SD Enterprises. Our engineering team has received your message and will reply within 2-4 working hours over email or phone.\n\nEmergency Hotline: +91 80886 40058\nSD Enterprises Technical Desk";
    
    if (SMTP_ENABLED) {
        @sendViaSmtp($email, $autoSubject, $autoHtml, $autoText, SENDER_EMAIL, SENDER_NAME, RECIPIENT_EMAIL);
    } else {
        @sendViaNativeMail($email, $autoSubject, $autoHtml, $autoText, SENDER_EMAIL, SENDER_NAME, RECIPIENT_EMAIL);
    }
}

// ------------------------------------------------------------------------------
// 9. RETURN FINAL OUTCOME
// ------------------------------------------------------------------------------
if ($deliverySuccess) {
    sendResponse(true, "Thank you, {$name}. Your message has been sent directly to our GoDaddy inbox. We will review your requirements and connect with you over email or phone shortly.");
} else {
    // If local test environment without configured MTA, explain gracefully
    sendResponse(false, "Your message was captured, but the mail delivery service could not complete the transmission. Please contact our 24/7 Outage Hotline directly at +91 80886 40058 or email info@sdenterprises.co.");
}
