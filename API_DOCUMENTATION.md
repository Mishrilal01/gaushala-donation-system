# API Documentation

## Base URL
- **Development**: `http://localhost:5000/api`
- **Production**: `https://yourdomain.com/api`

## Response Format

All responses follow this format:

```json
{
  "success": true/false,
  "message": "descriptive message",
  "data": {}
}
```

---

## Public Endpoints

### 📝 Submit Donation

**POST** `/donations/submit`

Submit a new donation for admin approval.

**Request Body:**
```json
{
  "name": "John Doe",
  "amount": 500,
  "isPublic": true
}
```

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Donor's name (2-100 chars) |
| amount | number | Yes | Donation amount in rupees (min: 1) |
| isPublic | boolean | No | Show name publicly (default: true) |
| screenshotPath | string | No | Path to payment screenshot |

**Response (Success):**
```json
{
  "success": true,
  "message": "धन्यवाद! आपका दान प्रस्तुत किया गया है।",
  "donationId": 1
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "कृपया नाम और राशि दर्ज करें"
}
```

**Example cURL:**
```bash
curl -X POST http://localhost:5000/api/donations/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rajesh Kumar",
    "amount": 1000,
    "isPublic": true
  }'
```

---

### 📊 Get Approved Donations

**GET** `/donations/approved`

Fetch all approved donations for public display.

**Query Parameters:**
None

**Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Rajesh Kumar",
      "amount": 1000,
      "date": "2024-01-15T10:30:00.000Z",
      "is_public": 1
    },
    {
      "id": 2,
      "name": "Anonymous",
      "amount": 500,
      "date": "2024-01-14T15:45:00.000Z",
      "is_public": 0
    }
  ]
}
```

**Sorting:** Descending by date (newest first)

**Limit:** 50 donations max

**Example cURL:**
```bash
curl http://localhost:5000/api/donations/approved
```

---

### 📈 Get Statistics

**GET** `/donations/stats`

Get dashboard statistics.

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "totalAmount": 5500,
    "treesPlanted": 11,
    "totalDonors": 3,
    "goalTrees": 100,
    "progressPercentage": 11
  }
}
```

**Field Descriptions:**
| Field | Type | Description |
|-------|------|-------------|
| totalAmount | number | Sum of all approved donations (₹) |
| treesPlanted | number | Floor(totalAmount / 500) |
| totalDonors | number | Count of distinct donors |
| goalTrees | number | Target trees (hardcoded: 100) |
| progressPercentage | number | Min(trees/goal*100, 100) |

**Example cURL:**
```bash
curl http://localhost:5000/api/donations/stats
```

---

### 🏆 Get Top Supporters

**GET** `/donations/top-supporters`

Get top 3 donors (public donors only).

**Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "name": "Rajesh Kumar",
      "totalAmount": 2500,
      "donationCount": 2
    },
    {
      "name": "Priya Singh",
      "totalAmount": 2000,
      "donationCount": 1
    },
    {
      "name": "Amit Patel",
      "totalAmount": 1000,
      "donationCount": 1
    }
  ]
}
```

**Note:** Only public donors (is_public=1) are included

**Example cURL:**
```bash
curl http://localhost:5000/api/donations/top-supporters
```

---

## Admin Endpoints

### 🔐 Admin Login

**POST** `/admin/login`

Authenticate admin user.

**Request Body:**
```json
{
  "password": "gaushala123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "YWRtaW46MTcwNzk0NzAwMDAwMA=="
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Invalid password"
}
```

**Important:** Save token in localStorage for subsequent requests

**Example cURL:**
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password": "gaushala123"}'
```

---

### ⏳ Get Pending Donations

**GET** `/admin/pending`

Fetch all pending donations awaiting approval.

**Authentication:** Required (token in header)

**Request Header:**
```
Authorization: Bearer {token}
```

**Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "name": "New Donor",
      "amount": 500,
      "screenshot": null,
      "is_public": 1,
      "status": "pending",
      "date": "2024-01-16T08:00:00.000Z"
    }
  ]
}
```

**Example cURL:**
```bash
curl http://localhost:5000/api/admin/pending \
  -H "Authorization: Bearer YWRtaW46MTcwNzk0NzAwMDAwMA=="
```

---

### 📋 Get All Donations

**GET** `/admin/all-donations`

Fetch all donations (including approved, rejected, pending).

**Authentication:** Required

**Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Rajesh Kumar",
      "amount": 1000,
      "screenshot": null,
      "is_public": 1,
      "status": "approved",
      "date": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

**Status Values:** "pending", "approved", "rejected"

**Example cURL:**
```bash
curl http://localhost:5000/api/admin/all-donations \
  -H "Authorization: Bearer {token}"
```

---

### ✅ Approve Donation

**POST** `/admin/approve`

Approve a pending donation.

**Authentication:** Required

**Request Body:**
```json
{
  "donationId": 5
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Donation approved successfully"
}
```

**Side Effects:**
- Changes status from "pending" to "approved"
- Donation becomes visible in public list
- Statistics updated automatically

**Example cURL:**
```bash
curl -X POST http://localhost:5000/api/admin/approve \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{"donationId": 5}'
```

---

### ❌ Reject Donation

**POST** `/admin/reject`

Reject a pending donation.

**Authentication:** Required

**Request Body:**
```json
{
  "donationId": 5
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Donation rejected"
}
```

**Side Effects:**
- Changes status from "pending" to "rejected"
- Donation removed from public view
- Not counted in statistics

**Example cURL:**
```bash
curl -X POST http://localhost:5000/api/admin/reject \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{"donationId": 5}'
```

---

### 📤 Upload Gallery Image

**POST** `/admin/upload-image`

Add new image to gallery.

**Authentication:** Required

**Request Body:**
```json
{
  "filename": "tree-plantation-001.jpg",
  "caption": "पेड़ लगाई गई समारोह"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "imageId": 1
}
```

**Example cURL:**
```bash
curl -X POST http://localhost:5000/api/admin/upload-image \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "filename": "tree-photo.jpg",
    "caption": "Tree plantation"
  }'
```

---

### 🖼️ Get Gallery Images

**GET** `/admin/gallery`

Fetch all gallery images.

**Authentication:** Required

**Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "filename": "tree-plantation-001.jpg",
      "caption": "पेड़ लगाई गई समारोह",
      "uploaded_at": "2024-01-16T12:00:00.000Z"
    }
  ]
}
```

**Example cURL:**
```bash
curl http://localhost:5000/api/admin/gallery \
  -H "Authorization: Bearer {token}"
```

---

### 📝 Update Donation Amount

**PUT** `/admin/update-donation`

Update donation amount (for corrections).

**Authentication:** Required

**Request Body:**
```json
{
  "donationId": 1,
  "newAmount": 1500
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Amount updated successfully"
}
```

**Side Effects:**
- Updates donation amount
- Statistics recalculated
- Tree count updated

**Example cURL:**
```bash
curl -X PUT http://localhost:5000/api/admin/update-donation \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "donationId": 1,
    "newAmount": 2000
  }'
```

---

## Error Responses

### Common Error Codes

**400 - Bad Request**
```json
{
  "success": false,
  "message": "Validation error or missing required field"
}
```

**401 - Unauthorized**
```json
{
  "success": false,
  "message": "Unauthorized or invalid token"
}
```

**404 - Not Found**
```json
{
  "success": false,
  "message": "Donation not found"
}
```

**500 - Internal Server Error**
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Rate Limiting & Best Practices

- **No rate limiting** in current version (add for production)
- **Request timeout**: 30 seconds
- **Payload limit**: 50MB
- **Database queries**: Indexed for performance

### Best Practices

1. **Cache responses** where possible
2. **Implement pagination** for large datasets
3. **Use batch operations** for bulk updates
4. **Add request validation** on client side
5. **Handle errors gracefully** with user messages
6. **Log API calls** for debugging

---

## Testing API Endpoints

### Using Postman
1. Import endpoints from this documentation
2. Set base URL: `http://localhost:5000/api`
3. Add token in Authorization header
4. Send requests and view responses

### Using cURL
```bash
# Test endpoint
curl -i http://localhost:5000/health

# Login
TOKEN=$(curl -s -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password":"gaushala123"}' | jq -r '.token')

# Use token
curl http://localhost:5000/api/admin/pending \
  -H "Authorization: Bearer $TOKEN"
```

---

## Webhook Events (Future)

These endpoints can be added for real-time notifications:

- `POST /webhook/donation-approved` - When donation approved
- `POST /webhook/goal-reached` - When 100 trees reached
- `POST /webhook/new-top-supporter` - New top supporter

---

**API Version:** 1.0.0  
**Last Updated:** 2024  
**Status:** ✅ Production Ready

For more information, check the README.md file.
