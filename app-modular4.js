
// LOGIKA-LOGIKA HTML
    // FUNCTION LOGIKA PERPINDAHAN TAHAP
    function gantiTahap(namaTahap) {
        const semuaTahap = document.querySelectorAll("section[id^='tahap']");
        semuaTahap.forEach(el => el.classList.add("d-none"));

        const target = document.getElementById(namaTahap);
        if (target) target.classList.remove("d-none");
    }

    // BAGIAN2 FUNCTION PERPINDAHAN TAHAP (YANG DIPANGGIL OLEH TOMBOL)
        function lanjutTahap2() {
            const form = document.getElementById("formDataDiri");
            if (!form) return;

            // ✅ Cek validitas form
            if (!form.checkValidity()) {
                form.classList.add("was-validated"); // tambahkan feedback visual
                showNotifikasi("Isi semua data diri dengan lengkap dan benar sebelum lanjut.");
                return;
            }

            // ✅ Reset feedback & lanjut jika valid
            form.classList.remove("was-validated");

            gantiTahap("tahap2");
        }

        function kembaliTahap1() {
            gantiTahap("tahap1");
        }

        function lanjutTahap3() {
            const valid = validasiTahap2();
            if (!valid) {
                showNotifikasi("Isi semua produk dengan lengkap sebelum lanjut.");
                return;
            }

            // 🔎 Validasi harga total tidak Rp0 atau kosong
            const totalText = document.getElementById("totalHarga")?.value || "";
            const angkaTotal = parseInt(totalText.replace(/\D/g, "")) || 0;

            if (angkaTotal < 1) {
                showNotifikasi("Total harga belum dihitung atau masih kosong.");
                return;
            }

            // ✅ Lanjutkan ke tahap 3
            renderRingkasan();

            document.getElementById("printNama").textContent = 
                `${document.getElementById("namaDepan")?.value} ${document.getElementById("namaBelakang")?.value}`;

            document.getElementById("printTanggal").textContent = 
                document.getElementById("tanggal")?.value;

            gantiTahap("tahap3");
        }

        function kembaliTahap2() {
            gantiTahap("tahap2");
        }

    // FUNCTION NOTIFIKASI CUSTOM
    function showNotifikasi(pesan) {
            const box = document.getElementById("notifikasiCustom");
            box.querySelector(".toast-body").textContent = `⚠️ ${pesan}`;
            box.classList.remove("d-none");

            setTimeout(() => {
                box.classList.add("d-none");
            }, 3000);
    }


// PENYIMPANAN DATA PRODUK (PRODUK CONFIG)
const produkConfig = {
    "T-Shirt": {
        hargaDasar: 80000,
        kualitas: ["Combed 24s"],
        desain: ["T1", "T2"],
        warna: ["Hitam", "Abu Tua", "Mysti", "Putih", "Turkis", "Benhoor", "Biry Navy", "Dongker", "Tosca", "Mustard", "Orange", "Coklat Tua"],
        ukuran: {
            options: ["S", "M", "L", "XL", "XXL", "XXXL", "XXXXL", "XXXXXL", "XXXXXXL"],
            tambahan: {
                "XXL": 10000,
                "XXXL": 20000,
                "XXXXL": 30000,
                "XXXXXL": 40000,
                "XXXXXXL": 50000
            }
        },
        lengan: {
            options: ["Pendek", "Panjang"],
            tambahan: {
                "Panjang": 10000
            }
        },
        folderDesain: "tshirt"
    },

    "Poloshirt": {
        hargaDasar: {
            "Bordir": 150000,
            "DTF": 120000
        },
        kualitas: ["Bordir", "DTF"],
        desain: ["P1"],
        warna: ["Hitam", "Abu Tua", "Mysti", "Putih", "Turkis", "Benhoor", "Biry Navy", "Dongker", "Tosca", "Mustard", "Orange", "Coklat Tua"],
        ukuran: {
            options: ["S", "M", "L", "XL", "XXL", "XXXL", "XXXXL", "XXXXXL", "XXXXXXL"],
            tambahan: {
                "XXL": 10000,
                "XXXL": 20000,
                "XXXXL": 30000,
                "XXXXXL": 40000,
                "XXXXXXL": 50000
            }
        },
        lengan: {
            options: ["Pendek", "Panjang"],
            tambahan: {
                "Panjang": 10000
            }
        },
        folderDesain: "polo"
    },

    "Topi": {
        hargaDasar: {
            "Polohead": 85000,
            "Jaring": 60000
        },
        kualitas: ["Polohead", "Jaring"],
        desain: ["H1"],
        warna: ["Hitam", "Putih"],
        // Tidak ada ukuran dan lengan
        folderDesain: "topi"
    }
};

