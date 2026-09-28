// Kuytu Medya - içerik API'si
// GET  /api/content  -> mevcut site metinlerini JSON olarak döndürür
// POST /api/content  -> yeni metinleri kaydeder (x-admin-password header'ı zorunlu)

const DEFAULTS = {
  hero_strip: "Web · Fotoğraf &amp; Video · Marka Kimliği · Dijital Sistemler",
  hero_title: "İyi işler görünür<br>olmayı hak eder.",
  hero_desc: "Fikirlerinizi, markanızı ve ürünlerinizi kalıcı bir estetikle buluşturuyoruz. Gereksiz karmaşıklıktan uzak, yüksek etkili web tasarımları, sinematik görsel prodüksiyonlar ve güçlü marka kimlikleri inşa ediyoruz.",

  quick1_num: "01 · ÇÖZÜM", quick1_label: "Web Tasarım &amp; Geliştirme",
  quick2_num: "02 · GÖRSEL", quick2_label: "Fotoğraf &amp; Video Prodüksiyonu",
  quick3_num: "03 · KİMLİK", quick3_label: "Marka Kimliği &amp; Tipografi",
  quick4_num: "04 · SİSTEM", quick4_label: "QR Ekosistemleri &amp; Otomasyon",

  hizmetler_title: "Hizmetlerimiz",
  hizmetler_desc: "Fiziksel ve dijital temas noktalarında markanızın etkisini ve duruşunu güçlendiren yaratıcı disiplinler.",

  svc1_title: "Web Tasarım &amp; Dijital Çözümler",
  svc1_desc: "Yüksek performanslı web siteleri, açılış sayfaları ve etkileşimli deneyimler.",
  svc2_title: "Fotoğraf &amp; Video Prodüksiyonu",
  svc2_desc: "Sinematik ticari çekimler, mekan belgeseli ve dikey reels içerikleri.",
  svc3_title: "Marka Kimliği &amp; Grafik Tasarım",
  svc3_desc: "Tipografik logolar, seçkin baskı materyalleri ve kurumsal kimlik.",
  svc4_title: "Dijital Çözümler &amp; Otomasyonlar",
  svc4_desc: "Akıllı QR ekosistemleri, müşteri giriş otomasyonları ve operasyonel araçlar.",

  surec_title: "Çalışma Sürecimiz",
  surec_desc: "Belirsizlikleri ortadan kaldıran, net aşamalar sunan ve teslim tarihlerine sadık kalan dört aşamalı iş birliği modeli.",

  step1_title: "Keşif &amp; Kapsam", step1_sub: "Önce sizi dinliyoruz",
  step1_desc: "Kısa bir görüşmeyle markanızı, hedef kitlenizi ve bu projeden ne beklediğinizi anlıyoruz. Kapsamı ve teslim takvimini birlikte netleştirip yola öyle çıkıyoruz.",
  step2_title: "Strateji &amp; Yaratıcı Yön", step2_sub: "İşin nasıl görüneceğine karar veriyoruz",
  step2_desc: "Renkleri, tipografiyi ve genel atmosferi kurguluyoruz. Kodlamaya geçmeden önce size bir tasarım taslağı sunuyor, beğenmediğiniz yerleri birlikte değiştiriyoruz.",
  step3_title: "Üretim &amp; Geliştirme", step3_sub: "Onayladığınız tasarımı hayata geçiriyoruz",
  step3_desc: "Ekibimiz üretimi yürütür, ilerlemeyi canlı bir önizleme linkiyle takip edebilir, istediğiniz an geri bildirim verebilirsiniz.",
  step4_title: "Yayınlama &amp; Teslim", step4_sub: "Son rötuşlar ve yayına alış",
  step4_desc: "Siteyi veya içeriği yayına alıyor, tüm kaynak dosyaları size teslim ediyoruz. İlk 30 gün boyunca ortaya çıkabilecek küçük sorunlar için yanınızdayız.",

  cta_title: "Proje zaman planınızı birlikte oluşturalım mı?",
  cta_desc: "İlk görüşmemizin ardından 48 saat içinde kapsamlı ve net teklif sunuyoruz.",

  iletisim_title: "İletişime Geçin",
  iletisim_desc: "Markanızın hedefleri, takvimi ve vizyonu hakkında bize bilgi verin. Proje talebinizi inceleyip size özel bir yol haritasıyla dönüş yapıyoruz.",
  badge_text: "Yeni Projeler İçin Açık",

  email: "contact@kuytumedya.com",
  whatsapp_number: "905438472983",
  whatsapp_display: "0543 847 29 83",
  instagram_handle: "@kuytumedya",
  instagram_url: "https://instagram.com/kuytumedya",

  footer_desc: "Özgün görsel kimlikler, sinematik fotoğraf &amp; video prodüksiyonları ve özel dijital çözümler üreten bağımsız yaratıcı stüdyo.",
  motto: "\"İyi işler görünür olmayı hak eder.\"",
  motto_sub: "Web, medya ve marka sistemleri genelinde seçkin projeler için yeni iş birliklerine açığız.",
  copyright_text: "© 2026 Kuytu Medya. Tüm hakları saklıdır."
};

export async function onRequestGet({ env }) {
  let data = DEFAULTS;
  try {
    const stored = await env.CONTENT_KV.get("site-content", "json");
    if (stored) data = Object.assign({}, DEFAULTS, stored);
  } catch (e) {
    // KV bağlı değilse veya boşsa varsayılan metinlerle devam et
  }
  return new Response(JSON.stringify(data), {
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
  });
}

export async function onRequestPost({ request, env }) {
  const password = request.headers.get("x-admin-password") || "";
  if (!env.ADMIN_PASSWORD || password !== env.ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json; charset=utf-8" }
    });
  }
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: "invalid_json" }), {
      status: 400,
      headers: { "content-type": "application/json; charset=utf-8" }
    });
  }
  try {
    await env.CONTENT_KV.put("site-content", JSON.stringify(body));
  } catch (e) {
    return new Response(JSON.stringify({ error: "kv_write_failed" }), {
      status: 500,
      headers: { "content-type": "application/json; charset=utf-8" }
    });
  }
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}
