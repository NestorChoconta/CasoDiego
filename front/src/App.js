import "./App.css";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { addUser } from "./redux/userSlice";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ListUsers from "./components/SuperAdm/ListUsers";
import CreateUser from "./components/SuperAdm/CreateUser";
import EditUser from "./components/SuperAdm/EditUser";
import ListUserAdmin from "./components/Admin/ListUserAdmin";
import CreateUserAdmin from "./components/Admin/CreateUserAdmin";
import EditUserAdmin from "./components/Admin/EditUserAdmin";
import ListClients from "./components/Clients/ListClients";
import CreateClient from "./components/Clients/CreateClient";
import EditClient from "./components/Clients/EditClient";
import Login from "./components/Login/Login";
import VistaAdmin from "./components/Menus/VistaAdmin";
import VistaEmple from "./components/Menus/VistaEmple";
import MenuSuperAdmin from "./components/Menus/VistaSuperAdmin";
import ListTasks from "./components/Tasks/ListTasks";
import ListTasksEmp from "./components/Tasks/ListTasksEmp";
import CreateTask from "./components/Tasks/CreateTask";
import EditTask from "./components/Tasks/EditTask";
import ListClientsSuper from "./components/Clients/ListClientsSuper";
import CreateCompany from "./components/Companies/CreateCompany";
import ListCompany from "./components/Companies/ListCompany";

function App() {
	const dispatch = useDispatch();

	useEffect(() => {
		fetch("http://localhost:8000/api/usuarios")
			.then((response) => response.json())
			.then((data) => dispatch(addUser(data)))
			.catch((error) => console.log(error));
	}, []);

	return (
		<div className="App">
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Login />} />
					<Route path="/crearU" element={<CreateUser />} />
					<Route path="/editarU/:id" element={<EditUser />} />
					<Route path="/usuarios" element={<ListUsers />} />
					<Route path="/AdCrearU" element={<CreateUserAdmin />} />
					<Route path="/AdEditarU/:id" element={<EditUserAdmin />} />
					<Route path="/AdUsuarios" element={<ListUserAdmin />} />
					<Route path="/crearC" element={<CreateClient />} />
					<Route path="/editarC/:id" element={<EditClient />} />
					<Route path="/clientes" element={<ListClients />} />
					<Route path="/MenuAdmin" element={<VistaAdmin />} />
					<Route path="/MenuEmple" element={<VistaEmple />} />
					<Route path="/MenuSuperAdmin" element={<MenuSuperAdmin />} />
					<Route path="/Tareas" element={<ListTasks />} />
					<Route path="/TareasEmp" element={<ListTasksEmp />} />
					<Route path="/crearT" element={<CreateTask />} />
					<Route path="/editarT/:id" element={<EditTask />} />
					<Route path="/clientesSuper" element={<ListClientsSuper />} />
					<Route path="/compañias" element={<ListCompany />} />
					<Route path="/crearCompañia" element={<CreateCompany />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
