import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 شروع فرآیند Seed...');

  // ۱. نقش‌ها
  const roles = ['ADMIN', 'BUYER', 'SELLER'];
  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName, description: `${roleName} role` },
    });
  }
  console.log('✅ نقش‌ها ساخته شدند.');

  // ۲. ادمین پیش‌فرض
  const adminEmail = 'admin@nikou.com';
  const adminPassword = await bcrypt.hash('admin123', 10); 
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash: adminPassword },
    create: {
      email: adminEmail,
      phone: '09120000000',
      passwordHash: adminPassword,
      status: 'ACTIVE',
      profile: { create: { displayName: 'مدیر سیستم', isVerified: true } }
    },
  });
  const adminRole = await prisma.role.findUnique({ where: { name: 'ADMIN' } });
  if (adminRole) {
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: adminUser.id, roleId: adminRole.id } },
      update: {},
      create: { userId: adminUser.id, roleId: adminRole.id }
    });
  }
  console.log('✅ ادمین ساخته شد. (admin@nikou.com / admin123)');

  // ۳. دسته‌بندی‌ها
  const categories = [
    { title: 'کسب‌وکار و خدمات', slug: 'business-services' },
    { title: 'صنعت و ماشین‌آلات', slug: 'industry-machinery' },
    { title: 'مسکن و ساختمان', slug: 'housing-construction' },
    { title: 'ابزار و تجهیزات', slug: 'tools-equipment' },
    { title: 'مواد اولیه', slug: 'raw-materials' },
    { title: 'بسته‌بندی و انبار', slug: 'packaging-warehouse' },
    { title: 'مواد غذایی و نوشیدنی', slug: 'food-beverage' },
    { title: 'بهداشت و زیبایی', slug: 'health-beauty' },
    { title: 'پوشاک و منسوجات', slug: 'apparel-textiles' },
    { title: 'کشاورزی و دامداری', slug: 'agriculture' },
    { title: 'الکترونیک و دیجیتال', slug: 'electronics' },
    { title: 'خودرو و قطعات', slug: 'automotive' },
    { title: 'لوازم خانگی و آشپزخانه', slug: 'home-appliances' }
  ];
  for (const cat of categories) {
    await prisma.category.upsert({ where: { slug: cat.slug }, update: {}, create: cat });
  }
  console.log('✅ دسته‌بندی‌ها ساخته شدند.');

  // ۴. شهرها
  const cities = [
    { name: 'تهران', province: 'تهران' }, { name: 'مشهد', province: 'خراسان رضوی' },
    { name: 'اصفهان', province: 'اصفهان' }, { name: 'شیراز', province: 'فارس' },
    { name: 'تبریز', province: 'آذربایجان شرقی' }, { name: 'کرج', province: 'البرز' },
    { name: 'اهواز', province: 'خوزستان' }, { name: 'قم', province: 'قم' },
    { name: 'کرمانشاه', province: 'کرمانشاه' }, { name: 'ارومیه', province: 'آذربایجان غربی' },
    { name: 'رشت', province: 'گیلان' }, { name: 'زاهدان', province: 'سیستان و بلوچستان' },
    { name: 'همدان', province: 'همدان' }, { name: 'کرمان', province: 'کرمان' },
    { name: 'یزد', province: 'یزد' }, { name: 'اردبیل', province: 'اردبیل' },
    { name: 'بندرعباس', province: 'هرمزگان' }, { name: 'اراک', province: 'مرکزی' },
    { name: 'قزوین', province: 'قزوین' }, { name: 'سنندج', province: 'کردستان' },
    { name: 'گرگان', province: 'گلستان' }, { name: 'ساری', province: 'مازندران' },
    { name: 'بوشهر', province: 'بوشهر' }, { name: 'شهرکرد', province: 'چهارمحال و بختیاری' },
    { name: 'ایلام', province: 'ایلام' }, { name: 'سمنان', province: 'سمنان' },
    { name: 'یاسوج', province: 'کهگیلویه و بویراحمد' }, { name: 'بجنورد', province: 'خراسان شمالی' },
    { name: 'بیرجند', province: 'خراسان جنوبی' }, { name: 'خرم‌آباد', province: 'لرستان' },
  ];
  for (const city of cities) {
    await prisma.city.upsert({ where: { name: city.name }, update: {}, create: city });
  }
  console.log('✅ شهرها ساخته شدند.');

  // ۵. 👈 کشورهای پیش‌فرض (بخش جدید)
  const countries = [
    { name: 'ایران', code: 'IR', flag: '🇮🇷' },
    { name: 'امارات', code: 'AE', flag: '🇦🇪' },
    { name: 'چین', code: 'CN', flag: '🇨🇳' },
    { name: 'ترکیه', code: 'TR', flag: '🇹🇷' },
  ];
  for (const country of countries) {
    await prisma.country.upsert({
      where: { code: country.code },
      update: {},
      create: country
    });
  }
  console.log('✅ کشورهای پیش‌فرض ساخته شدند.');

  console.log('🎉 Seed با موفقیت به پایان رسید!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });