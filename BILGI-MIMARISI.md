# Ay Yapı Dijital Platform — Bilgi Mimarisi

## Ana kullanıcı yolları

1. İhtiyaç → Ürün danışmanı → Karşılaştırma → Ön fiyat → Teklif
2. Arıza → Kepenk Doktoru → Güvenli ön kontrol → Servis talebi → Takip
3. Organik arama → Bilgi merkezi → Ürün/hizmet → Fiyat/teklif
4. Mevcut müşteri → QR ürün kartı → Garanti/bakım → Servis

## Sayfa ağacı

```text
/
├── urunler/
│   ├── otomatik-kepenk/
│   ├── celik-kepenk/
│   ├── seffaf-kepenk/
│   ├── otomatik-panjur/
│   ├── otomatik-kapilar/
│   ├── fotoselli-kapilar/
│   ├── garaj-kapilari/
│   ├── bahce-kapisi-motorlari/
│   ├── bariyer-sistemleri/
│   ├── kepenk-motorlari/
│   ├── kumanda-alici-kartlari/
│   └── ups-guc-kaynaklari/
├── cozumler/
│   ├── is-yerleri/ · magazalar/ · fabrikalar/ · depolar/
│   └── garajlar/ · apartmanlar/ · otoparklar/ · endustriyel-alanlar/
├── urun-danismani/
├── kepengini-tasarla/
├── karsilastir/
├── kepenk-fiyat-hesapla/
├── teklif-al/
├── teknik-servis/
│   ├── kepenk-doktoru/
│   ├── servis-talebi/
│   └── servis-takip/
├── projeler/
├── kepenk-rehberi/
│   ├── kepenk-rehberi/
│   ├── teknik-rehber/
│   ├── motor-rehberi/
│   ├── otomatik-kapi-rehberi/
│   ├── fiyat-rehberi/
│   └── bakim-servis/
├── hizmet-bolgeleri/
│   └── yalnız gerçek hizmet/proje verisi olan özgün yerel sayfalar
├── hakkimizda/ · iletisim/
├── musteri/
│   ├── tekliflerim/ · siparislerim/ · projelerim/
│   ├── servis-taleplerim/ · garantilerim/ · bakim-gecmisim/
│   └── belgelerim/
├── urun-karti/{qr-kodu}/
└── kvkk/ · gizlilik/ · cerez-politikasi/ · kullanim-sartlari/
```

## Fazlama

- Faz 1: Ana sayfa, ürünler, fiyat, teklif, servis, doktor, rehber, projeler ve temel CMS.
- Faz 2: Müşteri paneli, QR kart, servis takibi, yönetilebilir fiyat motoru.
- Faz 3: Güvenlik sınırları tanımlı Kepenk Asistanı, CRM ve otomatik teklif akışları.

## Veri ve güven ilkesi

Gerçek müşteri yorumu, proje, sertifika, garanti süresi, adres ve fiyat parametreleri doğrulanmadan yayınlanmaz. Demo fiyat motoru yalnızca arayüz davranışını göstermek için örnek parametre kullanır; ticari teklif değildir.
