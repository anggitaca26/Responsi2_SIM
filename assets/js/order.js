(function () {
    const form = document.getElementById('orderForm');
    if (!form) return;

    const $ = id => document.getElementById(id);
    const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwbdz3vFSA5k8WwYCR2gqA0Hq7LYhTcIzFpncyYiCx9JetnFynGKMwgrmIF8E1P-Vht/exec";

    function updateSummary() {
        const jenis = $('jenis_kue')?.value || '-';
        const jumlah = $('jumlah')?.value || '-';
        const tanggal = $('tanggal_pengambilan')?.value || '-';
        const jam = $('jam_pengambilan')?.value || '-';
        const hiasan = $('hiasan_jumlah')?.value || '0';

        $('summaryJenis') && ($('summaryJenis').textContent = jenis);
        $('summaryJumlah') && ($('summaryJumlah').textContent = jumlah);
        $('summaryTanggal') && ($('summaryTanggal').textContent = tanggal);
        $('summaryJam') && ($('summaryJam').textContent = jam);
        $('summaryHiasan') && ($('summaryHiasan').textContent = hiasan + ' hiasan coklat tulisan');
    }

    function getTotalPrice() {
        let total = 0;
        const cakeSelects = form.querySelectorAll('select[name^="jenis_kue"]');

        cakeSelects.forEach((select, index) => {
            const jenis = select.value;
            const jumlahInput = form.querySelector(`input[name="jumlah${index === 0 ? '' : index + 1}"]`);
            const jumlah = parseInt(jumlahInput?.value, 10) || 1;

            let price = 0;
            if (jenis === 'Birthday Cake Biscoff') price = 350000;
            else if (jenis === 'Strawberry Birthday Cake') price = 200000;
            else if (jenis === 'Bento Cakes') price = 80000;
            else if (jenis === 'Butter Matcha Cookies') price = 45000;
            else if (jenis === 'Red Velvet Cookies') price = 45000;
            else if (jenis === 'Cookie Monster Cookies') price = 50000;
            else if (jenis === 'Chunky Brownies Box') price = 180000;
            else if (jenis === 'Almond Flour Chocolate Brownies') price = 145000;
            else if (jenis === 'Matcha Oreo Blondies') price = 130000;
            else if (jenis === 'Tiramisu Cheesecake') price = 75000;
            else if (jenis === 'Oreo Cheesecake') price = 65000;
            else if (jenis === 'Blueberry Cheesecake') price = 60000;

            total += price * jumlah;
        });

        const hiasanJumlah = parseInt($('hiasan_jumlah')?.value, 10) || 0;
        total += hiasanJumlah * 20000;

        return total;
    }

    function updateConfirmation() {
        const nama = $('nama')?.value || '-';
        const telepon = $('telepon')?.value || '-';
        const tanggal = $('tanggal_pengambilan')?.value || '-';
        const jam = $('jam_pengambilan')?.value || '-';
        const hiasan = $('hiasan_jumlah')?.value || '0';

        // Collect all items
        let jenisList = [];
        let jumlahList = [];
        const cakeSelects = form.querySelectorAll('select[name^="jenis_kue"]');

        cakeSelects.forEach((select, index) => {
            const jenis = select.value;
            const jumlahInput = form.querySelector(`input[name="jumlah${index === 0 ? '' : index + 1}"]`);
            const jumlah = jumlahInput?.value || '1';

            if (jenis) {
                jenisList.push(jenis);
                jumlahList.push(jumlah + ' pcs');
            }
        });

        const jenis = jenisList.join(', ') || '-';
        const jumlah = jumlahList.join(', ') || '-';

        $('confirmNama') && ($('confirmNama').textContent = nama);
        $('confirmTelepon') && ($('confirmTelepon').textContent = telepon);
        $('confirmJenis') && ($('confirmJenis').textContent = jenis);
        $('confirmJumlah') && ($('confirmJumlah').textContent = jumlah);
        $('confirmTanggal') && ($('confirmTanggal').textContent = tanggal);
        $('confirmJam') && ($('confirmJam').textContent = jam);

        $('confirmHiasan') && (function () {
            const el = $('confirmHiasan');
            if (parseInt(hiasan, 10) > 0) {
                el.textContent = hiasan + ' hiasan coklat tulisan';
                el.parentElement.style.display = 'block';
            } else {
                el.parentElement.style.display = 'none';
            }
        })();

        let total = getTotalPrice();
        $('confirmTotal') &&
            ($('confirmTotal').textContent =
                total > 0 ? 'Rp ' + total.toLocaleString('id-ID') : 'Rp 0');
    }

    form.addEventListener('input', () => {
        updateSummary();
        updateConfirmation();
    });

    form.addEventListener('change', () => {
        updateSummary();
        updateConfirmation();
    });

    let itemCount = 1;
    window.addItem = function () {
        itemCount++;
        const additionalItems = document.getElementById('additionalItems');
        const newRow = document.createElement('div');
        newRow.className = 'row mb-3';
        newRow.innerHTML = `
            <div class="col-md-6 mb-3">
                <label for="jenis_kue${itemCount}" class="form-label fw-bold">Tambahan Pesanan</label>
                <select class="form-select" id="jenis_kue${itemCount}" name="jenis_kue${itemCount}" required>
                    <option value="">-- Pilih Jenis Kue --</option>
                    <!-- Birthday Cakes -->
                    <option value="Birthday Cake Biscoff">Birthday Cake Biscoff - Rp 350.000</option>
                    <option value="Strawberry Birthday Cake">Strawberry Birthday Cake - Rp 200.000</option>
                    <option value="Bento Cakes">Bento Cakes - Rp 80.000</option>
                    <!-- Cookies -->
                    <option value="Butter Matcha Cookies">Butter Matcha Cookies - Rp 45.000</option>
                    <option value="Red Velvet Cookies">Red Velvet Cookies - Rp 45.000</option>
                    <option value="Cookie Monster Cookies">Cookie Monster Cookies - Rp 50.000</option>
                    <!-- Brownies -->
                    <option value="Chunky Brownies Box">Chunky Brownies Box - Rp 180.000</option>
                    <option value="Almond Flour Chocolate Brownies">Almond Flour Chocolate Brownies - Rp 145.000</option>
                    <option value="Matcha Oreo Blondies">Matcha Oreo Blondies - Rp 130.000</option>
                    <!-- Cheesecakes -->
                    <option value="Tiramisu Cheesecake">Tiramisu Cheesecake - Rp 75.000</option>
                    <option value="Oreo Cheesecake">Oreo Cheesecake - Rp 65.000</option>
                    <option value="Blueberry Cheesecake">Blueberry Cheesecake - Rp 60.000</option>
                </select>
            </div>
            <div class="col-md-6 mb-3">
                <label for="jumlah${itemCount}" class="form-label fw-bold">Jumlah *</label>
                <input type="number" class="form-control" id="jumlah${itemCount}" name="jumlah${itemCount}" min="1" value="1" required>
            </div>
        `;
        additionalItems.appendChild(newRow);
    };

    // tombol kembali
    document.querySelectorAll('.prev-step').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            const step1 = document.getElementById('step1');
            step1?.scrollIntoView({ behavior: 'smooth' });
            $('nama')?.focus();
        });
    });

    // tombol lanjut
    document.querySelectorAll('.next-step').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            const target = document.getElementById('step' + btn.dataset.next);
            target?.scrollIntoView({ behavior: 'smooth' });
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        updateSummary();
        updateConfirmation();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const cakeSelects = form.querySelectorAll('select[name^="jenis_kue"]');
        let totalJumlahKue = 0;

        cakeSelects.forEach((select, index) => {
            const jumlahInput = form.querySelector(`input[name="jumlah${index === 0 ? '' : index + 1}"]`);
            totalJumlahKue += parseInt(jumlahInput?.value, 10) || 1;
        });

        data.jumlah_kue = totalJumlahKue;
        data.jumlah_hiasan = parseInt($('hiasan_jumlah')?.value, 10) || 0;

        const totalHarga = getTotalPrice();
        data.total = totalHarga;

        $('modalNama') && ($('modalNama').textContent = data.nama || '-');
        $('modalTelepon') && ($('modalTelepon').textContent = data.telepon || '-');
        $('modalEmail') && ($('modalEmail').textContent = data.email || '-');

        const hiasan = data.jumlah_hiasan || 0;
        const modalHiasanEl = $('modalHiasan');
        if (modalHiasanEl) {
            if (parseInt(hiasan, 10) > 0) {
                modalHiasanEl.textContent = hiasan + ' hiasan coklat tulisan';
                modalHiasanEl.parentElement.style.display = 'block';
            } else {
                modalHiasanEl.parentElement.style.display = 'none';
            }
        }

        $('modalTanggal') && ($('modalTanggal').textContent = data.tanggal_pengambilan || '-');
        $('modalJam') && ($('modalJam').textContent = data.jam_pengambilan || '-');
        $('modalCatatan') && ($('modalCatatan').textContent = data.catatan || '-');

        const modalItems = $('modalItems');
        if (modalItems) {
            modalItems.innerHTML = '';

            cakeSelects.forEach((select, index) => {
                const jenis = select.value;

                const jumlahInput = form.querySelector(`input[name="jumlah${index === 0 ? '' : index + 1}"]`);
                const jumlah = jumlahInput?.value || '1';

                if (jenis) {
                    const p = document.createElement('p');
                    p.innerHTML = `<strong>${jenis}:</strong> ${jumlah} pcs`;
                    modalItems.appendChild(p);
                }
            });

            const hiasanJumlah = parseInt(data.jumlah_hiasan, 10) || 0;
            if (hiasanJumlah > 0) {
                const p = document.createElement('p');
                p.innerHTML = `<strong>Hiasan Tambahan:</strong> ${hiasanJumlah} hiasan coklat tulisan`;
                modalItems.appendChild(p);
            }
        }

        // Total untuk modal
        let total = getTotalPrice();
        $('modalTotal') && ($('modalTotal').textContent =
            total > 0 ? 'Rp ' + total.toLocaleString('id-ID') : 'Rp 0');

        // Kirim data ke Apps Script
        fetch(WEB_APP_URL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('orderSuccessModal'));
        modal.show();
    });

    // initial load
    updateSummary();
    updateConfirmation();
})();