// REUSABLE BUILDER MEMBUAT DROWDOWN
function createDropdown(label, options, className, produk) {
    const wrapper = document.createElement("div");
    wrapper.className = "mb-2";
    wrapper.innerHTML = `<label>${label}:</label>`;

    const select = document.createElement("select");
    select.className = `form-select ${className}`;
    select.innerHTML = `<option disabled selected value="">Pilih ${label}</option>` +
        options.map(opt => {
            if (label === "Ukuran") {
                const displayMap = {
                    "XXL": "2XL (+Rp10.000)", "XXXL": "3XL (+Rp20.000)", "XXXXL": "4XL (+Rp30.000)",
                    "XXXXXL": "5XL (+Rp40.000)", "XXXXXXL": "6XL (+Rp50.000)"
                };
                const tampil = displayMap[opt] || opt;
                return `<option value="${opt}">${tampil}</option>`;
            }

            if (label === "Model Lengan") {
                const tampil = opt === "Panjang" ? "Panjang (+Rp10.000)" : opt;
                return `<option value="${opt}">${tampil}</option>`;
            }

            if (label === "Kualitas") {
                const config = produkConfig[produk];
                let harga = "";

                if (config?.hargaDasar) {
                harga = typeof config.hargaDasar === "object"
                    ? config.hargaDasar[opt]
                    : config.hargaDasar;
                }

                const tampilHarga = harga ? ` (Rp${harga.toLocaleString("id-ID")})` : "";
                return `<option value="${opt}">${opt}${tampilHarga}</option>`;
            }

            return `<option value="${opt}">${opt}</option>`;
        }).join("");

    wrapper.appendChild(select);
    return wrapper;
}

// FUNCTION UNTUK TOMBOL TAMBAH PRODUK CARD
let produkIndex = 0;

function tambahProduk() {
    produkIndex++;
    const wrapper = document.getElementById("produk-wrapper");

    const card = document.createElement("div");
    card.className = "card mb-3 p-3 shadow-sm card-produk-anim";
    card.id = `produk-${produkIndex}`;

    card.innerHTML = `
        <div class="position-relative">
            <button type="button" class="btn-close position-absolute top-0 end-0" 
                aria-label="Hapus Produk" onclick="hapusProdukCard('${card.id}')"
                style="z-index:10;"></button>
            
            <div class="mb-2">
                <label class="form-label">Jenis Produk:</label>
                <select class="form-select produk-item" onchange="ubahDetailProduk(this)">
                    <option value="" selected disabled>-- Pilih --</option>
                    ${Object.keys(produkConfig)
                    .map(p => `<option value="${p}">${p}</option>`)
                    .join("")}
                </select>
            </div>
            <div class="detail-produk"></div>
        </div>
    `;

    wrapper.appendChild(card);
}

// FUNCTION UNTUK TOMBOL HAPUS PRODUK CARD
function hapusProdukCard(cardId) {
    const card = document.getElementById(cardId);
    if (!card) return;

    card.classList.add("removed");
    setTimeout(() => card.remove(), 300);
}

// GENERATOR UBAH DETAL PRODUK (AMBIL DARI PRODUK CONFIG)
function ubahDetailProduk(selectEl) {
    const produk = selectEl.value;
    const detail = selectEl.parentElement.nextElementSibling;
    detail.innerHTML = "";

    const config = produkConfig[produk];
    if (!config) return;

    // 🔹 Kualitas
    if (config.kualitas) {
        detail.appendChild(createDropdown("Kualitas", config.kualitas, "model-kualitas", produk));
    }

    // 🔹 Warna (+ preview)
    if (config.warna) {
        const warnaGroup = document.createElement("div");
        warnaGroup.className = "mb-2 d-flex align-items-center gap-3";

        const warnaSelectWrap = document.createElement("div");
        warnaSelectWrap.className = "flex-grow-1";
        warnaSelectWrap.innerHTML = `<label>Warna:</label>`;
        const warnaSelect = document.createElement("select");
        warnaSelect.className = "form-select model-warna";
        warnaSelect.innerHTML =
        `<option disabled selected value="">Pilih Warna</option>` +
        config.warna.map(w => `<option value="${w}">${w}</option>`).join("");
        warnaSelect.setAttribute("onchange", "updatePreviewWarna(this)");
        warnaSelectWrap.appendChild(warnaSelect);

        const previewDiv = document.createElement("div");
        previewDiv.className = "preview-warna";

        warnaGroup.appendChild(warnaSelectWrap);
        warnaGroup.appendChild(previewDiv);
        detail.appendChild(warnaGroup);
    }

    // 🔹 Ukuran (+ tambahan)
    if (config.ukuran) {
        const ukuranOptions = config.ukuran.options;
        detail.appendChild(createDropdown("Ukuran", config.ukuran.options, "model-ukuran", produk));
    }

    // 🔹 Model Lengan (+ tambahan)
    if (config.lengan) {
        const lenganOptions = config.lengan.options;
        detail.appendChild(createDropdown("Model Lengan", config.lengan.options, "model-lengan", produk));
    }

    // 🔹 Desain (+ preview)
    if (config.desain) {
        const desainWrap = document.createElement("div");
        desainWrap.className = "mb-2";
        desainWrap.innerHTML = `<label>Design Ke-:</label>`;

        const desainSelect = document.createElement("select");
        desainSelect.className = "form-select model-desain";
        desainSelect.innerHTML =
        `<option disabled selected value="">Pilih Design</option>` +
        config.desain.map(d => `<option value="${d}">${d}</option>`).join("");
        desainSelect.setAttribute("onchange", "tampilPreview(this)");

        desainWrap.appendChild(desainSelect);
        detail.appendChild(desainWrap);

        const previewGambar = document.createElement("div");
        previewGambar.className = "mb-2 preview-gambar";
        detail.appendChild(previewGambar);
    }

    // 🔹 Jumlah
    const jumlahInput = document.createElement("div");
    jumlahInput.className = "mb-2";
    jumlahInput.innerHTML = `
        <label>Jumlah:</label>
        <input type="number" class="form-control jumlah-item" value="1" min="1" required>
        <div class="invalid-feedback">Jumlah produk minimal 1.</div>
    `;
    detail.appendChild(jumlahInput);
}

// FUNCTION PREVIEW WARNA DROPDOWN (TAHAP 2)
function updatePreviewWarna(selectEl) {
    const warna = selectEl.value;
    const previewDiv = selectEl.closest(".d-flex").querySelector(".preview-warna");

    const warnaHex = {
        "Hitam": "#000000", 
        "Abu Tua": "#4b4b4d", 
        "Mysti": "#bdbfc1", 
        "Putih": "#fefefe",
        "Turkis": "#00afef", 
        "Benhoor": "#3e4095", 
        "Biry Navy": "#314367", 
        "Dongker": "#2E3261",
        "Tosca": "#57A695", 
        "Mustard": "#FFCC29", 
        "Orange": "#F58634", 
        "Coklat Tua": "#A45E4D"
    };

    const hex = warnaHex[warna] || "#ccc";
    if (previewDiv) {
        previewDiv.style.backgroundColor = hex;
        previewDiv.style.border = "1px solid #888";
    }
}

// FUNCTION PREVIEW DESIGN YG DIPILIH (TAHAP 2)
function tampilPreview(desainSelect) {
    const desain = desainSelect.value;
    if (!desain) return;

    const card = desainSelect.closest(".card");
    if (!card) return;

    const produk = card.querySelector(".produk-item")?.value;
    if (!produk) return;

    const folder = produkConfig[produk]?.folderDesain || "";
    if (!folder) return;

    const imagePath = `img/design/${folder}/${desain}.png`;
    const previewGambar = card.querySelector(".preview-gambar");
    if (!previewGambar) return;

    // Buat elemen gambar dengan fallback jika error
    const img = document.createElement("img");
    img.src = imagePath;
    img.alt = desain;
    img.className = "img-thumbnail";
    img.style.maxWidth = "140px";

    img.onerror = () => {
        img.src = "img/design/fallback.png";
    };

    previewGambar.innerHTML = ""; // Bersihkan sebelum masukkan
    previewGambar.appendChild(img);
}

