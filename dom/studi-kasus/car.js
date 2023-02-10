class Car {
  constructor({ merk, type, color, cylinderCapacity }) {
    this.merk = merk;
    this.type = type;
    this.color = color;
    this.cylinderCapacity = cylinderCapacity
  }
}

class LocalDB {
  save(carList) {
    localStorage.setItem('carList', JSON.stringify(carList));
  }

  get() {
    let carList = localStorage.getItem('carList');
    if (carList) {
      return JSON.parse(carList);
    } else {
      return [];
    }
  }
}

class FirebaseDB {
  constructor() {
    this.db = firebase.firestore();
  }

  async create(car) {
    await this.db.collection('carList').add({
      merk: car.merk,
      type: car.type,
      color: car.color,
      cylinderCapacity: car.cylinderCapacity
    })
  }

  async update(id, car) {
    await this.db.collection('carList').doc(id).update({
      merk: car.merk,
      type: car.type,
      color: car.color,
      cylinderCapacity: car.cylinderCapacity
    })
  }

  async delete(id) {
    await this.db.collection('carList').doc(id).delete();
  }

  async get() {
    const carList = await this.db.collection('carList').get();

    return carList.docs.map(doc => {
      return {
        id: doc.id,
        merk: doc.data().merk,
        type: doc.data().type,
        color: doc.data().color,
        cylinderCapacity: doc.data().cylinderCapacity
      };
    });
  }

  async find(id) {
    const car = await this.db.collection('carList').doc(id).get();
    return car.data();
  }
}

class CarList {
  constructor() {
    this.carList = [];
    this.db = new FirebaseDB;
  }

  async save(element) {
    let id = element.idCar.value;
    let merk = element.merk.value;
    let type = element.type.value;
    let color = element.color.value;
    let cylinderCapacity = element.cylinderCapacity.value;

    let car = new Car({
      merk,
      type,
      color,
      cylinderCapacity
    })

    const IS_UPDATE = id;
          console.log('IS_UPDATE', IS_UPDATE)
    if (IS_UPDATE) {
      console.log('update', id, car)
      await this.update(id, car);
    } else {
      console.log('create', id, car)
      await this.create(car);
    }

    element.idCar.value = null;
    element.merk.value = '';
    element.type.value = '';
    element.color.value = '';
    element.cylinderCapacity.value = '';
    document.getElementById('btn-save').innerHTML = ' Buat';

    this.show()
  }

  create(car) {
    this.db.create(car);
  }

  update(id, car) {
    this.db.update(id, car)
  }

  async show() {
    this.carList = await this.db.get();

    let carListHtml = '';

    for (var i = 0; i < this.carList.length; i++) {
      let car = this.carList[i]
      carListHtml += `
					<div class="flex">
					<div class="flex-1">
					<tr>
					<td>Merk</td>
					<td>:</td>
					<td>${car.merk}</td>
					</tr>
					<tr>
					<td>Type</td>
					<td>:</td>
					<td>${car.type}</td>
					</tr>
					<tr>
					<td>Warna</td>
					<td>:</td>
					<td>${car.color}</td>
					</tr>
					<tr>
					<td>Kapasitas Silinder</td>
					<td>:</td>
					<td>${car.cylinderCapacity}</td>
					<br>
					<hr>
					<td class="flex-0">
					<button onclick="AppCarList.edit('${car.id}')" class="btn btn-default btn-xs btn-outline">Edit</button>
					<button onclick="AppCarList.delete('${car.id}')" class="btn btn-error btn-xs btn-outline">Hapus</button>
					</td>
				</div>`;

    }

    document.getElementById('daftar-mobil').innerHTML = carListHtml;
  }

  delete(id) {
    if (confirm('apakah anda yakin ingin menghapus ?')) {
      this.db.delete(id);
      this.show();
    }
  }

  async edit(id) {
    const car = await this.db.find(id);
    let merk = car.merk;
    let type = car.type;
    let color = car.color;
    let cylinderCapacity = car.cylinderCapacity;

    document.getElementById('form-car').merk.value = merk;
    document.getElementById('form-car').type.value = type;
    document.getElementById('form-car').color.value = color;
    document.getElementById('form-car').cylinderCapacity.value = cylinderCapacity;
    document.getElementById('form-car').idCar.value = id;

    document.getElementById('btn-save').innerHTML = ' Simpan';
  }
}

var AppCarList = new CarList();
document.getElementById('btn-save').innerHTML = ' Buat';
AppCarList.show();