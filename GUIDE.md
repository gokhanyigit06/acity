# Acity AVM - Web Sitesi Yönetim ve Teknik Kılavuzu

Bu proje **Next.js 15**, **Tailwind CSS** ve **Supabase** kullanılarak geliştirilmiş modern bir web uygulamasıdır. Aşağıda projenin kurulumu, yönetimi ve düzenlenmesi ile ilgili detaylı bilgiler yer almaktadır.

## 1. Başlangıç ve Kurulum

Projeyi yerel bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyebilirsiniz.

### Gereksinimler
- Node.js (v18 veya üzeri önerilir)
- npm veya yarn paket yöneticisi
- Git

### Kurulum Adımları
1. **Projeyi Çekin:**
   ```bash
   git clone <REPO_URL>
   cd Acity
   ```

2. **Bağımlılıkları Yükleyin:**
   ```bash
   npm install
   ```

3. **Çevresel Değişkenleri Ayarlayın:**
   Projeyi çalıştırmak için `.env.local` dosyasına ihtiyacınız vardır. Bu dosya Supabase bağlantı bilgilerini içerir.
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```

4. **Geliştirme Sunucusunu Başlatın:**
   ```bash
   npm run dev
   ```
   Tarayıcınızda `http://localhost:3000` adresine giderek siteyi görüntüleyebilirsiniz.

---

## 2. Yönetim Paneli (Admin)

Web sitesinin dinamik içeriklerinin çoğu (Mağazalar, Etkinlikler, Slider vb.) **Admin Paneli** üzerinden yönetilebilir.

*   **Giriş Adresi:** `/admin` (örnek: `acity.com.tr/admin`)
*   **Yetkilendirme:** Şu an için temel bir giriş sistemi veya Supabase Auth kullanılmaktadır. 

### Admin Modülleri:

*   **Mağazalar (Stores):** `/admin/stores`
    *   Mağaza ekleme, düzenleme, silme.
    *   Kategori atama, logo ve kapak görseli yükleme.
    *   Kat (Floor) bilgisi güncelleme.
*   **Etkinlikler (Events):** `/admin/events`
    *   Yeni etkinlik oluşturma.
    *   Etkinlik görseli, tarihi ve açıklamasını girme.
*   **Slider Yönetimi:** `/admin/slider`
    *   Ana sayfadaki büyük kayan görselleri (slider) buradan yönetebilirsiniz.
    *   Sıralama (Order) belirleyerek görsellerin çıkış sırasını değiştirebilirsiniz.
*   **Site Ayarları:** `/admin/settings`
    *   Genel site ayarları, metinler veya yapılandırmalar.
*   **Toplu İşlemler:**
    *   `Bulk Stores` ve `Bulk Logos`: Çoklu mağaza veya logo yüklemek için kullanılır.

---

## 3. Kod Üzerinden Düzenlemeler

Bazı sayfalar ve içerikler veritabanı yerine doğrudan kod içerisinde (statik olarak) tutulmaktadır. Bu alanları değiştirmek için ilgili `tsx` dosyalarını düzenlemeniz gerekir.

### A. Hizmetler Sayfası (`app/hizmetler/page.tsx`)
Hizmet ikonlarını veya isimlerini değiştirmek için bu dosyayı düzenleyin.
*   **İkon Değişimi:**
    *   Standart ikonlar `lucide-react` kütüphanesinden gelir.
    *   Özel ikonlar (Mescit, WC vb.) `public/` klasörüne atılan PNG görselleri kullanır.
    *   Özel bir ikon eklerken `maskImage` stili kullanılarak rengin CSS ile (hover durumunda) değişmesi sağlanmıştır.

### B. Menü ve Alt Bilgi (Header & Footer)
*   **Menü (Navbar):** `components/layout/Navbar.tsx`
    *   Menü linklerini, sırasını veya isimlendirmelerini buradan değiştirebilirsiniz.
*   **Alt Bilgi (Footer):** `components/layout/Footer.tsx`
    *   Adres, telefon, sosyal medya linkleri ve footer menüleri burada yer alır.

### C. Ana Sayfa (`app/page.tsx`)
*   Ana sayfanın genel yapısı, hangi bileşenlerin (Hero, HomeSections, Events vb.) hangi sırada çağrılacağı burada belirlenir.
*   `components/home/` klasörü altındaki bileşenler ana sayfanın parçalarıdır.

---

## 4. İkon ve Görsel Yönetimi

*   **Statik Görseller:** Projenin `public/` klasöründe yer alır. Buraya attığınız bir dosyaya site içerisinde `/dosya-adi.png` şeklinde erişebilirsiniz.
*   **Dinamik Görseller:** Admin panelinden yüklenen görseller Supabase Storage üzerinde tutulur.

## 5. Canlıya Alma (Deployment)

Proje Vercel (veya benzeri bir platform) üzerinde barındırılmaya uygundur.
*   GitHub'daki `main` dalına (branch) yapılan her `push` işlemi (yeni kod gönderimi), otomatik olarak canlı siteyi güncelleyecektir (CI/CD kurulu ise).

---

## Önemli Notlar
*   **Veritabanı:** Supabase kullanıldığı için veritabanı şeması değişikliklerini `migration` dosyaları ile veya Supabase paneli üzerinden yönetmelisiniz.
*   **Typescript:** Proje TypeScript ile yazılmıştır. Tip güvenliği (type safety) için `.ts` ve `.tsx` dosyalarındaki veri yapılarına dikkat ediniz.


## VOGOLAB.COM Powered By Gokhanyigit