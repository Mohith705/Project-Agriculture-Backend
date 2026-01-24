# API Changes - January 24, 2026

## Customer Profile Schema

### Required Fields
- `name` - Customer name
- `number` - Phone number (10 digits, unique)
- `state` - State
- `district` - District
- `mandal` - Mandal
- `village` - Village
- `password` - 4-digit password
- `securityQuestion` - Security question for password recovery
- `securityAnswer` - Answer to security question (case-insensitive)

### Optional Fields
- `pinCode` - PIN code
- `profilePicUrl` - Profile picture URL
- `paymentCompleted` - Payment status (Boolean)
- `status` - Account status (active, suspended, inactive, deleted)

### Breaking Changes
- `fullName` → `name`
- `phoneNumber` → `number`
- Removed `address` and `machineryType` fields
- Added security question/answer for password recovery

---

## Forgot Password Flow

### Step 1: Get Security Question
**POST** `/customer/auth/forgot-password/security-question`

**Request:**
```json
{
  "number": "9876543210"
}
```

**Response:**
```json
{
  "status": true,
  "message": "Security question retrieved",
  "securityQuestion": "What is your favorite color?",
  "customerId": "67394a8d4e..."
}
```

### Step 2: Reset Password
**POST** `/customer/auth/forgot-password/reset`

**Request:**
```json
{
  "customerId": "67394a8d4e...",
  "securityAnswer": "blue",
  "newPassword": "1234"
}
```

**Response:**
```json
{
  "status": true,
  "message": "Password reset successfully"
}
```

**Notes:**
- Security answers are case-insensitive (automatically handled by backend)
- Password must be exactly 4 digits
- Invalid security answer returns 401 Unauthorized error

---

## Listing Schema

### Create Listing Request Body
```json
{
  "machineName": "John Deere 5310",
  "machineCompany": "John Deere",
  "machineType": "Tractor",
  "machineModel": "5310",
  "manufacturingYear": 2020,
  "condition": "Excellent",
  "price": 850000,
  "state": "Telangana",
  "district": "Hyderabad",
  "mandal": "Serilingampally",
  "village": "Madhapur",
  "description": "Well maintained tractor, regularly serviced",
  "images": {
    "front": "https://example.com/front.jpg",
    "back": "https://example.com/back.jpg",
    "left": "https://example.com/left.jpg",
    "right": "https://example.com/right.jpg"
  },
  "video": "https://example.com/video.mp4",
  "contactNumber": "9876543210"
}
```

### Required Fields
- `machineName` - Name/identifier of the machinery
- `machineCompany` - Company/brand (e.g., John Deere, Mahindra, Sonalika)
- `machineType` - Must be one of: `Tractor`, `Harvester`, `Tiller`, `Plough`, `Seeder`, `Sprayer`, `Other`
- `machineModel` - Model number/name
- `manufacturingYear` - Year manufactured (Number, between 1900 and current year)
- `condition` - Must be one of: `Excellent`, `Good`, `Fair`
- `price` - Price in INR (Number, minimum 1)
- `state` - State location
- `district` - District location
- `mandal` - Mandal location
- `village` - Village location
- `contactNumber` - Contact number (minimum 10 digits)
- `images` - Object containing all 4 required image URLs:
  - `front` - Front view (must be valid URL)
  - `back` - Back view (must be valid URL)
  - `left` - Left side view (must be valid URL)
  - `right` - Right side view (must be valid URL)

### Optional Fields
- `description` - Additional details about the machinery
- `video` - Video URL (must be valid URL if provided)

### Auto-Populated/System Fields
- `customer` - Reference to customer ID (auto-populated from authenticated user)
- `status` - Listing status, defaults to `pending_review`
  - `pending_review` - Awaiting admin approval
  - `approved` - Approved and visible to all users
  - `rejected` - Rejected by admin
  - `deleted` - Soft deleted
- `rejectionReason` - Admin's reason for rejection (only if status is rejected)
- `createdAt` - Timestamp when listing was created
- `updatedAt` - Timestamp when listing was last updated

### Important Notes
- All 4 images (front, back, left, right) are **mandatory** for listing creation
- Location fields can be pre-filled from customer profile to save time
- All new listings default to `pending_review` status and require admin approval
- Only approved listings are visible in public listings
- Images and video must be valid URLs (upload images first, then use URLs)

---

## Validation Rules

### Customer Registration/Profile
- `name` - Minimum 3 characters
- `number` - Exactly 10 digits
- `password` - Exactly 4 digits
- `securityAnswer` - Minimum 1 character
- `state`, `district`, `mandal`, `village` - Required strings

### Listing Creation
- `machineName` - Required, minimum 1 character
- `machineCompany` - Required, minimum 1 character
- `machineModel` - Required, minimum 1 character
- `manufacturingYear` - Required number, range: 1900 to current year
- `price` - Required number, minimum value: 1
- `state`, `district`, `mandal`, `village` - Required, minimum 1 character each
- `contactNumber` - Required, minimum 10 characters
- `machineType` - Required, must be one of: Tractor, Harvester, Tiller, Plough, Seeder, Sprayer, Other
- `condition` - Required, must be one of: Excellent, Good, Fair
- `images.front`, `images.back`, `images.left`, `images.right` - All required, must be valid URLs
- `description` - Optional string
- `video` - Optional, must be valid URL if provided

---

## Migration Guide for Frontend

### Customer Signup/Login
Update form fields:
- Change `fullName` → `name`
- Change `phoneNumber` → `number`
- Add: `state`, `district`, `mandal`, `village`
- Add: `securityQuestion`, `securityAnswer`
- Remove: `address`, `machineryType`

### Listing Creation Form
Add new required fields:
- `machineCompany` - Text input for company/brand name
- `machineModel` - Text input for model
- `manufacturingYear` - Number input (1900 to current year)
- `state` - Text/dropdown (can auto-fill from customer profile)
- `district` - Text/dropdown (can auto-fill from customer profile)
- `mandal` - Text/dropdown (can auto-fill from customer profile)
- `village` - Text/dropdown (can auto-fill from customer profile)

Update existing fields:
- Ensure all 4 images (front, back, left, right) are collected
- Images must be uploaded and URLs obtained before submission

Remove:
- Combined `location` field

Recommendation:
- Add "Use my profile address" checkbox to auto-fill location fields from customer profile

### Password Recovery
Implement 2-step flow:
1. Enter phone number → Get security question
2. Answer question + new password → Reset complete
