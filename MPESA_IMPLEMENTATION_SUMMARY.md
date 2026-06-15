# M-Pesa Payment Integration - Implementation Summary

This document summarizes the M-Pesa payment integration added to Soldy.Shop (adapted from Growing-Creative).

## What's Been Added

### 1. Backend Payment Controller (`server/controllers/paymentController.js`)

**New Functions:**
- `initiateMpesaCharge()` - Initiate STK Push for payment
- `mpesaCallback()` - Handle webhook callbacks from Daraja
- `getMpesaPaymentReadiness()` - Health check endpoint

**New Utility Functions:**
- `normalizeKenyanPhoneNumber()` - Validate phone formats
- `getMpesaConfig()` - Load M-Pesa credentials
- `getMpesaAccessToken()` - Get Daraja authentication token
- `getMpesaReadiness()` - Check configuration status
- `parseMpesaCallback()` - Parse Daraja webhook response
- `isMpesaSimulationEnabled()` - Check simulation mode

### 2. Payment Routes (`server/routes/payment.js`)

**New Endpoints:**
```
POST   /api/payment/mpesa/initiate      - Initiate payment
POST   /api/payment/mpesa/callback      - Webhook endpoint
GET    /api/payment/mpesa/readiness     - Health check
```

### 3. Order Model (`server/models/Order.js`)

**New Fields:**
```javascript
mobileChargeRequestId: String     // Daraja CheckoutRequestID
mobilePaymentStatus: String       // pending, completed, failed, expired
```

**Enhanced paymentResult:**
```javascript
{
  id: String,
  status: String,
  provider: String,              // "mpesa"
  transactionDate: String,
  amount: Number,
  resultCode: Number,
  resultDesc: String
}
```

### 4. Environment Configuration (`.env.example`)

**New Variables:**
```env
MPESA_ENV=sandbox|production
MPESA_CONSUMER_KEY=...
MPESA_CONSUMER_SECRET=...
MPESA_BUSINESS_SHORTCODE=...
MPESA_PASSKEY=...
MPESA_CALLBACK_URL=https://...
MPESA_SIMULATION_MODE=true|false
```

### 5. Documentation & Scripts

**New Files:**
- `server/MPESA_SETUP.md` - Complete setup guide
- `server/scripts/check-mpesa-readiness.js` - Readiness verification
- `client/MPESA_FRONTEND_INTEGRATION.md` - Frontend integration guide
- `server/package.json` - Added `npm run check:mpesa` script

### 6. Server Configuration (`server/index.js`)

- Added raw body parsing for M-Pesa callback URL (like Stripe webhook)

---

## Key Differences from Growing-Creative

### Adapted for E-Commerce:

| Feature | Growing-Creative | Soldy-Shop |
|---------|------------------|-----------|
| **Purpose** | Donations (recurring) | Order payments (one-time) |
| **Amount Range** | KES 10-1,500 (predefined) | Variable (based on cart) |
| **Allocation** | Split into seed/hardware/audit | No split (goes to order) |
| **Webhook Response** | Custom format | Daraja STK callback format |
| **Order Reference** | `transactionId` | `orderId` + `invoiceNumber` |
| **Status Tracking** | Donation status | Order `isPaid` + `mobilePaymentStatus` |

---

## Payment Flow

```
1. Customer selects M-Pesa at checkout
                ↓
2. POST /api/payment/mpesa/initiate
   - Phone, Amount, OrderID
                ↓
3. Backend gets Daraja token
   - Request STK Push
                ↓
4. Daraja sends prompt to phone
   - Customer enters PIN
                ↓
5. Daraja sends callback webhook
   POST /api/payment/mpesa/callback
                ↓
6. Backend updates Order.isPaid = true
   - Triggers order confirmation email
                ↓
7. Frontend polls for status
   - Redirects to payment success page
```

---

## Quick Start

### Development (Testing)

1. **Setup .env:**
```env
NODE_ENV=development
MPESA_ENV=sandbox
MPESA_CONSUMER_KEY=your_key
MPESA_CONSUMER_SECRET=your_secret
MPESA_BUSINESS_SHORTCODE=174379
MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0ff47f
MPESA_CALLBACK_URL=http://localhost:5000/api/payment/mpesa/callback
MPESA_SIMULATION_MODE=true
```

2. **Test readiness:**
```bash
cd server
npm install
npm run check:mpesa
```

3. **Start backend:**
```bash
npm run dev
```

4. **Frontend testing:** Use any phone number, simulation will return mock response

### Production Deployment

1. **Get production credentials from M-Pesa admin**

2. **Update .env:**
```env
NODE_ENV=production
MPESA_ENV=production
MPESA_CONSUMER_KEY=prod_key
MPESA_CONSUMER_SECRET=prod_secret
MPESA_BUSINESS_SHORTCODE=your_mpesa_shortcode
MPESA_PASSKEY=your_lipa_na_mpesa_passkey
MPESA_CALLBACK_URL=https://api.yourdomain.com/api/payment/mpesa/callback
MPESA_SIMULATION_MODE=false
```

3. **Deploy backend to public HTTPS server**

4. **Verify deployment:**
```bash
BACKEND_BASE_URL=https://api.yourdomain.com npm run check:mpesa
```

