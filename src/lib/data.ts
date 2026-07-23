import type { Founder, Project, Service, Stat } from "./types";

export const company = {
  name: "Angkasa Architects",
  founded: 2015,
  motto: "We create space for a better place.",
  address: "Jl. Muhammad Yamin No. 47, Pekanbaru, Riau",
  email: "angkasaarchitects@gmail.com",
  phones: ["+62 811-7579-668", "+62 818-0690-2904"],
  instagram: "@angkasaarchitects",
  cities: [
    "Pekanbaru",
    "Jakarta",
    "Bali",
    "Surabaya",
    "Medan",
    "Pontianak",
    "Batam",
  ],
};

export const founders: Founder[] = [
  {
    name: "Jeffri Angkasa, S.T.",
    role: "Direktur & Co-Founder",
    bio: "Lahir di Pematang Siantar, 1987. Lulusan Arsitektur Universitas Tarumanagara, Jakarta (2009). Sebelum mendirikan Angkasa Architects, ia berkarya selama lima tahun di Hans Brouwer Design, Singapura (2009-2014), tempat ia mengasah pendekatan desain yang terstruktur dan eksperimentasi ruang, fungsi, serta material.",
    imageSeed: "angkasa-founder-jeffri",
  },
  {
    name: "Indri Sisilia",
    role: "Co-Founder",
    bio: "Lahir di Pekanbaru, 1985. Lulusan Arsitektur Universitas Tarumanagara, Jakarta (2003). Sebelum mendirikan Angkasa Architects, ia menjabat sebagai Head of Development di sebuah perusahaan pengembang properti Pekanbaru, membawa kejelian bisnis dan strategi ke dalam setiap proyek.",
    imageSeed: "angkasa-founder-indri",
  },
];

export const services: Service[] = [
  {
    slug: "rumah-tinggal",
    name: "Rumah Tinggal",
    description: "Hunian pribadi yang dirancang dari konsep hingga detail konstruksi.",
    detail:
      "Kami merancang rumah tinggal yang mencerminkan cara penghuninya hidup, bukan mengulang katalog. Setiap denah dimulai dari kebiasaan sehari-hari klien, lalu diterjemahkan ke bentuk, cahaya, dan material yang tahan lama di iklim tropis.",
  },
  {
    slug: "perumahan",
    name: "Perumahan",
    description: "Perencanaan kawasan hunian skala kecil hingga menengah.",
    detail:
      "Dari tapak hingga tata letak blok, kami menyusun kawasan hunian yang efisien secara sirkulasi namun tetap menyisakan ruang komunal yang layak huni, dengan tipe rumah yang bisa diulang tanpa terasa monoton.",
  },
  {
    slug: "komersial",
    name: "Komersial",
    description: "Kantor, pusat perbelanjaan, dan fasilitas bisnis.",
    detail:
      "Bangunan komersial kami rancang untuk bekerja keras secara fungsi: alur pengunjung yang jelas, fasad yang mudah dikenali, dan efisiensi operasional jangka panjang bagi pemilik bisnis.",
  },
  {
    slug: "interior",
    name: "Interior",
    description: "Penataan ruang dalam yang menyatu dengan arsitektur bangunan.",
    detail:
      "Interior dikerjakan sebagai kelanjutan dari arsitektur, bukan lapisan terpisah. Material, pencahayaan, dan furnitur dipilih agar ruang dalam terasa seutuh ruang luarnya.",
  },
  {
    slug: "landscape",
    name: "Landscape",
    description: "Desain ruang luar, taman, dan area terbuka.",
    detail:
      "Ruang luar kami perlakukan sebagai bagian dari denah, bukan sisa lahan. Vegetasi, perkerasan, dan naungan disusun untuk menopang kenyamanan termal bangunan tropis.",
  },
  {
    slug: "bangunan-publik",
    name: "Bangunan Publik",
    description: "Sekolah, tempat ibadah, dan fasilitas komunitas.",
    detail:
      "Untuk bangunan yang melayani banyak orang sekaligus, kami memprioritaskan ketahanan, kemudahan perawatan, dan ruang yang tetap manusiawi meski berskala besar.",
  },
];