// FUNCTION HITUNG HARGA ITEM
function hitungHargaItem(produk, formData) {
    const config = produkConfig[produk];
    if (!config) return 0;

    let harga = 0;

    // 🔹 Ambil harga dasar
    if (typeof config.hargaDasar === "object") {
        harga = config.hargaDasar[formData.kualitas] || 0;
    } else {
        harga = config.hargaDasar;
    }

    // 🔹 Tambahan untuk ukuran besar
    if (config.ukuran?.tambahan?.[formData.ukuran]) {
        harga += config.ukuran.tambahan[formData.ukuran];
    }

    // 🔹 Tambahan untuk model lengan
    if (config.lengan?.tambahan?.[formData.lengan]) {
        harga += config.lengan.tambahan[formData.lengan];
    }

    // 🔹 Hitung subtotal
    return harga;
}

// FUNCTION HITUNG HARGA TOTAL
function hitungTotal() {
    const loader = document.getElementById("loader");
    loader.classList.remove("d-none");

    setTimeout(() => {
        const produkCards = document.querySelectorAll(".produk-item");
        const daftarProduk = [];

        produkCards.forEach(select => {
            const card = select.closest(".card");
            const produk = select.value;
            const config = produkConfig[produk];
            if (!produk || !config) return;

            const formData = {
                kualitas: card.querySelector(".model-kualitas")?.value || "",
                desain:   card.querySelector(".model-desain")?.value || "",
                warna:    card.querySelector(".model-warna")?.value || "",
                ukuran:   card.querySelector(".model-ukuran")?.value || "",
                lengan:   card.querySelector(".model-lengan")?.value || "",
                jumlah:   parseInt(card.querySelector(".jumlah-item")?.value) || 0
            };

            const hargaSatuan = hitungHargaItem(produk, formData);
            const subtotal = hargaSatuan * formData.jumlah;

            daftarProduk.push({ ...formData, produk, harga: hargaSatuan, subtotal });
        });

        // 🔁 Gabungkan produk identik
        const produkGabungan = gabungkanProdukIdentik(daftarProduk);

        // 🧮 Hitung total dari hasil gabungan
        const total = produkGabungan.reduce((sum, item) => sum + item.subtotal, 0);

        // ✅ Tampilkan di field tahap 2 dan tahap 3
        document.getElementById("totalHarga").value       = `Rp${total.toLocaleString("id-ID")}`;
        document.getElementById("totalHargaFinal").value  = `Rp${total.toLocaleString("id-ID")}`;
        document.getElementById("displayTotalBayar").textContent = `Rp${total.toLocaleString("id-ID")}`;

        loader.classList.add("d-none");
    }, 300);
}

// FUNCTION VALIDASI PRODUK CARD
function validasiProdukCard(card, config) {
    let valid = true;

    // 🔹 Jumlah wajib minimal 1
    const jumlahInput = card.querySelector(".jumlah-item");
    const jumlah = parseInt(jumlahInput?.value) || 0;

    if (jumlah < 1) {
        valid = false;
        jumlahInput.classList.add("is-invalid");
    } else {
        jumlahInput.classList.remove("is-invalid");
    }

    // 🔹 Cek field wajib dari config
    const wajibMap = {
        kualitas: "model-kualitas",
        desain: "model-desain",
        warna: "model-warna",
        ukuran: "model-ukuran",
        lengan: "model-lengan"
    };

    for (let key in wajibMap) {
        const isRequired = Array.isArray(config[key]) || config[key]?.options;
        if (isRequired) {
        const val = card.querySelector(`.${wajibMap[key]}`)?.value;
        if (!val || val.trim() === "") valid = false;
        }
    }

    // 🔹 Tandai jika tidak valid
    if (!valid) {
        card.classList.add("border-danger", "bg-light");
    } else {
        card.classList.remove("border-danger", "bg-light");
    }

    return valid;
}

// FUNCTION VALIDASI TAHAP 2
function validasiTahap2() {
    let semuaValid = true;
    const produkCards = document.querySelectorAll("[id^='produk-']");

    produkCards.forEach(card => {
        const produk = card.querySelector(".produk-item")?.value;
        const config = produkConfig[produk];
        if (!produk || !config) {
            card.classList.add("border-danger", "bg-light");
            semuaValid = false;
        return;
        }

        const cardValid = validasiProdukCard(card, config);
        if (!cardValid) semuaValid = false;
    });

    return semuaValid;
}

// FUNCTION RENDER RINGKASAN - MENAMPILAN RINGKASAN PESAN
function renderRingkasan() {
    const wrapper = document.getElementById("ringkasan-produk");
    wrapper.innerHTML = "";

    const produkCards = document.querySelectorAll(".produk-item");
    const daftarProduk = [];

    produkCards.forEach(select => {
        const card = select.closest(".card");
        const produk = select.value;
        const config = produkConfig[produk];
        if (!produk || !config) return;

        const formData = {
        kualitas: card.querySelector(".model-kualitas")?.value || "",
        desain:   card.querySelector(".model-desain")?.value || "",
        warna:    card.querySelector(".model-warna")?.value || "",
        ukuran:   card.querySelector(".model-ukuran")?.value || "",
        lengan:   card.querySelector(".model-lengan")?.value || "",
        jumlah:   parseInt(card.querySelector(".jumlah-item")?.value) || 0
        };

        const hargaSatuan = hitungHargaItem(produk, formData);
        const subtotal = hargaSatuan * formData.jumlah;

        daftarProduk.push({ ...formData, produk, harga: hargaSatuan, subtotal });
    });

    const produkGabungan = gabungkanProdukIdentik(daftarProduk);
    let total = 0;

    produkGabungan.forEach(data => {
        total += data.subtotal;

        const config = produkConfig[data.produk];
        const imagePath = data.desain
        ? `img/design/${config.folderDesain}/${data.desain}.png`
        : "";

        const warnaPreview = {
        "Hitam": "#000", 
        "Putih": "#fff", 
        "Benhoor": "#3e4095", 
        "Dongker": "#2E3261",
        "Turkis": "#00afef", 
        "Abu Tua": "#4b4b4d", 
        "Mysti": "#bdbfc1", 
        "Mustard": "#FFCC29",
        "Orange": "#F58634", 
        "Tosca": "#57A695", 
        "Biry Navy": "#314367", 
        "Coklat Tua": "#A45E4D"
        }[data.warna] || "#ccc";

        let detailList = `
            <li>Warna: ${data.warna}
                <span style="width:16px;height:16px;display:inline-block;
                margin-left:6px;border-radius:50%;background:${warnaPreview};
                border:1px solid #888;"></span>
            </li>
        `;

        if (data.ukuran) detailList += `<li>Ukuran: ${data.ukuran}</li>`;
        if (data.lengan) detailList += `<li>Lengan: ${data.lengan}</li>`;
        detailList += `
            <li>Design: ${data.desain}</li>
            <li>Jumlah: ${data.jumlah}</li>
            <li>Harga/item: Rp${data.harga.toLocaleString("id-ID")}</li>
            <li><strong>Subtotal: Rp${data.subtotal.toLocaleString("id-ID")}</strong></li>
        `;

        wrapper.innerHTML += `
        <div class="card mb-3 p-3 d-flex flex-column flex-md-row gap-3 align-items-start">
            ${imagePath ? `<img src="${imagePath}" class="img-thumbnail" style="max-width:120px;">` : ""}
            <div>
            <h5 class="mb-2">${data.produk}${data.kualitas ? " - " + data.kualitas : ""}</h5>
            <ul class="mb-2">${detailList}</ul>
            </div>
        </div>
        `;
    });

    document.getElementById("totalHargaFinal").value = `Rp${total.toLocaleString("id-ID")}`;
    document.getElementById("displayTotalBayar").textContent = `Rp${total.toLocaleString("id-ID")}`;
}

