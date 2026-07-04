# Proje Sonuçları - CV için

## DB Index Optimizasyonu
- Composite index: (userId, status)
- 300K+ kayıt üzerinde test edildi
- Query execution time: 19.35ms → 1.26ms (~15x iyileşme)
- Query plan: Seq Scan → Bitmap Index Scan

## Redis Cache
- Cache-aside pattern: GET /api/applications, 60s TTL
- Cache key: applications:user:{userId}
- POST/PATCH/DELETE işlemlerinde ilgili kullanıcının cache'i invalidate ediliyor

## Load Test: Before vs After (Redis Cache)
- Before: 773 req/sec avg, latency avg 128.7ms, p99 219ms (23k req / 30s)
- After:  938 req/sec avg, latency avg 105.9ms, p99 242ms (28k req / 30s)
- ~21% req/sec artışı
- (Not: bu test tek kullanıcıda 1 satırlık veriyle yapıldı)

## Load Test: Gerçekçi Veri Seti (10.000 satır / kullanıcı)
- Bir kullanıcıya 10.000 satır seed edilip aynı load test (100 connection, 30s)
  hem CACHE_ENABLED=false hem cache'li olarak tekrar çalıştırıldı, sonra veri
  temizlendi. Detay: benchmarks/after-realistic.txt
- Cache'siz: 392 istek, %74 timeout, avg req/sec 0.07
- Cache'li:  532 istek (+%36), %19 timeout, avg req/sec 11.07
- Önemli bulgu: cache timeout oranını iyileştiriyor ama asıl darboğaz
  10.000 satırlık JSON response boyutu (~2.5 MB/istek). Bu ölçekte cache tek
  başına yeterli değil — GET /api/applications'a pagination eklenmeli.

