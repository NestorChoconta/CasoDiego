import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const endpoint = "http://localhost:8000/api/task";

const CreateTask = () => {
	const [users, setUsers] = useState([]);
	const [description, setDescription] = useState("");
	const [status, setStatus] = useState("");
	const [idEmpleado, setIdEmpleado] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		if (Cookies.get("casoDiego") === undefined) {
			navigate("/");
		}
		fetchUsers(); // Llamar a la función para obtener la lista de usuarios
	},[]);

	// Función para obtener la lista de usuarios
	const fetchUsers = async () => {
		try {
			const response = await axios.get(`http://localhost:8000/api/usuarios`);
			const filteredUsers = response.data.filter((user) => user.idRole === 3);
			setUsers(filteredUsers); // Guardar la lista de usuarios en el estado
		} catch (error) {
			console.error("Error al obtener la lista de usuarios:", error);
		}
	};

	const store = async (e) => {
		e.preventDefault();

		try {
			await axios.post(`${endpoint}`, {
				description: description,
				status: status,
				idEmpleado: idEmpleado,
			});
			navigate("/Tareas");
		} catch (error) {
			console.error("Error al guardar la tarea:", error);
		}
	};

	const handleGoBack = () => {
		navigate(-1); // Regresar a la página anterior
	};

	return (
		<div className="container-fluid mt-4 px-md-5">
			<h1 className="text-center mb-4">CREAR TAREA</h1>
			<div className="container-fluid mt-4 px-md-5 d-flex align-items-center justify-content-center">
				<div className="d-flex justify-content-center border p-2 rounded w-50 rounded">
					<form onSubmit={store} className="col-md-6 w-75">
						<div className="mb-3">
							<label className="form-label fs-5">Descripción</label>
							<input
								type="text"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								className="form-control border-0 rounded-0 rounded-end-2 rounded-start-2 border-bottom"
								required/>
						</div>
						<div className="mb-3">
							<label className="form-label fs-5">Estado</label>
							<select
								value={status}
								onChange={(e) => setStatus(e.target.value)}
								className="form-select border-0 rounded-0 rounded-end-2 rounded-start-2 border-bottom">
								<option value="" >Selecciona un estado</option>
								<option value="Por iniciar">Por iniciar</option>
								<option value="Pendiente">Pendiente</option>
								<option value="Finalizada">Finalizada</option>
							</select>
						</div>
						<div className="mb-3">
							<label className="form-label fs-5">Empleado</label>
							<select
								value={idEmpleado}
								onChange={(e) => setIdEmpleado(e.target.value)}
								className="form-select border-0 rounded-0 rounded-end-2 rounded-start-2 border-bottom"
								required>
								<option value="" disabled selected>
									Selecciona el empleado al que desea asignarle la tarea
								</option>
								{users.map((user) => (
									<option key={user.id} value={user.id}>
										{`${user.firstName || ""} ${user.Surname}`}
									</option>
								))}
							</select>
						</div>
						<div className="mb-3 text-center">
							<button
								onClick={handleGoBack}
								className="btn btn-warning btn-md mx-1">
								Cancelar
							</button>
							<button type="submit" className="btn btn-primary" tabIndex="4">
								Guardar
							</button>
						</div>
					</form>
				</div>
			</div>
			<br></br>
		</div>
	);
};

export default CreateTask;
