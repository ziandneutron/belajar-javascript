function tambahTugas(form) {
    console.log(form);
    aplikasiDaftarTugas.inputTugas(form);
    aplikasiDaftarTugas.menampilkanDaftartTugas();
}
const databaseDaftarTugas = {
    save(daftarTugas) {
        localStorage.setItem('daftarTugas', JSON.stringify(daftarTugas));
    },

    get() {
        return JSON.parse(localStorage.getItem('daftarTugas'));
    }
}

const aplikasiDaftarTugas = {
    tugas: {
        index: -1,
        tugas: null,
        hari: null
    },
    daftarTugas: [],
    inputTugas: function (form) {
        this.tugas.index = form.index.value;
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

        if(this.tugas.index == -1) {
            this.daftarTugas.push(copy(this.tugas));
        } else {
            this.daftarTugas[this.tugas.index] = copy(this.tugas)
        }
        databaseDaftarTugas.save(this.daftarTugas);
        this.resetFormTugas(form);
    },
    resetFormTugas: function (form) {
        this.tugas.tugas = null;
        this.tugas.hari = null;
        this.tugas.index = -1;

        form.tugas.value = this.tugas.tugas;
        form.hari.value = this.tugas.hari;
        form.index.value = this.tugas.index;

        document.getElementById('btn-save-tugas').innerHTML = 'Tambah';
    },
    menampilkanDaftartTugas: function () {
        this.daftarTugas = databaseDaftarTugas.get();
        const componentDaftarTugas = document.getElementById('daftar-tugas');
        componentDaftarTugas.innerHTML = '';
        this.daftarTugas.forEach((tugas, index) => {
            componentDaftarTugas.innerHTML += `<li>
                <div class="flex justify-between">
                    <div>${tugas.tugas} | ${tugas.hari}</div>
                    <div>
                        <button class="btn btn-xs mr-2" onclick="aplikasiDaftarTugas.editTugas(${index})">Edit</button>
                        <button class="btn btn-xs btn-error" onclick="aplikasiDaftarTugas.hapusTugas(${index})">Hapus</button>
                    <div>
                </div>
            </li>`;
        });
    },
    hapusTugas: function (index) {
        if(confirm('Apakah anda yakin ingin menghapus data ini ?')) {
            this.daftarTugas.splice(index, 1);
            databaseDaftarTugas.save(this.daftarTugas);
            this.menampilkanDaftartTugas();
        }
    },
    editTugas: function (index) {
        const tugas = this.daftarTugas[index];
        const form = document.getElementById('form-tugas');
        form.tugas.value = tugas.tugas;
        form.hari.value = tugas.hari;
        form.index.value = index;

        document.getElementById('btn-save-tugas').innerHTML = 'Edit';
    }
}

function copy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

aplikasiDaftarTugas.menampilkanDaftartTugas();