// FUNCTION TAMPILKAN INSTRUKSI BAYAR
function tampilInstruksiBayar() {
    const metode = document.getElementById("metodeBayar")?.value;
    const box = document.getElementById("boxInstruksi");
    if (!metode || !box) return;

    let konten = "";

    switch (metode) {
        case "BRI":
        konten = `
            <p class="mb-0">
                <strong>Transfer Bank BRI</strong><br>
                Nama: 2XCD Official<br>
                No. Rekening: 1234-5678-9999
            </p>
        `;
        break;

        case "Gopay":
        konten = `
            <img src="img/qrcode/gopay.png" class="img-fluid mb-2" style="max-width:180px;">
            <p class="mb-0">
                <strong>Gopay</strong><br>
                Nama Akun: 2XCD Official<br>
                Nomor Gopay: 08xxxxxxxx
            </p>
        `;
        break;

        case "DANA":
        konten = `
            <img src="img/qrcode/dana.png" class="img-fluid mb-2" style="max-width:180px;">
            <p class="mb-0">
                <strong>DANA</strong><br>
                Nama Akun: 2XCD Official<br>
                Nomor DANA: 08xxxxxxxx
            </p>
        `;
        break;
    }
    box.innerHTML = konten;
    box.classList.remove("d-none");
}

// FUNCTION GABUNGAN PRODUK IDENTIK
function gabungkanProdukIdentik(daftarProduk) {
    const gabungan = {};

    daftarProduk.forEach(item => {
        const key = [
            item.produk,
            item.kualitas,
            item.desain,
            item.warna,
            item.ukuran,
            item.lengan
        ].join("-").toLowerCase();

        if (gabungan[key]) {
            gabungan[key].jumlah += item.jumlah;
            gabungan[key].subtotal += item.subtotal;
        } else {
            gabungan[key] = { ...item };
        }
    });

    // 🔧 Hitung ulang harga satuan dari subtotal gabungan
    Object.keys(gabungan).forEach(key => {
        const item = gabungan[key];
        item.harga = Math.round(item.subtotal / item.jumlah);
    });

    return Object.values(gabungan);
}

// FUNCTION PREPARE DATA - SUSUN DATA SIAP KIRIM
async function prepareDataPesananForSheet() {
    // 🧠 Ambil Data Diri
    const namaDepan    = document.getElementById("namaDepan")?.value.trim() || "";
    const namaBelakang = document.getElementById("namaBelakang")?.value.trim() || "";
    const nama         = `${namaDepan} ${namaBelakang}`.trim();
    const email        = document.getElementById("email")?.value.trim() || "";
    const whatsapp     = document.getElementById("nomorHP")?.value.trim() || "";
    const alamat       = document.getElementById("alamat")?.value.trim() || "";
    const kodePos      = document.getElementById("kodePos")?.value.trim() || "";
    const tanggal      = document.getElementById("tanggal")?.value.trim() || "";
    const callsign     = document.getElementById("callsign")?.value.trim() || "";
    const catatan      = document.getElementById("catatan")?.value.trim() || "";
    const metodeBayar  = document.getElementById("metodeBayar")?.value || "";
    const timestamp    = new Date().toISOString();

    // ☁️ Upload Bukti Pembayaran (Cloudinary)
    const file        = document.getElementById("buktiPembayaran")?.files[0] || null;
    const linkBukti   = file ? await uploadBuktiKeCloudinary() : "";

    // 🛍️ Ambil Produk
    const produkCards = document.querySelectorAll(".produk-item");
    const daftarProduk = [];

    produkCards.forEach(select => {
        const card   = select.closest(".card");
        const produk = select.value;
        const config = produkConfig[produk];
        if (!produk || !config) return;

        const formData = {
            kualitas: card.querySelector(".model-kualitas")?.value || "",
            desain:   card.querySelector(".model-desain")?.value || "",
            warna:    card.querySelector(".model-warna")?.value || "",
            ukuran:   card.querySelector(".model-ukuran")?.value || "",
            lengan:   card.querySelector(".model-lengan")?.value || "",
            jumlah:   parseInt(card.querySelector(".jumlah-item")?.value) || 0
        };

        const hargaSatuan = hitungHargaItem(produk, formData);
        const subtotal     = hargaSatuan * formData.jumlah;

        daftarProduk.push({ ...formData, produk, harga: hargaSatuan, subtotal });
    });

    const produkGabungan = gabungkanProdukIdentik(daftarProduk);

    // 📄 Susun Baris Siap Kirim ke Sheets
    const barisData = produkGabungan.map(item => {
        const deskripsi = [
            item.produk,
            item.kualitas,
            item.ukuran ? `Ukuran ${item.ukuran}` : "",
            item.lengan ? `Lengan ${item.lengan}` : "",
            item.desain ? `Desain ${item.desain}` : "",
            item.warna ? `Warna ${item.warna}` : "",
            `Jumlah ${item.jumlah}`
        ].filter(Boolean).join(" • ");

        return [
            timestamp, 
            tanggal, 
            "Online", 
            callsign, 
            nama, 
            email, 
            whatsapp, 
            alamat, 
            kodePos, 
            catatan,
            deskripsi,

            // 🔴 T-Shirt
            item.produk === "T-Shirt"   ? item.kualitas : "",
            item.produk === "T-Shirt"   ? item.desain   : "",
            item.produk === "T-Shirt"   ? item.ukuran   : "",
            item.produk === "T-Shirt"   ? item.warna    : "",
            item.produk === "T-Shirt"   ? item.lengan   : "",
            item.produk === "T-Shirt"   ? item.jumlah   : "",

            // 🟡 Poloshirt
            item.produk === "Poloshirt" ? item.kualitas : "",
            item.produk === "Poloshirt" ? item.desain   : "",
            item.produk === "Poloshirt" ? item.ukuran   : "",
            item.produk === "Poloshirt" ? item.warna    : "",
            item.produk === "Poloshirt" ? item.lengan   : "",
            item.produk === "Poloshirt" ? item.jumlah   : "",

            // 🧢 Topi
            item.produk === "Topi"      ? item.kualitas : "",
            item.produk === "Topi"      ? item.desain   : "",
            item.produk === "Topi"      ? item.warna    : "",
            item.produk === "Topi"      ? item.jumlah   : "",

            // 💳 Pembayaran & Bukti
            metodeBayar,
            `Rp${item.subtotal.toLocaleString("id-ID")}`,
            linkBukti
        ];
    });

    return barisData; // array berisi baris per produk
}

