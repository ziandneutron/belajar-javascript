class User {
	constructor({ email, password }) {
		this.email = email;
		this.password = password;
	}
}

class FirebaseDB {
	constructor() {
		this.db = firebase.firestore();
	}

	async create(user) {
		await this.db.collection('users').add({
			email: user.email,
			password: user.password
		})
	}

	async find(id) {
		const user = await this.db.collection('users').doc(id).get();
		return user.data();
	}
}

var iconSubmit = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>'

class Register {
	constructor() {
		this.db = new FirebaseDB;
	}

	async save(element) {
		let email = element.email.value;
		let password = element.password.value;
		let password_confirmation = element.password_confirmation.value;

		if(password !== password_confirmation) {
			return alert('password is not match with password_confirmation');
		}

		let user = new User({
			email, 
			password
		})

		await this.db.create(user);

		element.email.value = '';
		element.password.value = '';
		element.password_confirmation.value = '';

		document.getElementById('btn-save').innerHTML = ' Register';

		alert('Register Berhasil!');

		window.location.href = './index.html';
	}
}

let AppRegister = new Register();
document.getElementById('btn-save').innerHTML = ' Register';













