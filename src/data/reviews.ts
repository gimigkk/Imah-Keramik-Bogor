export interface ReviewImage {
  url: string;
  type?: 'image' | 'video';
  alt?: string;
  aspectRatio: string;
}

export interface ReviewData {
  id: string;
  author: string;
  time: string;
  quote: string;
  googleMapsUrl: string;
  image?: ReviewImage;
}

export const reviewColumns: ReviewData[][] = [
  // COLUMN 1 (~930px)
  [
    {
      id: "rev-anisa",
      author: "Anisa S.",
      time: "12:15",
      quote: "Pengalaman pertama membuat mangkok dari tanah liat dan membatik 😍💕 paket liburan 100rb per org. Cocok nih buat ide liburan anak sekolah..ada guidenya jadi bisa diajarin membuat gerabah, hasil karya bisa dibawa pulang...seru banget 😍👍",
      googleMapsUrl: "https://share.google/iN2EGFT6ElyXZmOiN",
      image: {
        url: "/anisa.jpg",
        alt: "Hasil kreasi membatik media kayu bentuk kucing",
        aspectRatio: "aspect-square"
      }
    },
    {
      id: "rev-dwi",
      author: "Dwi T.",
      time: "15:25",
      quote: "Tempat wisata edukatif semua usia, menyenangkan utk mulai Belajar membuat kreasi keramik dari Tanah liat, Dan jg menbatik di kayu,, jg proses pewarnaannya,, pertama Kali kesini agenda outing ktr pas weekday, ketemu pemilik Lgsg sekaligus pemandunya Dan mereka sangat ramah bersahaja Dan tidak Pelit berbagi ilmu , jg Bisa humoris pas break time disediakan snack, kopi Dan Teh manis hangat,, Sangat welcome bagi siapa sja yg dtg mau Belajar Dan berkreasi,, tempatnya luas, Mushola dan toilet ada Dan Nyaman, Suasana Di Sana jg adem, rasanya mau balik lg kesini dengan anak anak krn pasti akan seru 🤩🥰🤗",
      googleMapsUrl: "https://share.google/W7QORv3ydk2OqpV1x",
    },
    {
      id: "rev-irwan",
      author: "Irwan B.",
      time: "11:05",
      quote: "Suasana nyaman, seperti sedang di kampung; dipandu dengan baik dan ramah dalam berkreasi...",
      googleMapsUrl: "https://share.google/v50zBANRkD79q6sTh",
      image: {
        url: "/irwan.jpg",
        alt: "Peserta memamerkan karya membatik kayu bersama",
        aspectRatio: "aspect-video"
      }
    },
    {
      id: "rev-mahardika",
      author: "Mahardika C.",
      time: "18:50",
      quote: "Seru banget, dapet insight baru juga tentang keramik dan batik yang medianya ga biasa, best",
      googleMapsUrl: "https://share.google/NMvowb2LhvsHne2XV",
    }
  ],
  // COLUMN 2 (~900px)
  [
    {
      id: "rev-devi",
      author: "Devi A.",
      time: "13:00",
      quote: "Ikut kelas Clay dan Belajar membatik di media kayu. Seru banget, tempatnya adem, luas dan owner nya ramah banget. Keren",
      googleMapsUrl: "https://share.google/QKQUj9dLy21prRArB",
      image: {
        url: "/devi.png",
        alt: "Peserta memegang hasil karya gerabah tanah liat",
        aspectRatio: "aspect-[5/4]"
      }
    },
    {
      id: "rev-siti",
      author: "Siti J.",
      time: "10:14",
      quote: "they welcome customers warmly, kebetulan dateng kesini after 4 days lebaran jadi sepi bgt dan belum beroperasi juga karena karyawan lainnya lagi pada mudik hihi tapi tetep welcome buat yg mau coba kerajinan disini seru bgt kita di ajak tour dulu liat' sekitar tempat pembuatannya dan tentunya kita di temenin sama pekerja disana juga paa kita lagi buat kerajinan pokoknya org' disanaa baik' ramah' poll jadi nyaman kitanya hehe",
      googleMapsUrl: "https://share.google/725tcptBt413Djn6K",
      image: {
        url: "/siti.jpg",
        alt: "Galeri display kerajinan gerabah dan keramik Imah Keramik Bogor",
        aspectRatio: "aspect-video"
      }
    },
    {
      id: "rev-chika",
      author: "Chika N.",
      time: "13:40",
      quote: "Tempat yang fun dan edukatif, seru untuk menghabiskan waktu bersama sahabat juga cocok buat mengisi waktu bersama anak mau remaja supaya lepas dari gadget. Bapak dan ibunya juga sangat ramah dan edukatif saat mendampingi kita membatik atau membuat fun clay.",
      googleMapsUrl: "https://share.google/HGy64LPR2DjqPG2Sz",
    },
    {
      id: "rev-herman",
      author: "Herman H.",
      time: "16:05",
      quote: "Senang sekali bisa mengunjungi Imah keramik, ownernya ramah sekali, tempatnya nyaman, sangat edukatif. Cocok buat pelajar, mahasiswa dan keluarga…Terima kasih owner (pak Catur dan Bu Dewi)",
      googleMapsUrl: "https://share.google/nISEjbZO0ar5IeS1T",
    }
  ],
  // COLUMN 3 (~950px)
  [
    {
      id: "rev-nafisa",
      author: "Nafisa D.",
      time: "16:45",
      quote: "Ibu dan bapanya sangat ramah sekali, disini ada fun clay dan juga membatik, saya kemaren ambil paket yg harga 100k udh bisa fun clay dan membatik, dan seru juga guyss, disini kalian bisa reservasi h-1 sebelum ketempat ini yaaa, bisa grup bisa individu",
      googleMapsUrl: "https://share.google/10vpqXBLaoJqy6S4X",
      image: {
        url: "/nafisa.mp4",
        type: "video",
        alt: "Video suasana fun clay dan membatik Nafisa D.",
        aspectRatio: "aspect-[4/3]"
      }
    },
    {
      id: "rev-zahwatul",
      author: "Zahwatul J.",
      time: "18:10",
      quote: "Seru banget buat belajar hal baru, help full dan baik banget karena sebelumnya ga pernah belajar bikin clay dan batik. Saran buat pengunjung bikin clay yang mudah di bawa karena harus jemur sendiri di rumah",
      googleMapsUrl: "https://share.google/gNXlUu4RTAkAxl8Ng",
      image: {
        url: "/zahwatul.jpg",
        alt: "Peserta memutar dan membentuk gerabah tanah liat di alat meubeler",
        aspectRatio: "aspect-[4/3]"
      }
    },
    {
      id: "rev-dedi",
      author: "Dedi S.",
      time: "14:10",
      quote: "Utk anak2 belajar mandiri dan kreatif ,, dengan suasana yg Asri 👍👍👍",
      googleMapsUrl: "https://share.google/P4aEr88qUajj4HfkH",
      image: {
        url: "/dedi.jpg",
        alt: "Mural dinding Welcome to Imah Keramik Bogor dengan suasana asri",
        aspectRatio: "aspect-video"
      }
    },
    {
      id: "rev-sarah",
      author: "Sarah M.",
      time: "20:00",
      quote: "Pengalaman yang sangat menenangkan. Instruktur sangat sabar, dan saya pulang membawa vas hasil buatan sendiri! ❤️",
      googleMapsUrl: "https://share.google/SbD4qFhPDBh0mc8xI",
    }
  ],
  // COLUMN 4 (~870px)
  [
    {
      id: "rev-satya",
      author: "Satya M.",
      time: "11:45",
      quote: "SERU BANGET ! Terimakasih banyak bapak dan ibu yang udah ikut membantu proses tugas kami pak, kegiatan nya seru banget dan sangat informatif dan menginspirasi 🤩",
      googleMapsUrl: "https://share.google/JCfk8ROHTkCCMXW2e",
      image: {
        url: "/satya.jpg",
        alt: "Lima mahasiswa memamerkan hasil karya gerabah dan batik kayu",
        aspectRatio: "aspect-video"
      }
    },
    {
      id: "rev-dhiya",
      author: "Dhiya U.",
      time: "17:30",
      quote: "Seru banget, ibu dan bapak ramah dan sabar dalam mengajar, dan tentunya keren-keren karyanya🫶",
      googleMapsUrl: "https://share.google/GHPzTV6OofVqpOhbC",
      image: {
        url: "/dhiya.jpg",
        alt: "Hasil karya sendok kayu bermotif batik merah",
        aspectRatio: "aspect-[3/4]"
      }
    },
    {
      id: "rev-qadariah",
      author: "Qadariah E.",
      time: "14:50",
      quote: "Untuk wahana edukasi dann kreasi anak sangat cocok memperkenalkan handcraft. Tempatnya luas jadi sangat cocok untuk tempat edukasi tentang kriya keramik.",
      googleMapsUrl: "https://share.google/CZ6qTF9zfKJVF8gCy",
    },
    {
      id: "rev-madamr",
      author: "Madamr",
      time: "19:30",
      quote: "Tempatnya luas dan teduh. Bapak dan ibunya sangat ramah. Penjelasan untuk workshopnya juga menyeluruh dan sangat membantu.",
      googleMapsUrl: "https://share.google/V4QBbs356VQ4QqFvX",
    }
  ]
];
