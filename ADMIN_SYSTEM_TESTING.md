# 🔧 Admin System Testing Guide - Future X

## 📋 **LANGKAH PERSIAPAN**

### 1. **Jalankan Query SQL di phpMyAdmin**
```sql
-- Buka phpMyAdmin dan pilih database 'pintukeluar'
-- Copy dan paste semua query dari file sample-data-queries.sql
-- Jalankan satu per satu atau sekaligus
```

### 2. **Start Backend Server**
```bash
cd PintuKeluarAPI
npm start
```

### 3. **Start Frontend Server**
```bash
cd FrontEnd
npm run dev
```

## 🧪 **TESTING CHECKLIST**

### ✅ **1. Authentication Testing**
- [ ] Login sebagai admin: `admin12@gmail.com` / `admin123`
- [ ] Akses admin dashboard: `http://localhost:5173/admin/dashboard`
- [ ] Verifikasi role-based access control

### ✅ **2. Service Management Testing**
- [ ] Akses: `http://localhost:5173/admin/services`
- [ ] Test tab Psikologi: Tambah/Edit dokter, durasi, jenis konsultasi
- [ ] Test tab Bengkel: Tambah/Edit layanan, produk, merek
- [ ] Test tab Opo Wae: Tambah/Edit layanan, pekerja, tarif

### ✅ **3. Transaction Dashboard Testing**
- [ ] Akses: `http://localhost:5173/admin/transactions/dashboard`
- [ ] Verifikasi statistics cards (total revenue, transactions, etc.)
- [ ] Check recent transactions list
- [ ] Test quick actions buttons

### ✅ **4. All Transactions Testing**
- [ ] Akses: `http://localhost:5173/admin/transactions`
- [ ] Test filtering by status, service, date
- [ ] Test search functionality
- [ ] Test pagination
- [ ] Test status update actions

### ✅ **5. Transaction Detail Testing**
- [ ] Klik transaction dari list
- [ ] Verifikasi detail lengkap transaction
- [ ] Test status update
- [ ] Test payment confirmation

### ✅ **6. Revenue Analytics Testing**
- [ ] Akses: `http://localhost:5173/admin/transactions/analytics`
- [ ] Verifikasi charts dan metrics
- [ ] Test period filtering (week, month, year)
- [ ] Check top services breakdown

## 🔍 **API ENDPOINT TESTING**

### **Manual API Testing dengan Postman/Thunder Client**

#### 1. **Login Admin**
```http
POST http://localhost:5001/login
Content-Type: application/json

{
  "email": "admin12@gmail.com",
  "password": "admin123"
}
```

#### 2. **Get All Transactions**
```http
GET http://localhost:5001/admin/transactions?page=1&limit=10
Authorization: Bearer YOUR_TOKEN_HERE
```

#### 3. **Get Transaction Stats**
```http
GET http://localhost:5001/admin/transactions/stats
Authorization: Bearer YOUR_TOKEN_HERE
```

#### 4. **Get Revenue Analytics**
```http
GET http://localhost:5001/admin/analytics/revenue?period=month
Authorization: Bearer YOUR_TOKEN_HERE
```

#### 5. **Update Transaction Status**
```http
PUT http://localhost:5001/admin/transactions/TRX001/status
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "status": "completed",
  "notes": "Transaction completed successfully"
}
```

## 🐛 **TROUBLESHOOTING**

### **Problem: "Cannot read properties of undefined"**
**Solution**: 
1. Check browser console for errors
2. Verify API endpoints are responding
3. Check authentication token

### **Problem: "404 Not Found" pada API calls**
**Solution**:
1. Verify backend server is running on port 5001
2. Check route imports in `index.js`
3. Verify endpoint URLs in frontend services

### **Problem: Empty data di dashboard**
**Solution**:
1. Run SQL queries untuk menambah sample data
2. Check database connection
3. Verify API responses in Network tab

### **Problem: Authentication errors**
**Solution**:
1. Clear localStorage: `localStorage.clear()`
2. Login ulang sebagai admin
3. Check JWT token validity

## 📊 **EXPECTED RESULTS**

### **Dashboard Statistics**
- Total Users: 4+ (termasuk admin dan test users)
- Total Transactions: 8+ (dari sample bookings)
- Total Revenue: 2,500,000+ (dari completed bookings)
- Services: 3 (Psikologi, Bengkel, Opo Wae)

### **Transaction List**
- Menampilkan bookings dengan format TRX001, TRX002, etc.
- Status: pending, confirmed, completed, cancelled
- Payment Status: unpaid, pending, paid
- Service types dengan color coding

### **Analytics Data**
- Revenue breakdown by service
- Monthly/daily revenue trends
- Top performing services
- Growth rate calculations

## 🎯 **SUCCESS CRITERIA**

✅ **Admin dapat login dan akses semua fitur**
✅ **CRUD operations berfungsi untuk semua service management**
✅ **Transaction system menampilkan data dari database**
✅ **Analytics menampilkan metrics yang akurat**
✅ **Status updates berfungsi dengan benar**
✅ **Responsive design bekerja di mobile dan desktop**
✅ **Error handling menampilkan pesan yang user-friendly**

## 📞 **SUPPORT**

Jika mengalami masalah:
1. Check browser console untuk error messages
2. Verify database connection dan data
3. Check backend logs untuk API errors
4. Ensure semua dependencies ter-install dengan benar

---

**🎉 Sistem admin Future X siap untuk production setelah semua testing berhasil!**
