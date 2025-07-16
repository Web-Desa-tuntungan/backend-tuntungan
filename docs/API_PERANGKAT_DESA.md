# 📋 API Documentation - Perangkat Desa

## 🎯 **Overview**
API untuk mengelola data perangkat desa (kepala desa, sekretaris, staff, dll) dengan fitur CRUD lengkap, upload foto ke Cloudinary, dan sistem autentikasi admin.

## 🔗 **Base URL**
```
http://localhost:8080
```

## 📊 **Database Schema**
```sql
CREATE TABLE perangkat_desa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  jabatan VARCHAR(100) NOT NULL,
  foto VARCHAR(500) NULL,
  public_id VARCHAR(255) NULL,
  bio TEXT NULL,
  urutan INT DEFAULT 0,
  status ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 🔓 **PUBLIC ENDPOINTS**

### 1. **GET** `/lihat/perangkat-desa`
**Deskripsi:** Mengambil semua data perangkat desa yang aktif

**Response:**
```json
[
  {
    "id": 1,
    "nama": "Bapak Kepala Desa",
    "jabatan": "Kepala Desa",
    "foto": "https://res.cloudinary.com/dk0a80der/image/upload/v1234567890/perangkat-desa/foto.jpg",
    "public_id": "perangkat-desa/foto",
    "bio": "Kepala Desa Tuntungan 1 yang berdedikasi melayani masyarakat dengan sepenuh hati.",
    "urutan": 1,
    "status": "aktif",
    "created_at": "2025-07-16T03:08:13.000Z",
    "updated_at": "2025-07-16T03:08:13.000Z"
  }
]
```

### 2. **GET** `/lihat/perangkat-desa/{id}`
**Deskripsi:** Mengambil data perangkat desa berdasarkan ID

**Parameters:**
- `id` (path): ID perangkat desa

**Response:**
```json
{
  "id": 1,
  "nama": "Bapak Kepala Desa",
  "jabatan": "Kepala Desa",
  "foto": "https://res.cloudinary.com/dk0a80der/image/upload/v1234567890/perangkat-desa/foto.jpg",
  "public_id": "perangkat-desa/foto",
  "bio": "Kepala Desa Tuntungan 1 yang berdedikasi melayani masyarakat dengan sepenuh hati.",
  "urutan": 1,
  "status": "aktif",
  "created_at": "2025-07-16T03:08:13.000Z",
  "updated_at": "2025-07-16T03:08:13.000Z"
}
```

---

## 🔒 **ADMIN ENDPOINTS** (Requires Authentication)

### 3. **POST** `/tambah/perangkat-desa`
**Deskripsi:** Menambah perangkat desa baru

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Body (Form Data):**
- `nama` (required): Nama lengkap perangkat desa
- `jabatan` (required): Jabatan/posisi
- `bio` (optional): Biografi/deskripsi
- `urutan` (optional): Urutan tampil (default: 0)
- `foto` (optional): File foto (JPG/PNG/WebP, max 5MB)

**Response Success:**
```json
{
  "message": "Perangkat desa berhasil ditambahkan",
  "data": {
    "nama": "Bapak Kepala Desa",
    "jabatan": "Kepala Desa",
    "foto": "https://res.cloudinary.com/dk0a80der/image/upload/v1234567890/perangkat-desa/foto.jpg",
    "bio": "Kepala Desa Tuntungan 1 yang berdedikasi melayani masyarakat dengan sepenuh hati.",
    "urutan": 1
  }
}
```

### 4. **PUT** `/edit/perangkat-desa/{id}`
**Deskripsi:** Mengupdate data perangkat desa

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Parameters:**
- `id` (path): ID perangkat desa

**Body (Form Data):**
- `nama` (required): Nama lengkap perangkat desa
- `jabatan` (required): Jabatan/posisi
- `bio` (optional): Biografi/deskripsi
- `urutan` (optional): Urutan tampil
- `foto` (optional): File foto baru (JPG/PNG/WebP, max 5MB)

**Response Success:**
```json
{
  "message": "Perangkat desa berhasil diperbarui"
}
```

### 5. **DELETE** `/hapus/perangkat-desa/{id}`
**Deskripsi:** Menghapus perangkat desa

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `id` (path): ID perangkat desa

**Response Success:**
```json
{
  "message": "Perangkat desa berhasil dihapus"
}
```

---

## 🚨 **Error Responses**

### 400 Bad Request
```json
{
  "message": "Nama dan jabatan wajib diisi"
}
```

### 401 Unauthorized
```json
{
  "message": "Unauthorized: Token not provided"
}
```

### 403 Forbidden
```json
{
  "message": "Forbidden: Admin access only"
}
```

### 404 Not Found
```json
{
  "message": "Perangkat desa tidak ditemukan"
}
```

### 500 Internal Server Error
```json
{
  "message": "Gagal menambahkan perangkat desa"
}
```

---

## 📝 **Usage Examples**

### Curl Examples

**1. Get All Perangkat Desa:**
```bash
curl -X GET "http://localhost:8080/lihat/perangkat-desa"
```

**2. Get Perangkat Desa by ID:**
```bash
curl -X GET "http://localhost:8080/lihat/perangkat-desa/1"
```

**3. Add New Perangkat Desa (Admin):**
```bash
curl -X POST "http://localhost:8080/tambah/perangkat-desa" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "nama=Bapak Kepala Desa" \
  -F "jabatan=Kepala Desa" \
  -F "bio=Kepala Desa yang berdedikasi" \
  -F "urutan=1" \
  -F "foto=@/path/to/photo.jpg"
```

**4. Update Perangkat Desa (Admin):**
```bash
curl -X PUT "http://localhost:8080/edit/perangkat-desa/1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "nama=Bapak Kepala Desa Updated" \
  -F "jabatan=Kepala Desa" \
  -F "bio=Bio yang diperbarui" \
  -F "urutan=1"
```

**5. Delete Perangkat Desa (Admin):**
```bash
curl -X DELETE "http://localhost:8080/hapus/perangkat-desa/1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## ✅ **Features**

- ✅ **CRUD Operations** - Create, Read, Update, Delete
- ✅ **File Upload** - Upload foto ke Cloudinary dengan kompresi otomatis
- ✅ **Authentication** - JWT-based admin authentication
- ✅ **Validation** - Input validation dan file type checking
- ✅ **Error Handling** - Comprehensive error responses
- ✅ **CORS Support** - Cross-origin resource sharing
- ✅ **Database Indexing** - Optimized queries dengan index

## 🔧 **Technical Details**

- **Framework:** Hapi.js
- **Database:** MySQL
- **File Storage:** Cloudinary
- **Authentication:** JWT + bcrypt
- **Image Processing:** Sharp (compression)
- **File Types:** JPG, PNG, WebP
- **Max File Size:** 5MB