// INTEGRASI KE CLOUDINARY
async function uploadBuktiKeCloudinary() {
    const fileInput = document.getElementById("buktiPembayaran");
    const file = fileInput?.files[0];
    if (!file) return "";

    const formData = new FormData();
    formData.append("file", file);

    // 🧾 Ganti nama cloud & preset sesuai akun kamu
    formData.append("upload_preset", "2XCD-ORDER");  // contoh: "unsigned_bukti"
    const cloudName = "didxzivpl";                   // contoh: "2xcdcloud"

    try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
            method: "POST",
            body: formData
        });

        const data = await res.json();
        if (data.secure_url) {
            console.log("✅ Bukti berhasil di-upload ke Cloudinary:", data.secure_url);
            return data.secure_url;
        } else {
            console.warn("⚠️ Upload gagal:", data);
            return "";
        }
    } catch (err) {
        console.error("❌ Error saat upload Bukti File:", err);
        return "";
    }
}

// SET TANGGAL OTOMATIS FORM SAAT HALAMAN DIBUKA
function setTanggalOtomatis() {
    const inputTanggal = document.getElementById("tanggal");
    if (!inputTanggal) return;

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");

    inputTanggal.value = `${yyyy}-${mm}-${dd}`;
}
document.addEventListener("DOMContentLoaded", setTanggalOtomatis);

// KIRIM KE BACKEND
async function testKirimKeBackend() {
    const hasil = await prepareDataPesananForSheet();
    const loader = document.getElementById("loader-kirim");
    const tombol = document.querySelector("button.btn-success");

    loader.classList.remove("d-none");
    tombol.disabled = true;
    tombol.textContent = "Mengirim...";

    try {
        const res = await fetch("http://localhost:5000/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(hasil)
        });
        const text = await res.text();
        console.log("✅ Respon dari server:", text);

        // Hide loader dan tombol
        loader.classList.add("d-none");
        tombol.disabled = false;
        tombol.textContent = "Kirim Pesanan & Bukti";

        // Navigasi ke halaman selesai
        gantiTahap("tahapSelesai");

    } catch (err) {
        console.error("❌ Gagal kirim:", err);
        document.getElementById("statusKirim").textContent = "❌ Gagal kirim data ke server.";
        loader.classList.add("d-none");
        tombol.disabled = false;
        tombol.textContent = "Kirim Pesanan & Bukti";
    }
}


