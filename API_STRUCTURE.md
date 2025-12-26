# Cấu trúc API - Church Event Mobile Registration

## Tổng quan

Ứng dụng gửi dữ liệu dưới dạng **FormData** với 2 trường:
- `data`: JSON string chứa toàn bộ thông tin đăng ký
- `receiptImage`: File ảnh biên lai chuyển khoản (optional, chỉ có khi user đã thanh toán)

## API Endpoints

### 1. Lưu Draft (Tiến trình)
```
POST /api/registration/draft
Content-Type: multipart/form-data
```

### 2. Lấy Draft qua Email
```
GET /api/registration/draft?email={email}
Content-Type: application/json
```

**Query Parameters:**
- `email` (required): Email đã dùng để lưu draft

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "personalInfo": { ... },
    "familyParticipation": { ... },
    "travelSchedule": { ... },
    "packageSelection": { ... },
    "payment": { ... },
    "accommodation": { ... },
    "isDraft": true,
    "submittedAt": "ISO datetime string"
  }
}
```

**Response Error (404):**
```json
{
  "success": false,
  "message": "Không tìm thấy bản nháp với email này"
}
```

### 3. Submit Đăng ký
```
POST /api/registration
Content-Type: multipart/form-data
```

---

## Cấu trúc dữ liệu JSON (trong field `data`)

### Root Object

```json
{
  "personalInfo": { ... },
  "familyParticipation": { ... },
  "travelSchedule": { ... },
  "packageSelection": { ... },
  "payment": { ... },
  "accommodation": { ... },
  "isDraft": boolean,
  "submittedAt": "ISO 8601 datetime string"
}
```

---

## 1. personalInfo (Thông tin cá nhân)

**Required:** ✅

```json
{
  "fullName": "string (required, min 1 char)",
  "gender": "male" | "female",
  "phoneNumber": "string (required, min 10 chars, regex: /^[0-9+\\-\\s()]+$/)",
  "email": "string (required, valid email)",
  "church": "string (required, min 1 char)",
  "maritalStatus": "string (required, typically 'single' | 'married')"
}
```

**Ví dụ:**
```json
{
  "fullName": "Nguyễn Văn A",
  "gender": "male",
  "phoneNumber": "0912345678",
  "email": "nguyenvana@example.com",
  "church": "Cần Thơ",
  "maritalStatus": "married"
}
```

---

## 2. familyParticipation (Tham gia gia đình)

**Required:** ❌ (Optional)

```json
{
  "attendingWithSpouse": boolean (optional),
  "spouseName": "string (optional)",
  "spousePhone": "string (optional)",
  "spouseWantsTShirt": boolean (optional, default: false),
  "spouseTShirtSize": "S" | "M" | "L" | "XL" | "XXL" (optional),
  "numberOfChildren": number (optional, default: 0, min: 0),
  "children": [
    {
      "name": "string (required)",
      "age": number (required, min: 0, max: 18),
      "wantsTShirt": boolean (default: false),
      "tShirtSize": "S" | "M" | "L" | "XL" | "XXL" (optional)
    }
  ] (optional)
}
```

**Ví dụ:**
```json
{
  "attendingWithSpouse": true,
  "spouseName": "Trần Thị B",
  "spousePhone": "0987654321",
  "spouseWantsTShirt": true,
  "spouseTShirtSize": "M",
  "numberOfChildren": 2,
  "children": [
    {
      "name": "Nguyễn Văn C",
      "age": 10,
      "wantsTShirt": true,
      "tShirtSize": "S"
    },
    {
      "name": "Nguyễn Thị D",
      "age": 8,
      "wantsTShirt": false
    }
  ]
}
```

---

## 3. travelSchedule (Lịch trình di chuyển)

**Required:** ❌ (Optional)

```json
{
  "noTravelInfo": boolean (optional),
  "arrivalDate": "ISO 8601 datetime string" (optional),
  "transport": "plane" | "train" | "bus" | "self" (optional),
  "flightCode": "string (optional)",
  "returnDate": "ISO 8601 datetime string" (optional)
}
```

**Lưu ý:** 
- Nếu `noTravelInfo: true`, các field khác có thể null/undefined
- Nếu `noTravelInfo: false` hoặc không có, các field khác có thể được điền

**Ví dụ:**
```json
{
  "noTravelInfo": false,
  "arrivalDate": "2024-12-25T10:00:00.000Z",
  "transport": "plane",
  "flightCode": "VN123",
  "returnDate": "2024-12-27T15:00:00.000Z"
}
```

Hoặc nếu không có thông tin:
```json
{
  "noTravelInfo": true
}
```

---

## 4. packageSelection (Gói tham gia & Áo lưu niệm)

**Required:** ✅

```json
{
  "mainPackage": "A" | "B" | "C",
  "spousePackage": "A" | "B" | "C" (optional),
  "childrenPackages": [
    {
      "childIndex": number,
      "package": "A" | "B" | "C"
    }
  ] (optional),
  "wantSouvenirShirt": boolean (default: false),
  "shirts": [
    {
      "size": "S" | "M" | "L" | "XL" | "XXL",
      "quantity": number (min: 1)
    }
  ] (optional)
}
```

**Ví dụ:**
```json
{
  "mainPackage": "B",
  "spousePackage": "A",
  "childrenPackages": [
    {
      "childIndex": 0,
      "package": "A"
    },
    {
      "childIndex": 1,
      "package": "A"
    }
  ],
  "wantSouvenirShirt": true,
  "shirts": [
    {
      "size": "M",
      "quantity": 2
    },
    {
      "size": "L",
      "quantity": 1
    }
  ]
}
```

---

## 5. payment (Thanh toán)

**Required:** ✅

```json
{
  "status": "paid" | "willPayLater",
  "transferDate": "ISO 8601 datetime string" (optional, required if status = "paid"),
  "receiptImage": null | File (optional, required if status = "paid")
}
```

**Lưu ý:**
- Nếu `status: "paid"`, cả `transferDate` và `receiptImage` đều bắt buộc
- `receiptImage` trong JSON sẽ là `null` hoặc có giá trị, nhưng file thực tế được gửi riêng trong FormData với key `receiptImage`
- `transferDate` được format theo ISO 8601 (ví dụ: "2024-12-25T10:00:00.000Z")

**Ví dụ:**
```json
{
  "status": "paid",
  "transferDate": "2024-12-20T14:30:00.000Z",
  "receiptImage": null
}
```

Hoặc nếu chưa thanh toán:
```json
{
  "status": "willPayLater"
}
```

---

## 6. accommodation (Chỗ ở & Tài trợ)

**Required:** ✅

```json
{
  "stayStatus": "arranged" | "notArranged" (optional),
  "accommodationInfo": "string (optional)",
  "needAssistance": boolean (optional),
  "sponsorshipAmount": number (optional),
  "bankNote": "string (optional)",
  "agreeToTerms": boolean (required)
}
```

**Ví dụ:**
```json
{
  "stayStatus": "arranged",
  "accommodationInfo": "Khách sạn ABC, 123 Đường XYZ",
  "needAssistance": false,
  "sponsorshipAmount": 500000,
  "bankNote": "Chuyển khoản ngày 20/12/2024, mã tham chiếu: ABC123",
  "agreeToTerms": true
}
```

---

## 7. Metadata

```json
{
  "isDraft": boolean,
  "submittedAt": "ISO 8601 datetime string"
}
```

- `isDraft`: 
  - `true` khi gọi API `/api/registration/draft`
  - `false` khi gọi API `/api/registration`
- `submittedAt`: Thời gian gửi (ISO 8601 format)

---

## Ví dụ Request hoàn chỉnh

### Request Headers
```
Content-Type: multipart/form-data
```

### FormData Fields

**Field 1: `data`** (JSON string)
```json
{
  "personalInfo": {
    "fullName": "Nguyễn Văn A",
    "gender": "male",
    "phoneNumber": "0912345678",
    "email": "nguyenvana@example.com",
    "church": "Cần Thơ",
    "maritalStatus": "married"
  },
  "familyParticipation": {
    "attendingWithSpouse": true,
    "spouseName": "Trần Thị B",
    "spousePhone": "0987654321",
    "spouseWantsTShirt": true,
    "spouseTShirtSize": "M",
    "numberOfChildren": 1,
    "children": [
      {
        "name": "Nguyễn Văn C",
        "age": 10,
        "wantsTShirt": true,
        "tShirtSize": "S"
      }
    ]
  },
  "travelSchedule": {
    "noTravelInfo": false,
    "arrivalDate": "2024-12-25T10:00:00.000Z",
    "transport": "plane",
    "flightCode": "VN123",
    "returnDate": "2024-12-27T15:00:00.000Z"
  },
  "packageSelection": {
    "mainPackage": "B",
    "spousePackage": "A",
    "childrenPackages": [
      {
        "childIndex": 0,
        "package": "A"
      }
    ],
    "wantSouvenirShirt": true,
    "shirts": [
      {
        "size": "M",
        "quantity": 2
      }
    ]
  },
  "payment": {
    "status": "paid",
    "transferDate": "2024-12-20T14:30:00.000Z",
    "receiptImage": null
  },
  "accommodation": {
    "stayStatus": "arranged",
    "accommodationInfo": "Khách sạn ABC",
    "needAssistance": false,
    "sponsorshipAmount": null,
    "bankNote": null,
    "agreeToTerms": true
  },
  "isDraft": false,
  "submittedAt": "2024-12-20T15:00:00.000Z"
}
```

**Field 2: `receiptImage`** (File, optional)
- Chỉ có khi `payment.status === "paid"` và user đã upload ảnh
- File type: image (jpg, png, etc.)
- Key trong FormData: `receiptImage`

---

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Registration submitted successfully",
  "data": {
    "registrationId": "string",
    "registrationCode": "string",
    // ... other response data
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message here",
  "error": "Detailed error information"
}
```

