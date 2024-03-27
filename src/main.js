/* eslint-disable quotes */
import Modal from "./modal"

const modal = new Modal('[data-modal="open"]', '[data-modal="close"]',
	'[data-modal="container"]')
modal.init()  

const inputTask = document.getElementById("task")
const notesContainer = document.querySelector("note-container")

const IDBRequest = indexedDB.open("notesDB", 1)
IDBRequest.addEventListener("upgradeneeded", () => {
	const db = IDBRequest.result
	db.createObjectStore("notes", {
		autoIncrement: true
	})
})

IDBRequest.addEventListener("success", () => {
	console.log("Running well")
})

IDBRequest.addEventListener("error", () => {
	console.log("Database error")
})

document.getElementById("createNoteBtn").addEventListener("click", () => {
	const value = document.getElementById("task").value
	addObject({ value })
	inputTask.value = ""
})

const getIDBData = (mode)=>{
	const db = IDBRequest.result
	const IDBtransaction = db.transaction("notes", mode)
	const objectStore = IDBtransaction.objectStore("notes")
	return [objectStore, IDBtransaction]
}

const addObject = (obj) => {
	const IDBData = getIDBData("readwrite")
	IDBData[0].add(obj)
	IDBData[1].addEventListener("complete", ()=>{
		console.log("Obj added")
	})
}	

const leerObjetos = ()=>{
	const IDBData = getIDBData("readonly")
	const cursor = IDBData[0].openCursor()
	const fragment = document.createDocumentFragment()

	notesContainer.innerHTML = ""

	cursor.addEventListener("success", ()=>{
		if(cursor.result){
			let elemento = crearElemento(cursor.result.key, cursor.result.value)
			fragment.appendChild(elemento)
			cursor.result.continue()
		}else{
			notesContainer.appendChild(fragment)
		}
	})
}

const crearElemento = (id, date)=>{
	const container = document.createElement("ARTICLE")
	const input = document.createElement("INPUT")
	const saveBtn = document.createElement("BUTTON")
	const deleteBtn = document.createElement("BUTTON")

	container.classList.add("elementName")
	input.classList.add("your_input")
	saveBtn.classList.add("impossible")
	deleteBtn.classList.add("delete")

	saveBtn.textContent = "Guardar"
	deleteBtn.textContent = "Delete"

	input.value = date.elementName
	input.setAttribute("contenteditable", "true")
	input.setAttribute("spellcheck", "false")

	container.appendChild(input)
	container.appendChild(saveBtn)
	container.appendChild(deleteBtn)

	input.addEventListener("keyup", ()=>{
		saveBtn.classList.replace("impossible", "possible")
	})
	saveBtn.addEventListener("click", ()=>{
		if(saveBtn.className == "possible"){
			modificarObjeto(id, {elementName: input.value})
			saveBtn.classList.replace("possible", "impossible")
		}
	})
	deleteBtn.addEventListener("click", ()=>{
		if(confirm("Tem certeza que deseja eliminar? ")){
			eliminarObjeto(id)
			yourDates.removeChild(container)
		}
	})
	return container
}

const modificarObjeto = (key, objeto)=>{
	const IDBData = getIDBData("readwrite")
	IDBData[0].put(objeto, key)
	IDBData[1].addEventListener("complete", ()=>{
		console.log("Objeto modificado corretamente")
	})
}
const eliminarObjeto = (key)=>{
	const IDBData = getIDBData("readwrite")
	IDBData[0].delete(key)
	IDBData[1].addEventListener("complete", ()=>{
		console.log("Objeto eliminado corretamente")
	})
}