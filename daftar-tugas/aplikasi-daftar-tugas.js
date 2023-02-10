function tambahTugas(form) {
    console.log(form);
    aplikasiDaftarTugas.inputTugas(form);
    aplikasiDaftarTugas.menampilkanDaftartTugas();
}

const aplikasiDaftarTugas = {
    tugas: {
        tugas: null,
        hari: null
    },
    daftarTugas: [],
    inputTugas: function (form) {
        this.tugas.tugas = form.tugas.value;
        this.tugas.hari = form.hari.value;

        if(!this.tugas.tugas) {
            alert('Tugas tidak boleh kosong!');
            return false;
        }

        if(!this.tugas.hari) {
            alert('Hari tidak boleh kosong!');
            return false;
        }

        this.daftarTugas.push(copy(this.tugas));
        this.hapusTugas(form);
    },
    hapusTugas: function (form) {
        this.tugas.tugas = null;
        this.tugas.hari = null;

        form.tugas.value = this.tugas.tugas;
        form.hari.value = this.tugas.hari;
    },
    menampilkanDaftartTugas: function () {
        const componentDaftarTugas = document.getElementById('daftar-tugas');
        componentDaftarTugas.innerHTML = '';
        this.daftarTugas.forEach(tugas => {
            componentDaftarTugas.innerHTML += `<li>${tugas.tugas} | ${tugas.hari}</li>`;
        });
    }
}

function copy(obj) {
    return JSON.parse(JSON.stringify(obj));
}