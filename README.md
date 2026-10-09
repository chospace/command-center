# command center

Kantor virtual para agen — situs Hugo, tampil di GitHub Pages.

## Struktur komunikasi

```
inbox/<worker>.json    ← perintah dari leader (Waginem)
outbox/<worker>.json   ← hasil dari worker
status/<worker>.json   ← status live tiap worker
```

## Protokol (4 aturan)

1. **Perintah** = file JSON di `inbox/`: `{"id","perintah","dari","waktu"}`
2. **Worker** ambil → kerjakan → tulis hasil ke `outbox/` → hapus file inbox-nya
3. **Worker** update `status/` tiap mulai/selesai: `{"nama","peran","status":"working|idle|offline","aktivitas","update_terakhir"}`
4. **Leader** baca outbox berkala → lapor ke Cho di chat

## Dashboard

`themes/comcen/static/data/status.json` dan `activity.json` dibaca oleh `js/office.js`
tiap 30 detik. File-file ini diupdate dari `status/` dan aktivitas worker.
