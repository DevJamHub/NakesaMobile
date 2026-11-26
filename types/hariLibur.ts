//B1 Interface: membuat cetakan bentuk datanya dulu. (siapkan piring sesuai bentuk makanan)
export interface HariLibur { // [1]
    date: string;                       // "2026-12-25"
    name: string;                       // "Christmas Day"
    countryCode: string;                // "ID"
    nationalHoliday: boolean;           // true
    subdivisionCodes: string[] | null;  // [2]
    holidayTypes: string[];             // ["Public"]
}

export type StatusCekLibur = "memuat" | "berhasil" | "gagal"; // [3]

/* ======================== EXPLANATION ========================
[1]: Interface untuk SATU object hari libur dari External API Nager.Date versi 4
(https://nagerholidays.com/api/v4/Holidays/ID/2026). Nama dan jenis setiap field dibuat sama persis dengan
"Response Model" di halaman https://nagerholidays.com/api, supaya hasil respon.json() bisa langsung dimasukkan
ke object bertipe HariLibur. Contoh satu object dari server:
{ "date": "2026-12-25", "name": "Christmas Day", "countryCode": "ID", "nationalHoliday": true,
  "subdivisionCodes": null, "holidayTypes": ["Public"] }
Server mengirim ARRAY of objects, jadi hasil lengkapnya bertipe HariLibur[].
[2]: string[] | null artinya isinya boleh array of string ATAU null. Server mengirim null untuk Indonesia,
karena hari liburnya berlaku di seluruh negeri (tidak per provinsi).
[3]: Union type untuk tahap pengecekan di component InfoHariLibur:
- "memuat": request ke server sedang berjalan (Promise masih pending)
- "berhasil": data sudah diterima (Promise resolve)
- "gagal": tidak ada internet, server error, atau terlalu lama (Promise reject)
=================================================================*/