export const projects: Project[] = [
  {
    slug: "ci-house",
    name: "CI House",
    category: "Rumah Tinggal",
    location: "Pekanbaru, Riau",
    year: 2021,
    summary: "Rumah tinggal modern minimalis dengan bukaan besar ke halaman dalam.",
    description:
      "CI House disusun mengelilingi sebuah halaman dalam yang membawa cahaya dan udara ke setiap ruang utama. Fasad bersih dengan garis horizontal tegas menjadi identitas visual rumah ini, sementara denahnya tetap fleksibel mengikuti aktivitas keluarga penghuninya.",
    imageSeed: "angkasa-ci-house-facade",
    gallerySeeds: ["angkasa-ci-house-living", "angkasa-ci-house-courtyard", "angkasa-ci-house-night"],
  },
  {
    slug: "marco-revy-house",
    name: "Marco Revy House",
    category: "Rumah Tinggal",
    location: "Pekanbaru, Riau",
    year: 2021,
    summary: "Hunian dua lantai dengan massa bangunan yang dipecah untuk sirkulasi udara silang.",
    description:
      "Massa Marco Revy House dipecah menjadi dua volume yang dihubungkan oleh void tengah, menciptakan sirkulasi udara silang alami. Material beton ekspos dipadukan dengan kayu pada area privat untuk menyeimbangkan kesan tegas dan hangat.",
    imageSeed: "angkasa-marco-revy-facade",
    gallerySeeds: ["angkasa-marco-revy-void", "angkasa-marco-revy-terrace"],
  },
  {
    slug: "lt-house",
    name: "LT House",
    category: "Rumah Tinggal",
    location: "Pekanbaru, Riau",
    year: 2021,
    summary: "Rumah kompak dengan fasad berlapis untuk mengontrol panas matahari langsung.",
    description:
      "Fasad LT House menggunakan sistem secondary skin berlapis yang menyaring sinar matahari langsung tanpa mengorbankan pandangan ke luar, cocok untuk lahan yang menghadap barat.",
    imageSeed: "angkasa-lt-house-facade",
    gallerySeeds: ["angkasa-lt-house-skin", "angkasa-lt-house-interior"],
  },
  {
    slug: "tika-house",
    name: "Tika House",
    category: "Rumah Tinggal",
    location: "Pekanbaru, Riau",
    year: 2019,
    summary: "Salah satu proyek awal Angkasa Architects dengan pendekatan modern tropis.",
    description:
      "Tika House menjadi salah satu tonggak awal pendekatan modern tropis Angkasa Architects: atap tumpang, teritisan lebar, dan bukaan besar yang merespons iklim Pekanbaru tanpa bergantung penuh pada pendingin ruangan.",
    imageSeed: "angkasa-tika-house-facade",
    gallerySeeds: ["angkasa-tika-house-garden"],
  },
  {
    slug: "jenny-art-center",
    name: "Jenny ART Center",
    category: "Bangunan Publik",
    location: "Pekanbaru, Riau",
    year: 2019,
    summary: "Pusat kegiatan seni dengan ruang pamer fleksibel dan pencahayaan alami.",
    description:
      "Jenny ART Center dirancang sebagai wadah kegiatan seni dengan ruang pamer yang dapat dikonfigurasi ulang, mengandalkan cahaya utara yang stabil untuk mendukung karya visual di dalamnya.",
    imageSeed: "angkasa-jenny-art-center",
    gallerySeeds: ["angkasa-jenny-art-hall", "angkasa-jenny-art-exterior"],
  },
  {
    slug: "cassaville",
    name: "Cassaville",
    category: "Perumahan",
    location: "Pekanbaru, Riau",
    year: 2022,
    summary: "Kawasan hunian dengan beberapa tipe rumah yang berbagi bahasa fasad yang sama.",
    description:
      "Cassaville menghadirkan beberapa tipe rumah dalam satu kawasan yang tetap terasa satu kesatuan berkat bahasa fasad, proporsi bukaan, dan palet material yang konsisten di setiap unit.",
    imageSeed: "angkasa-cassaville-cluster",
    gallerySeeds: ["angkasa-cassaville-street", "angkasa-cassaville-unit"],
  },
  {
    slug: "bakajin-house",
    name: "Bakajin House",
    category: "Rumah Tinggal",
    location: "Pekanbaru, Riau",
    year: 2020,
    summary: "Rumah dengan denah memanjang yang memaksimalkan lahan sempit.",
    description:
      "Pada lahan yang memanjang dan tidak lebar, Bakajin House menyusun ruang secara linear dengan titik-titik void di beberapa bagian untuk menjaga sirkulasi cahaya tetap merata hingga ke ruang belakang.",
    imageSeed: "angkasa-bakajin-house",
    gallerySeeds: ["angkasa-bakajin-interior"],
  },
  {
    slug: "sariputta-buddhist-school",
    name: "Sariputta Buddhist School",
    category: "Bangunan Publik",
    location: "Pekanbaru, Riau",
    year: 2020,
    summary: "Fasilitas pendidikan dengan koridor terbuka dan ruang kelas yang tenang.",
    description:
      "Sariputta Buddhist School disusun mengelilingi koridor terbuka yang meneduhkan sekaligus menjadi ruang transisi antar kelas, dirancang untuk tetap sejuk tanpa bergantung pada pendingin ruangan sepanjang hari.",
    imageSeed: "angkasa-sariputta-school",
    gallerySeeds: ["angkasa-sariputta-corridor", "angkasa-sariputta-classroom"],
  },
  {
    slug: "ska-mall-extension",
    name: "SKA Mall Extension dengan 21 Cineplex",
    category: "Komersial",
    location: "Pekanbaru, Riau",
    summary: "Perluasan pusat perbelanjaan dengan bioskop sebagai penggerak utama pengunjung.",
    description:
      "Perluasan SKA Mall dirancang agar area bioskop baru terhubung mulus dengan alur pengunjung mal eksisting, sekaligus memberi identitas fasad tersendiri sebagai penanda area baru.",
    imageSeed: "angkasa-ska-mall-extension",
    gallerySeeds: ["angkasa-ska-mall-lobby"],
  },
  {
    slug: "ochado-cafe",
    name: "Ochado Cafe",
    category: "Komersial",
    location: "Pekanbaru, Riau",
    summary: "Kafe dengan fasad terbuka yang mengaburkan batas dalam dan luar.",
    description:
      "Ochado Cafe mengaburkan batas antara area dalam dan teras dengan bukaan lipat penuh, membiarkan suasana kafe meluas ke ruang luar pada jam-jam sibuk.",
    imageSeed: "angkasa-ochado-cafe",
    gallerySeeds: ["angkasa-ochado-interior"],
  },
  {
    slug: "p-villas",
    name: "P Villas",
    category: "Villa & Resort",
    location: "Sumatera Barat",
    summary: "Klaster vila peristirahatan yang merespons kontur lahan berbukit.",
    description:
      "P Villas mengikuti kontur lahan berbukit di Sumatera Barat alih-alih meratakannya, sehingga setiap unit mendapat orientasi pemandangan yang berbeda dan tetap terasa privat satu sama lain.",
    imageSeed: "angkasa-p-villas",
    gallerySeeds: ["angkasa-p-villas-pool", "angkasa-p-villas-view"],
  },
];

export const stats: Stat[] = [
  { value: String(company.founded), label: "Tahun berdiri di Pekanbaru" },
  { value: `${projects.length}+`, label: "Karya terdokumentasi" },
  { value: String(company.cities.length), label: "Kota cakupan proyek" },
  { value: "2019", label: "Best Architecture Firm, Inara Award" },
];
