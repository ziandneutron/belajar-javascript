class FirebaseDB {
	constructor() {
		this.db = firebase.firestore();
	}

	async get() {
		const users = await this.db.collection('users').get();

		return users.docs.map(doc => {
			return {
				id: doc.id,
				email: doc.data().email,
				password: doc.data().password
			};
		});
	}
}

class Authentication {
	constructor() {
		this.db = new FirebaseDB()
	}

	async login(element) {
		const email = element.email.value;
		const password = element.password.value;

		const user = await this.findUser(email);

		if(!user) {
			return alert('email anda belum terdaftar!');
		}

		if(user.email === email && user.password === password) {
			alert('login berhasil');
			window.location.href = './to-do-oop.html';
		} else {
			alert('email dan password salah!')
		}
	}

	async findUser(email) {
		this.users = await this.db.get();
		console.log('this.users', this.users);
		for (var i = 0; i < this.users.length; i++) {
			const user = this.users[i];
			if(user.email === email) {
				return user;
			}
		}
	}
}

var authentication = new Authentication();