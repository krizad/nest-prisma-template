# 🚀 Quick Start Guide

คู่มือเริ่มต้นใช้งาน NestJS + Prisma Template อย่างรวดเร็ว

## ⚡ การ Setup แบบเร็ว (ใช้ Makefile)

### ขั้นตอนที่ 1: Clone และ Setup

```bash
# Clone repository
git clone <repository-url>
cd nest-prisma-template

# Copy environment variables
cp .env.example .env

# Setup ทั้งหมดด้วยคำสั่งเดียว (install deps + start docker + setup database)
make setup
```

### ขั้นตอนที่ 2: เริ่มต้นพัฒนา

```bash
# Start development server
make dev
```

### ขั้นตอนที่ 3: เข้าถึงแอปพลิเคชัน

- **API**: http://localhost:3000/api
- **Swagger Docs**: http://localhost:3000/api-docs
- **PgAdmin**: http://localhost:5050 (admin@admin.com / admin)

---

## 📋 คำสั่ง Makefile ที่ใช้บ่อย

### การจัดการ Database

```bash
make db-reset       # รีเซ็ต database (ลบและสร้างใหม่)
make db-migrate     # รัน migrations
make db-seed        # Seed ข้อมูล
make db-studio      # เปิด Prisma Studio
```

### การพัฒนา

```bash
make dev            # Start development server
make build          # Build production
make test           # รัน tests
make lint           # ตรวจสอบ code
```

### Docker

```bash
make docker-up      # Start Docker containers
make docker-down    # Stop Docker containers
make docker-logs    # ดู logs
make docker-clean   # ลบ containers และ volumes
```

### อื่นๆ

```bash
make help           # แสดงคำสั่งทั้งหมด
make info           # แสดงข้อมูลโปรเจกต์
make health         # ตรวจสอบสถานะระบบ
make clean-all      # ลบทุกอย่าง (build, deps, docker)
```

---

## 🔄 สถานการณ์ที่พบบ่อย

### Reset Database เพื่อเริ่มต้นใหม่

```bash
make db-reset
```

คำสั่งนี้จะ:
1. หยุด Docker containers
2. ลบ volumes (ลบข้อมูลทั้งหมด)
3. สร้าง containers ใหม่
4. รัน migrations
5. Seed ข้อมูล

### เริ่มต้นใหม่หลังจาก Clone Repo

```bash
make setup
```

คำสั่งนี้จะ:
1. Install dependencies
2. Start Docker containers
3. รอให้ PostgreSQL พร้อม
4. สร้าง database schema
5. Seed ข้อมูล

### ดู Database ด้วย GUI

```bash
make db-studio
```

จะเปิด Prisma Studio ที่ http://localhost:5555

---

## 🛠️ การแก้ไขปัญหา

### Database Connection ล้มเหลว

```bash
# ตรวจสอบว่า PostgreSQL ทำงานอยู่หรือไม่
docker-compose ps

# รีสตาร์ท Docker
make docker-restart

# ตรวจสอบ logs
make docker-logs
```

### ลืม Environment Variables

```bash
# ตรวจสอบว่ามี .env หรือไม่
make check-env
```

### ต้องการเริ่มต้นใหม่ทั้งหมด

```bash
# ลบทุกอย่างและเริ่มใหม่
make clean-all
make setup
```

---

## 📚 เอกสารเพิ่มเติม

- [README.md](./README.md) - เอกสารหลักแบบละเอียด
- [ARCHITECTURE.md](./ARCHITECTURE.md) - สถาปัตยกรรมระบบ
- [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) - โครงสร้างโฟลเดอร์
- [JWT_CONFIGURATION.md](./JWT_CONFIGURATION.md) - การตั้งค่า JWT

---

## 🎯 Next Steps

หลังจาก setup เสร็จ คุณสามารถ:

1. ทดสอบ API ด้วย Swagger: http://localhost:3000/api-docs
2. ดูข้อมูลใน database ด้วย Prisma Studio: `make db-studio`
3. เริ่มพัฒนา features ใหม่ใน `src/modules/`
4. เขียน tests ใน `test/`
5. อ่านเอกสารสถาปัตยกรรมใน [ARCHITECTURE.md](./ARCHITECTURE.md)

---

**Happy Coding! 🚀**