---

## Validation Rules

### Khi `isDraft: true` (Lưu draft)
- Tất cả các field đều optional (trừ `personalInfo` có thể cần một số field tối thiểu)
- Không cần validate đầy đủ

### Khi `isDraft: false` (Submit đăng ký)
- `personalInfo`: Tất cả field required
- `packageSelection.mainPackage`: Required
- `payment.status`: Required
- `accommodation.agreeToTerms`: Must be `true`
- Nếu `payment.status === "paid"`:
  - `payment.transferDate`: Required
  - `receiptImage`: Required (file phải được gửi trong FormData)

---

## Notes cho Backend Developer

1. **FormData Parsing**: 
   - Parse field `data` từ JSON string thành object
   - Parse field `receiptImage` như một file upload

2. **File Storage**:
   - Lưu file `receiptImage` vào storage (local filesystem, S3, etc.)
   - Lưu đường dẫn/URL của file vào database

3. **Date Handling**:
   - Tất cả date fields đều ở format ISO 8601
   - Convert sang format phù hợp với database của bạn

4. **Draft vs Final**:
   - `isDraft: true` → Lưu vào bảng draft, cho phép update sau
   - `isDraft: false` → Lưu vào bảng registration chính thức

5. **Phone Number**:
   - Format có thể có dấu cách, dấu ngoặc, dấu gạch ngang
   - Regex: `/^[0-9+\-\s()]+$/`
   - Nên normalize trước khi lưu (loại bỏ khoảng trắng, ký tự đặc biệt)

6. **Email**:
   - Validate format email chuẩn
   - Có thể dùng để gửi magic link cho draft

7. **Registration Code**:
   - Generate unique code sau khi submit thành công
   - Format: có thể là số, chữ số, hoặc kết hợp (ví dụ: "REG-2024-001234")

