class ToDo {
	constructor({ todo, day, image }) {
		this.todo = todo;
		this.day = day;
		this.image = image;
	}
}

class LocalDB {
	save(toDoList) {
		localStorage.setItem('toDoList', JSON.stringify(toDoList));
	}

	get() {
		let toDoList = localStorage.getItem('toDoList');
		if(toDoList) {
			return JSON.parse(toDoList);	
		} else {
			return [];
		}
	}
}

class FirebaseDB {
	constructor() {
		this.db = firebase.firestore();
	}

	async create(toDo) {
		await this.db.collection('toDoList').add({
			todo: toDo.todo,
			day: toDo.day,
			image: toDo.image
		})
	}

	async update(id, toDo) {
		await this.db.collection('toDoList').doc(id).update({
			todo: toDo.todo,
			day: toDo.day,
			image: toDo.image
		})
	}	

	async delete(id) {
		await this.db.collection('toDoList').doc(id).delete();
	}

	async get() {
		const todoList = await this.db.collection('toDoList').get();

		return todoList.docs.map(doc => {
			return {
				id: doc.id,
				todo: doc.data().todo,
				day: doc.data().day,
				image: doc.data().image
			};
		});
	}

	async find(id) {
		const todo = await this.db.collection('toDoList').doc(id).get();
		return todo.data();
	}
}

var iconSubmit = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>'

class ToDoList {
	constructor() {
		this.toDoList = [];
		this.db = new FirebaseDB;
	}

	async save(element) {
		let id = element.idTodo.value;
		let todo = element.todo.value;
		let day = element.day.value;
		let image = element.image.value;

		let toDo = new ToDo({
			todo, 
			day,
			image
		})

		const IS_UPDATE = id;
		console.log('IS_UPDATE', IS_UPDATE)
		if (IS_UPDATE) {
			console.log('update');
			await this.update(id, toDo);
		} else {
			console.log('create');
			await this.create(toDo);
		}

		element.idTodo.value = null;
		element.todo.value = '';
		element.day.value = '';
		element.image.value = '';
		document.getElementById('btn-save').innerHTML = iconSubmit + ' Buat';

		this.show()
	}

	async create(toDo) {
		await this.db.create(toDo);
	}

	async update(id, toDo) {
		await this.db.update(id, toDo)
	}

	async show() {
		this.toDoList = await this.db.get();

		let toDoListHtml = '';
		console.log(this.toDoList);
		for (var i = 0; i < this.toDoList.length; i++) {
			let todo = this.toDoList[i]
			toDoListHtml += `
			<li class="border-b">
				<div class="flex">
					<div class="flex-0"><img src="${todo.image}" /></div>
					<div class="flex-1">${todo.day} - ${todo.todo}</div>
					<div class="flex-0">
						<button onclick="AppTodoList.edit('${todo.id}')" class="btn btn-default btn-xs btn-outline">Edit</button>
						<button onclick="AppTodoList.delete('${todo.id}')" class="btn btn-error btn-xs btn-outline">Hapus</button>
					</div>
				</div>
			</li>`;
		}

		document.getElementById('daftar-tugas').innerHTML= toDoListHtml;
	}	

	async delete(id) {
		if(confirm('apakah anda yakin ingin menghapus ?')) {
			await this.db.delete(id);
			this.show();				
		}
	}

	async edit(id) {
		const toDo = await this.db.find(id);
		let todo = toDo.todo;
		let day = toDo.day;

		document.getElementById('form-todo').todo.value = todo;
		document.getElementById('form-todo').day.value = day;
		document.getElementById('form-todo').idTodo.value = id;

		document.getElementById('btn-save').innerHTML = iconSubmit + ' Simpan';
	}
}

let AppTodoList = new ToDoList();
document.getElementById('btn-save').innerHTML = iconSubmit + ' Buat';
AppTodoList.show();