Expected output: `READY: Live M-Pesa debit is enabled.`

---

## Integration Checklist

### Backend
- [x] Payment controller with M-Pesa functions
- [x] Payment routes updated
- [x] Order model with M-Pesa fields
- [x] Environment variables configured
- [x] Readiness check endpoint
- [x] Readiness check script
- [x] Callback raw body parsing
- [x] Comprehensive documentation

### Frontend
- [ ] Update API service with M-Pesa endpoints
- [ ] Create MpesaPayment component
- [ ] Update Checkout page
- [ ] Add phone number formatting
- [ ] Create payment status component
- [ ] Implement polling for payment confirmation
- [ ] Error handling & validation
- [ ] Success/failure page redirects

### Deployment
- [ ] Backend deployed to public HTTPS
- [ ] Database migrations (if any)
- [ ] Production M-Pesa credentials
- [ ] Callback URL accessible
- [ ] Readiness check passing
- [ ] Email notifications working
- [ ] Admin dashboard updated
- [ ] Monitoring/alerts set up

---

## Testing Scenarios

### Scenario 1: Simulation Mode (Development)
```
MPESA_SIMULATION_MODE=true
Phone: Any format (07..., +254..., 254...)
Expected: Mock response with SIM-MPESA-* ID
Status: Order remains pending (no real callback)
```

### Scenario 2: Sandbox Success
```
MPESA_SIMULATION_MODE=false
MPESA_ENV=sandbox
Phone: Valid test number from Daraja docs
Expected: Real STK prompt on phone
Status: Order updated to paid after completing prompt
```

### Scenario 3: Production Live
```
NODE_ENV=production
MPESA_ENV=production
Simulation: Forced OFF
Phone: Customer's real M-Pesa phone
Expected: Real charge, real order confirmation
```

---

## Troubleshooting

### "M-Pesa is not fully configured"
**Cause:** Missing env variables
**Fix:** Add all MPESA_* variables to `.env`

### "M-Pesa token request blocked"
**Cause:** Backend not on public IP
**Fix:** Deploy to cloud server (Render, Railway, etc.)

### "Callback URL must be HTTPS"
**Cause:** MPESA_CALLBACK_URL not HTTPS
**Fix:** Update to HTTPS URL in .env

### "Simulation mode is enabled"
**Cause:** MPESA_SIMULATION_MODE=true
**Fix:** Set to false in production, check NODE_ENV

### Payment callback never arrives
**Cause:** Callback URL not publicly accessible
**Fix:** Ensure firewall allows incoming POST requests

---

## Security Notes

1. **Credentials**: Keep .env files secret, never commit them
2. **HTTPS**: Callback URL MUST be HTTPS
3. **Validation**: Validate phone numbers and amounts
4. **Idempotency**: Handle duplicate callbacks (same orderId)
5. **Rate Limiting**: Prevent spam payment attempts
6. **Token Rotation**: Regenerate credentials if exposed

---

## API Endpoints Reference

### Initiate Payment
```
POST /api/payment/mpesa/initiate
Authorization: Bearer <token>

Request:
{
  "phone": "0712345678",
  "amount": 1500,
  "orderId": "mongodb_object_id"
}

Response (Success):
{
  "success": true,
  "checkoutRequestId": "ws_co_...",
  "merchantRequestId": "...",
  "phoneNumber": "254712345678",
  "amount": 1500,
  "orderId": "..."
}

Response (Simulation):
{
  "success": true,
  "message": "M-Pesa simulation mode is enabled.",
  "checkoutRequestId": "SIM-MPESA-..."
}
```

### Readiness Check
```
GET /api/payment/mpesa/readiness

Response:
{
  "success": true,
  "mpesa": {
    "env": "sandbox",
    "configured": true,
    "simulationEnabled": true,
    "checks": [
      { "key": "configured", "pass": true, "message": "..." },
      { "key": "callbackHttps", "pass": true, "message": "..." }
    ],
    "readyLiveCharge": false
  }
}
```

### Callback Webhook
```
POST /api/payment/mpesa/callback
(No authentication - called by Daraja)

Daraja sends:
{
  "Body": {
    "stkCallback": {
      "CheckoutRequestID": "ws_co_...",
      "ResultCode": 0,
      "ResultDesc": "The service was successful",
      "CallbackMetadata": {
        "Item": [
          { "Name": "MpesaReceiptNumber", "Value": "MPF123ABC" },
          { "Name": "Amount", "Value": 1500 },
          { "Name": "PhoneNumber", "Value": "254712345678" }
        ]
      }
    }
  }
}
```

---

## Next Steps

1. **Frontend Integration**: Implement React components per `MPESA_FRONTEND_INTEGRATION.md`
2. **Testing**: Test with sandbox credentials
3. **Deployment**: Deploy backend to production
4. **Go Live**: Swap sandbox for production credentials
5. **Monitor**: Track payment success/failure rates

---

## Support

For issues or questions:
- Refer to [Safaricom Daraja Docs](https://developer.safaricom.co.ke/docs)
- Check server logs for detailed error messages
- Run `npm run check:mpesa` to verify configuration
- Review `MPESA_SETUP.md` for detailed guides
