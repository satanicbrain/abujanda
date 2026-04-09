'use client';

import { useEffect, useMemo, useState } from 'react';
import LogoutButton from './logout-button';

type ContactRecord = {
  id: string;
  name: string;
  phone: string;
  location: string;
  category: string;
  communication: string;
  notes: string;
  createdAt: string;
};

type FormState = {
  name: string;
  phone: string;
  location: string;
  category: string;
  communication: string;
  notes: string;
};

type FolkloreEntry = {
  title: string;
  family: string;
  summary: string;
  requirements: string[];
  steps: string[];
  benefits: string[];
};

const STORAGE_KEY = 'abujanda_contacts_v1';

const menus = [
  'Data Janda & Binor',
  'Rayuan Maut',
  'Mantra Pemikat',
  'Mantra Iclik',
];

const flirtingModels = [
  { stage: 'Perkenalan', text: 'Halo, aku lihat kamu punya aura yang tenang. Boleh kenalan pelan-pelan?' },
  { stage: 'Perkenalan', text: 'Hai, aku suka caramu membawa diri. Senang bisa menyapa kamu hari ini.' },
  { stage: 'Perkenalan', text: 'Halo, semoga harimu ringan. Aku ingin mulai dengan salam yang sopan dulu.' },
  { stage: 'Perkenalan', text: 'Hai, aku tertarik kenal lebih dekat karena kamu terlihat hangat dan menyenangkan.' },
  { stage: 'Perkenalan', text: 'Halo, aku datang tanpa banyak basa-basi, cuma ingin bilang kamu menarik untuk diajak ngobrol.' },
  { stage: 'Pembuka obrolan', text: 'Kalau boleh tahu, akhir-akhir ini hal kecil apa yang paling bikin kamu senang?' },
  { stage: 'Pembuka obrolan', text: 'Aku penasaran, kamu tipe yang suka tempat ramai atau sudut yang tenang?' },
  { stage: 'Pembuka obrolan', text: 'Kalau hari ini punya waktu luang, biasanya kamu isi dengan hal apa?' },
  { stage: 'Pembuka obrolan', text: 'Aku suka ngobrol yang santai. Kamu lebih nyaman bahas hal lucu atau hal yang sedikit personal?' },
  { stage: 'Pembuka obrolan', text: 'Boleh aku tahu satu hal sederhana yang menggambarkan dirimu dengan jujur?' },
  { stage: 'Membangun kenyamanan', text: 'Ngobrol sama kamu enak ya, terasa ringan tapi tetap ada isi.' },
  { stage: 'Membangun kenyamanan', text: 'Aku suka ritme obrolan kita. Tidak terburu-buru, tapi tetap terasa dekat.' },
  { stage: 'Membangun kenyamanan', text: 'Kamu punya cara bicara yang bikin orang betah mendengar.' },
  { stage: 'Membangun kenyamanan', text: 'Aku merasa kamu tipe orang yang nyaman diajak cerita tanpa banyak drama.' },
  { stage: 'Membangun kenyamanan', text: 'Semakin ngobrol, aku makin merasa kamu orang yang tulus dan menyenangkan.' },
  { stage: 'Pujian elegan', text: 'Ada kesan dewasa dalam caramu merespons, itu menarik buatku.' },
  { stage: 'Pujian elegan', text: 'Kamu tidak perlu berlebihan untuk terlihat menawan.' },
  { stage: 'Pujian elegan', text: 'Yang paling menarik dari kamu justru vibe tenangmu itu.' },
  { stage: 'Pujian elegan', text: 'Aku suka energimu, terasa lembut tapi tetap kuat.' },
  { stage: 'Pujian elegan', text: 'Caramu bicara punya daya tarik yang tidak dibuat-buat.' },
  { stage: 'Mencairkan suasana', text: 'Kalau aku terlalu serius, ingatkan ya. Kadang aku kalah santai kalau lawan bicaranya menarik.' },
  { stage: 'Mencairkan suasana', text: 'Aku berusaha tetap tenang, tapi obrolan ini diam-diam bikin aku senyum sendiri.' },
  { stage: 'Mencairkan suasana', text: 'Harus jujur, kamu punya cara halus bikin suasana jadi lebih hangat.' },
  { stage: 'Mencairkan suasana', text: 'Obrolan seperti ini bikin hari biasa terasa lebih hidup.' },
  { stage: 'Mencairkan suasana', text: 'Kalau begini terus, bisa-bisa aku ketagihan ngobrol sama kamu.' },
  { stage: 'Ketertarikan halus', text: 'Aku menikmati obrolan ini, dan sejujurnya aku ingin kenal kamu lebih jauh.' },
  { stage: 'Ketertarikan halus', text: 'Ada rasa penasaran yang baik setiap kali aku membaca balasanmu.' },
  { stage: 'Ketertarikan halus', text: 'Aku merasa ada koneksi yang tumbuh pelan, dan itu menyenangkan.' },
  { stage: 'Ketertarikan halus', text: 'Bukan cuma seru, ngobrol sama kamu juga terasa tulus.' },
  { stage: 'Ketertarikan halus', text: 'Aku suka bagaimana percakapan kita berjalan tanpa dipaksa.' },
  { stage: 'Rayuan sopan', text: 'Kalau seseorang bisa bikin aku menunggu notifikasi dengan senang, mungkin itu kamu.' },
  { stage: 'Rayuan sopan', text: 'Aku tidak sedang mencari kalimat paling hebat, cuma ingin jujur kalau aku suka ngobrol denganmu.' },
  { stage: 'Rayuan sopan', text: 'Ada orang yang menarik di mata, ada juga yang menarik di hati saat diajak bicara. Kamu dua-duanya.' },
  { stage: 'Rayuan sopan', text: 'Kamu membuat percakapan sederhana terasa punya makna.' },
  { stage: 'Rayuan sopan', text: 'Kalau kenyamanan bisa punya bentuk, mungkin rasanya seperti ngobrol denganmu.' },
  { stage: 'Arah lebih dekat', text: 'Kalau kamu nyaman, aku ingin kita lanjut saling kenal dengan ritme yang pelan tapi konsisten.' },
  { stage: 'Arah lebih dekat', text: 'Aku tidak ingin terburu-buru, tapi aku juga tidak ingin kehilangan kesempatan kenal lebih dalam.' },
  { stage: 'Arah lebih dekat', text: 'Menurutku kedekatan yang baik dibangun dari rasa aman. Aku ingin memulai dari sana.' },
  { stage: 'Arah lebih dekat', text: 'Kalau kamu berkenan, aku ingin jadi orang yang membuat harimu sedikit lebih ringan.' },
  { stage: 'Arah lebih dekat', text: 'Aku tertarik membangun komunikasi yang dewasa, hangat, dan saling menghargai.' },
  { stage: 'Ajakan ringan', text: 'Kalau kamu nyaman, kita bisa lanjut ngobrol di waktu yang lebih santai nanti malam.' },
  { stage: 'Ajakan ringan', text: 'Kalau berkenan, aku ingin mengajak kamu minum kopi atau teh sambil ngobrol santai.' },
  { stage: 'Ajakan ringan', text: 'Boleh ya suatu saat kita bertemu di tempat yang nyaman dan sederhana?' },
  { stage: 'Ajakan ringan', text: 'Kalau kamu merasa cocok, aku ingin ajak kamu quality time tanpa suasana yang ribet.' },
  { stage: 'Ajakan ringan', text: 'Aku ingin mengundangmu ke percakapan yang lebih hangat, tentu kalau kamu juga ingin.' },
  { stage: 'Ajakan kencan', text: 'Aku ingin mengajakmu makan malam santai. Tidak harus mewah, yang penting nyaman untuk kita ngobrol.' },
  { stage: 'Ajakan kencan', text: 'Kalau kamu setuju, kita bisa atur pertemuan sederhana yang membuat kita saling kenal lebih nyata.' },
  { stage: 'Ajakan kencan', text: 'Aku ingin mengajakmu bertemu dengan niat baik, tanpa memaksa, hanya menikmati waktu bersama.' },
  { stage: 'Ajakan kencan', text: 'Kalau hatimu bilang aman, aku ingin jadi teman ngobrolmu di dunia nyata juga.' },
  { stage: 'Ajakan kencan', text: 'Aku suka komunikasi yang jelas, jadi aku bilang terus terang: aku ingin mengajakmu berkencan dengan sopan.' },
];

const pemikatEntries: FolkloreEntry[] = [
  {
    title: 'Pengasihan Tatapan Teduh',
    family: 'Pengasihan',
    summary: 'Laku tradisional untuk membangun kesan tenang, hangat, dan tidak meledak-ledak saat bertemu orang lain.',
    requirements: ['Niat baik dan tidak memaksa orang lain.', 'Menjaga kebersihan diri dan pakaian.', 'Menentukan waktu hening 5–10 menit sebelum berinteraksi.'],
    steps: ['Duduk tenang sambil menata napas 9 hitungan.', 'Fokus pada niat agar pembawaan terlihat lembut dan sopan.', 'Sebelum bertemu orang, biasakan menatap dengan wajar lalu senyum tipis.'],
    benefits: ['Membantu tampil lebih kalem.', 'Membentuk kesan pertama yang nyaman.', 'Baik untuk melatih kontrol ekspresi.'],
  },
  {
    title: 'Pengasihan Pemanis Bicara',
    family: 'Pengasihan',
    summary: 'Folklor yang menekankan pemilihan kata halus agar komunikasi terasa enak didengar.',
    requirements: ['Menghindari kata kasar sepanjang hari.', 'Membiasakan jeda sebelum menjawab.', 'Menata niat untuk bicara jujur dan tidak menyakiti.'],
    steps: ['Pagi hari siapkan tiga kalimat positif untuk diri sendiri.', 'Saat berbicara, gunakan tempo pelan dan intonasi stabil.', 'Tutup percakapan dengan ucapan baik, terima kasih, atau doa singkat.'],
    benefits: ['Ucapan terdengar lebih dewasa.', 'Mengurangi salah paham.', 'Meningkatkan simpati secara natural.'],
  },
  {
    title: 'Pengasihan Aura Wibawa',
    family: 'Pengasihan',
    summary: 'Laku batin yang diarahkan untuk membangun kharisma tanpa harus banyak bicara.',
    requirements: ['Postur tubuh tegak dan tidak gugup.', 'Konsisten menjaga penampilan rapi.', 'Tidak memamerkan diri berlebihan.'],
    steps: ['Latih berdiri tegak selama beberapa menit.', 'Tarik napas dalam, hembuskan perlahan, lalu diam sejenak.', 'Masuk ke ruang pertemuan dengan langkah tenang dan tatapan stabil.'],
    benefits: ['Pembawaan terlihat matang.', 'Lebih percaya diri di depan orang banyak.', 'Baik untuk perkenalan formal atau santai.'],
  },
  {
    title: 'Pengasihan Penarik Simpati',
    family: 'Pengasihan',
    summary: 'Tradisi laku yang menekankan empati, mendengar, dan rasa hormat agar orang mudah nyaman.',
    requirements: ['Bersedia mendengar lebih banyak daripada bicara.', 'Menghindari debat yang tidak perlu.', 'Menjaga emosi tetap landai.'],
    steps: ['Saat bertemu, beri ruang lawan bicara menyelesaikan kalimatnya.', 'Ulang singkat poin penting agar ia merasa didengar.', 'Tutup obrolan dengan kesan hangat dan tidak memaksa.'],
    benefits: ['Orang lain merasa dihargai.', 'Hubungan lebih cepat cair.', 'Membangun kedekatan yang sehat.'],
  },
  {
    title: 'Pengasihan Senyum Halus',
    family: 'Pengasihan',
    summary: 'Laku sederhana yang berfokus pada ekspresi ramah sebagai pembuka hubungan.',
    requirements: ['Wajah rileks dan tidak tegang.', 'Hindari memaksakan ekspresi.', 'Biasakan kontak mata singkat yang sopan.'],
    steps: ['Latih senyum tipis di depan cermin.', 'Gunakan saat menyapa atau membuka percakapan.', 'Tetap jaga ritme bicara santai sesudahnya.'],
    benefits: ['Membuat suasana lebih ringan.', 'Memberi kesan tidak mengintimidasi.', 'Cocok untuk pertemuan awal.'],
  },
  {
    title: 'Pengasihan Pembuka Hati',
    family: 'Pengasihan',
    summary: 'Kajian kejawen yang menekankan niat bersih agar hubungan dimulai dengan rasa hormat.',
    requirements: ['Tidak memiliki niat mempermainkan orang.', 'Mau konsisten bersikap sopan.', 'Menyiapkan doa atau afirmasi sesuai keyakinan.'],
    steps: ['Mulai hari dengan niat baik dan syukur.', 'Saat berinteraksi, fokus pada kejujuran dan ketulusan.', 'Jangan terburu-buru meminta balasan atau kepastian.'],
    benefits: ['Relasi terasa lebih tenang.', 'Mencegah komunikasi yang tergesa-gesa.', 'Membiasakan hati lebih sabar.'],
  },
  {
    title: 'Pengasihan Suara Tenang',
    family: 'Pengasihan',
    summary: 'Laku tradisional untuk menata nada suara agar terdengar lembut dan meyakinkan.',
    requirements: ['Menjaga tubuh tetap rileks.', 'Tidak berbicara dalam emosi tinggi.', 'Biasakan minum air dan bicara perlahan.'],
    steps: ['Sebelum berbicara, tarik napas panjang dua kali.', 'Gunakan kalimat pendek dan jelas.', 'Jaga volume suara tetap sedang dari awal sampai akhir.'],
    benefits: ['Suara lebih enak didengar.', 'Kesan tenang lebih kuat.', 'Baik untuk telepon maupun tatap muka.'],
  },
  {
    title: 'Pengasihan Perkenalan Rapi',
    family: 'Pengasihan',
    summary: 'Folklor pergaulan yang menggabungkan sikap, tutur kata, dan penampilan saat membuka koneksi baru.',
    requirements: ['Kenali tujuan perkenalan dengan jelas.', 'Hadir tepat waktu.', 'Gunakan pakaian sederhana namun bersih.'],
    steps: ['Mulai dengan salam dan sebut nama dengan jelas.', 'Sampaikan maksud kenalan secara ringan.', 'Akhiri dengan memberi ruang agar lawan bicara tidak tertekan.'],
    benefits: ['Perkenalan terasa dewasa.', 'Mengurangi kesan agresif.', 'Membantu hubungan berkembang lebih natural.'],
  },
  {
    title: 'Pengasihan Peluluh Suasana',
    family: 'Pengasihan',
    summary: 'Laku untuk melembutkan suasana kaku melalui empati, candaan ringan, dan sikap santun.',
    requirements: ['Peka melihat mood orang lain.', 'Tidak memaksakan humor.', 'Sabar menunggu timing yang tepat.'],
    steps: ['Masuk percakapan dengan topik aman.', 'Gunakan candaan ringan bila situasi memungkinkan.', 'Kembalikan fokus ke rasa nyaman dan saling menghargai.'],
    benefits: ['Percakapan lebih cair.', 'Mengurangi ketegangan saat awal kenal.', 'Membantu orang lain merasa aman.'],
  },
  {
    title: 'Pengasihan Penjaga Hubungan',
    family: 'Pengasihan',
    summary: 'Laku simbolik untuk menjaga hubungan tetap hangat melalui konsistensi, perhatian, dan tutur lembut.',
    requirements: ['Tidak menghilang tanpa kabar.', 'Menjaga kata-kata saat marah.', 'Mau meminta maaf bila salah.'],
    steps: ['Sisihkan waktu untuk menyapa dengan niat baik.', 'Saat ada salah paham, utamakan klarifikasi pelan.', 'Rawat kedekatan lewat perhatian kecil yang tulus.'],
    benefits: ['Komunikasi lebih stabil.', 'Hubungan tidak mudah renggang.', 'Melatih kesetiaan dalam sikap.'],
  },
];

const iclikEntries: FolkloreEntry[] = [
  {
    title: 'Penglarisan Rezeki Pagi',
    family: 'Penglarisan',
    summary: 'Laku tradisional yang mengutamakan pembukaan usaha dengan niat bersih dan suasana rapi sejak pagi.',
    requirements: ['Tempat usaha bersih sebelum buka.', 'Mencatat target sederhana hari itu.', 'Mulai dengan ucapan syukur atau doa sesuai keyakinan.'],
    steps: ['Buka ruang usaha lebih awal.', 'Rapikan area depan agar terasa mengundang.', 'Mulai pelayanan pertama dengan sikap ramah dan fokus.'],
    benefits: ['Membangun energi kerja yang tertata.', 'Meningkatkan kesiapan melayani.', 'Menciptakan kesan awal yang baik untuk pelanggan.'],
  },
  {
    title: 'Penglarisan Penarik Pelanggan',
    family: 'Penglarisan',
    summary: 'Folklor usaha yang menekankan keramahan, kebersihan, dan keterbukaan sebagai daya tarik utama.',
    requirements: ['Area usaha terang dan tidak berantakan.', 'Bahasa pelayanan sopan.', 'Harga dan informasi jelas.'],
    steps: ['Sambut pelanggan dengan tatapan dan salam sopan.', 'Jelaskan produk atau jasa dengan jujur.', 'Akhiri transaksi dengan ucapan terima kasih.'],
    benefits: ['Pelanggan lebih nyaman kembali.', 'Kepercayaan meningkat.', 'Usaha tampak profesional.'],
  },
  {
    title: 'Penglarisan Toko Kecil',
    family: 'Penglarisan',
    summary: 'Laku untuk usaha rumahan atau toko kecil agar terasa hidup, ramah, dan dipercaya lingkungan sekitar.',
    requirements: ['Menjaga stok rapi.', 'Mencatat barang masuk keluar.', 'Menyediakan area depan yang bersih.'],
    steps: ['Periksa stok utama tiap pagi.', 'Susun barang paling dicari di area mudah dilihat.', 'Catat pelanggan tetap dan kebiasaannya secara sopan.'],
    benefits: ['Toko terasa terurus.', 'Pelanggan mudah menemukan barang.', 'Meningkatkan repeat order.'],
  },
  {
    title: 'Penglarisan Warung Ramah',
    family: 'Penglarisan',
    summary: 'Tradisi usaha yang fokus pada keramahan pemilik, kehangatan suasana, dan pelayanan cepat.',
    requirements: ['Menjaga cita rasa atau kualitas tetap stabil.', 'Bersikap ramah pada semua pelanggan.', 'Tidak membedakan pelayanan.'],
    steps: ['Sapalah pelanggan yang datang.', 'Layani pesanan dengan tempo sigap.', 'Jaga area makan atau tunggu tetap bersih.'],
    benefits: ['Warung terasa akrab.', 'Pelanggan mudah merekomendasikan.', 'Menciptakan hubungan baik dengan lingkungan.'],
  },
  {
    title: 'Penglarisan Usaha Jasa',
    family: 'Penglarisan',
    summary: 'Laku simbolik untuk bidang jasa agar reputasi dibangun dari ketepatan, sopan santun, dan hasil kerja.',
    requirements: ['Janji waktu yang realistis.', 'Komunikasi jelas di awal.', 'Hasil kerja rapi dan dapat dipertanggungjawabkan.'],
    steps: ['Catat kebutuhan klien dengan detail.', 'Konfirmasi ulang sebelum mulai bekerja.', 'Setelah selesai, minta masukan dengan rendah hati.'],
    benefits: ['Kepercayaan klien naik.', 'Potensi langganan lebih besar.', 'Nama baik usaha lebih cepat terbentuk.'],
  },
  {
    title: 'Penglarisan Dagang Online',
    family: 'Penglarisan',
    summary: 'Versi modern dari laku penglarisan yang menekankan tampilan katalog bersih, respons cepat, dan testimoni baik.',
    requirements: ['Foto produk jelas.', 'Balas pesan secara konsisten.', 'Deskripsi produk jujur dan tidak berlebihan.'],
    steps: ['Rapikan katalog utama lebih dulu.', 'Balas chat dengan template yang sopan dan ringkas.', 'Minta ulasan setelah transaksi selesai dengan baik.'],
    benefits: ['Toko online terlihat meyakinkan.', 'Calon pembeli lebih mudah percaya.', 'Tingkat konversi bisa terbantu oleh pelayanan yang rapi.'],
  },
  {
    title: 'Penglarisan Pembuka Jalan',
    family: 'Penglarisan',
    summary: 'Laku batin untuk membangun kesiapan mental saat usaha sedang sepi atau baru dimulai.',
    requirements: ['Disiplin hadir dan buka tepat waktu.', 'Tidak mudah panik saat sepi.', 'Mau evaluasi dengan jujur.'],
    steps: ['Sebelum buka, tenangkan pikiran dan rapikan target harian.', 'Saat sepi, perbaiki display, layanan, atau promosi.', 'Tutup hari dengan evaluasi singkat.'],
    benefits: ['Mental usaha lebih kuat.', 'Membantu melihat masalah dengan jernih.', 'Menumbuhkan ketekunan.'],
  },
  {
    title: 'Penglarisan Pemanis Rezeki',
    family: 'Penglarisan',
    summary: 'Folklor yang mengaitkan kelancaran usaha dengan kebiasaan berbagi, jujur, dan menjaga hubungan baik.',
    requirements: ['Menyisihkan sebagian rezeki untuk berbagi.', 'Tidak menipu takaran atau kualitas.', 'Menjaga ucapan saat melayani.'],
    steps: ['Awali hari dengan niat mencari rezeki yang bersih.', 'Layani pembeli tanpa bermuka masam.', 'Sisihkan sedikit hasil untuk sedekah atau kebaikan.'],
    benefits: ['Hati lebih lapang saat bekerja.', 'Relasi usaha terasa sehat.', 'Membentuk citra usaha yang baik.'],
  },
  {
    title: 'Penglarisan Penjaga Ramai',
    family: 'Penglarisan',
    summary: 'Laku tradisional untuk menjaga toko atau usaha tetap terasa hidup dan tidak lesu.',
    requirements: ['Konsisten update barang atau layanan.', 'Rutin membersihkan area depan.', 'Mau menyapa pelanggan lama.'],
    steps: ['Tata ulang display secara berkala.', 'Gunakan sapaan yang hangat untuk pelanggan lama.', 'Jaga alur pelayanan agar tidak membuat orang menunggu terlalu lama.'],
    benefits: ['Usaha terlihat aktif.', 'Pelanggan lama merasa diperhatikan.', 'Suasana tempat usaha lebih menyenangkan.'],
  },
  {
    title: 'Penglarisan Reputasi Baik',
    family: 'Penglarisan',
    summary: 'Laku yang memusatkan kekuatan usaha pada nama baik, amanah, dan pelayanan konsisten.',
    requirements: ['Pegang janji pada pelanggan.', 'Terbuka jika ada kekurangan.', 'Cepat menindaklanjuti komplain secara sopan.'],
    steps: ['Catat keluhan pelanggan tanpa defensif.', 'Perbaiki yang kurang secepat mungkin.', 'Jaga standar pelayanan agar kualitas tetap sama setiap hari.'],
    benefits: ['Nama usaha lebih dipercaya.', 'Peluang rekomendasi meningkat.', 'Pondasi usaha jadi lebih kuat dalam jangka panjang.'],
  },
];

const defaultForm: FormState = {
  name: '',
  phone: '',
  location: '',
  category: 'Janda',
  communication: 'Chat',
  notes: '',
};

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function FolkloreList({
  title,
  subtitle,
  entries,
  dbStatusMessage,
}: {
  title: string;
  subtitle: string;
  entries: FolkloreEntry[];
  dbStatusMessage: string;
}) {
  return (
    <section className="folklore-section">
      <div className="folklore-header">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>

      <div className="tips-meta-row">
        <p>Total keilmuan: {entries.length}</p>
        <p>Format: syarat, cara melakukan, manfaat</p>
        <p>Status database: {dbStatusMessage}</p>
      </div>

      <div className="folklore-note">
        Konten ini dibawakan sebagai edukasi folklor kebatinan tanah Jawa. Tata laku di bawah disusun sebagai referensi budaya dan
        refleksi sikap, bukan jaminan hasil pasti.
      </div>

      <div className="folklore-list" role="list">
        {entries.map((entry, index) => (
          <article className="folklore-item" role="listitem" key={`${entry.family}-${entry.title}-${index}`}>
            <div className="folklore-item-head">
              <div>
                <span className="tips-number">{String(index + 1).padStart(2, '0')}</span>
                <h3>{entry.title}</h3>
              </div>
              <span className="tips-stage">{entry.family}</span>
            </div>

            <p className="folklore-summary">{entry.summary}</p>

            <div className="folklore-columns">
              <div className="folklore-block">
                <h4>Syarat</h4>
                <ul>
                  {entry.requirements.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="folklore-block">
                <h4>Cara melakukan</h4>
                <ol>
                  {entry.steps.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              </div>

              <div className="folklore-block">
                <h4>Manfaat</h4>
                <ul>
                  {entry.benefits.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function DashboardClient({ dbStatusMessage }: { dbStatusMessage: string }) {
  const [activeMenu, setActiveMenu] = useState(menus[0]);
  const [query, setQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contacts, setContacts] = useState<ContactRecord[]>([]);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [formError, setFormError] = useState('');
  const [saveWarning, setSaveWarning] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as ContactRecord[];
      if (Array.isArray(parsed)) {
        setContacts(parsed);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  }, [contacts]);

  const filteredContacts = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    if (!keyword) {
      return contacts;
    }

    return contacts.filter((contact) => {
      const haystack = [
        contact.name,
        contact.phone,
        contact.location,
        contact.category,
        contact.communication,
        contact.notes,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(keyword);
    });
  }, [contacts, query]);

  function closeModal() {
    setIsModalOpen(false);
    setForm(defaultForm);
    setFormError('');
    setSaveWarning(false);
  }

  function openModal() {
    setIsModalOpen(true);
    setForm(defaultForm);
    setFormError('');
    setSaveWarning(false);
  }

  function handleChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError('');

    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      location: form.location.trim(),
      category: form.category.trim(),
      communication: form.communication.trim(),
      notes: form.notes.trim(),
    };

    if (!payload.name || !payload.phone || !payload.location) {
      setFormError('Nama, HP, dan lokasi wajib diisi.');
      return;
    }

    if (!saveWarning) {
      setFormError('Aktifkan konfirmasi final sebelum menyimpan data.');
      return;
    }

    const nextItem: ContactRecord = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      ...payload,
      createdAt: new Date().toISOString(),
    };

    setContacts((current) => [nextItem, ...current]);
    closeModal();
  }

  return (
    <main className="dashboard minimal-dashboard">
      <div className="dashboard-shell minimal-shell">
        <header className="dashboard-header">
          <div className="dashboard-brand">
            <small>Abu Janda App</small>
            <h1>Dashboard</h1>
          </div>

          <LogoutButton />
        </header>

        <nav className="dashboard-nav" aria-label="Menu dashboard">
          {menus.map((menu) => (
            <button
              className={`dashboard-nav-link ${activeMenu === menu ? 'is-active' : ''}`}
              type="button"
              onClick={() => setActiveMenu(menu)}
              key={menu}
            >
              {menu}
            </button>
          ))}
        </nav>

        {activeMenu === 'Data Janda & Binor' ? (
          <section className="directory-section">
            <div className="directory-header">
              <div>
                <h2>Data Janda &amp; Binor</h2>
                <p>Direktori kontak hasil input anggota. Data yang sudah disimpan bersifat final dan tidak bisa diedit lagi.</p>
              </div>

              <div className="directory-actions">
                <div className="search-inline">
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Cari nama, lokasi, HP"
                    aria-label="Cari data"
                  />
                  <span className="search-icon" aria-hidden="true">
                    ⌕
                  </span>
                </div>

                <button className="ghost-button" type="button" onClick={openModal}>
                  Input Janda / Binor
                </button>
              </div>
            </div>

            <div className="directory-meta-row">
              <p>Total data: {contacts.length}</p>
              <p>Hasil tampil: {filteredContacts.length}</p>
              <p>Status database: {dbStatusMessage}</p>
            </div>

            {filteredContacts.length === 0 ? (
              <div className="directory-empty">
                {contacts.length === 0
                  ? 'Belum ada data masuk. Tambahkan data baru lewat tombol input di atas.'
                  : 'Data tidak ditemukan. Coba kata kunci lain.'}
              </div>
            ) : (
              <div className="directory-list" role="list">
                {filteredContacts.map((contact) => (
                  <article className="directory-item" key={contact.id} role="listitem">
                    <div className="directory-main">
                      <h3>{contact.name}</h3>
                      <p>{contact.location}</p>
                    </div>

                    <div className="directory-tags" aria-label="Detail data">
                      <span>{contact.category}</span>
                      <span>{contact.communication}</span>
                    </div>

                    <div className="directory-side">
                      <strong>{contact.phone}</strong>
                      <small>{formatDate(contact.createdAt)}</small>
                    </div>

                    {contact.notes ? <p className="directory-notes">{contact.notes}</p> : null}
                  </article>
                ))}
              </div>
            )}
          </section>
        ) : activeMenu === 'Rayuan Maut' ? (
          <section className="tips-section">
            <div className="tips-header">
              <h2>Rayuan Maut</h2>
              <p>
                Halaman ini difokuskan untuk tips komunikasi romantis yang sopan, natural, dan berbasis persetujuan.
                Isi di bawah dibuat untuk perkenalan sampai ajakan kencan yang tetap menghargai batasan.
              </p>
            </div>

            <div className="tips-meta-row">
              <p>Total model: {flirtingModels.length}</p>
              <p>Fokus: komunikasi romantis yang respek</p>
              <p>Status database: {dbStatusMessage}</p>
            </div>

            <div className="tips-list" role="list">
              {flirtingModels.map((item, index) => (
                <article className="tips-item" role="listitem" key={`${item.stage}-${index}`}>
                  <div className="tips-item-head">
                    <span className="tips-number">{String(index + 1).padStart(2, '0')}</span>
                    <span className="tips-stage">{item.stage}</span>
                  </div>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </section>
        ) : activeMenu === 'Mantra Pemikat' ? (
          <FolkloreList
            title="Mantra Pemikat"
            subtitle="Daftar pengasihan dalam bingkai edukasi kebatinan tanah Jawa. Disusun ringan, rapi, dan mudah dibaca per keilmuan."
            entries={pemikatEntries}
            dbStatusMessage={dbStatusMessage}
          />
        ) : activeMenu === 'Mantra Iclik' ? (
          <FolkloreList
            title="Mantra Iclik"
            subtitle="Daftar penglarisan dan laku rezeki yang dibawakan sebagai pengetahuan folklor usaha Jawa, lengkap dengan syarat, langkah, dan manfaat simbolik."
            entries={iclikEntries}
            dbStatusMessage={dbStatusMessage}
          />
        ) : (
          <section className="dashboard-hero">
            <p className="dashboard-lead">
              Menu <strong>{activeMenu}</strong> sedang disiapkan. Navigasi atas tetap aktif dan ringan untuk desktop maupun mobile.
            </p>
            <p className="dashboard-meta">Status database: {dbStatusMessage}</p>
          </section>
        )}
      </div>

      {isModalOpen ? (
        <div className="modal-backdrop" role="presentation" onClick={closeModal}>
          <div
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2 id="contact-modal-title">Input Data</h2>
                <p>Form dibuat singkat dan final. Setelah submit, data tidak dapat diedit lagi.</p>
              </div>
              <button className="icon-button" type="button" onClick={closeModal} aria-label="Tutup popup">
                ×
              </button>
            </div>

            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-grid-compact">
                <label className="field field-compact">
                  <span>Nama</span>
                  <input
                    value={form.name}
                    onChange={(event) => handleChange('name', event.target.value)}
                    placeholder="Nama kontak"
                  />
                </label>

                <label className="field field-compact">
                  <span>HP</span>
                  <input
                    value={form.phone}
                    onChange={(event) => handleChange('phone', event.target.value)}
                    placeholder="08xxxxxxxxxx"
                  />
                </label>

                <label className="field field-compact">
                  <span>Lokasi</span>
                  <input
                    value={form.location}
                    onChange={(event) => handleChange('location', event.target.value)}
                    placeholder="Kota / wilayah"
                  />
                </label>

                <label className="field field-compact">
                  <span>Status Janda / Binor</span>
                  <select value={form.category} onChange={(event) => handleChange('category', event.target.value)}>
                    <option value="Janda">Janda</option>
                    <option value="Binor">Binor</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </label>

                <label className="field field-compact field-full">
                  <span>Preferensi komunikasi</span>
                  <select value={form.communication} onChange={(event) => handleChange('communication', event.target.value)}>
                    <option value="Chat">Chat</option>
                    <option value="Telepon">Telepon</option>
                    <option value="Video call">Video call</option>
                    <option value="Belum diketahui">Belum diketahui</option>
                  </select>
                </label>

                <label className="field field-compact field-full">
                  <span>Keterangan tambahan</span>
                  <textarea
                    value={form.notes}
                    onChange={(event) => handleChange('notes', event.target.value)}
                    placeholder="Catatan singkat tambahan"
                    rows={4}
                  />
                </label>
              </div>

              <label className="warning-box">
                <input
                  type="checkbox"
                  checked={saveWarning}
                  onChange={(event) => setSaveWarning(event.target.checked)}
                />
                <span>Saya paham data yang sudah disubmit bersifat final dan tidak bisa diedit lagi.</span>
              </label>

              {formError ? <div className="error inline-error">{formError}</div> : null}

              <div className="modal-actions">
                <button className="soft-button" type="button" onClick={closeModal}>
                  Batal
                </button>
                <button className="button" type="submit">
                  Submit Final
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  );
}
