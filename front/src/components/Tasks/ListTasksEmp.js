import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import Cookies from "js-cookie";

const endpoint = "http://localhost:8000/api";

const TaskEmp = () => {
	const [tasks, setTasks] = useState([]);
	const [editStatus, setEditStatus] = useState(null);
	const [newStatus, setNewStatus] = useState("");
	const [currentEditStatus, setCurrentEditStatus] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [pageNumber, setPageNumber] = useState(0);
	const tasksPerPage = 11;
	const navigate = useNavigate();

	useEffect(() => {
		if (Cookies.get("casoDiego") === undefined) {
			navigate("/");
		}

		getAllTasks();
	}, [pageNumber, navigate]);

	const getAllTasks = async () => {
		try {
			const response = await axios.get(`${endpoint}/tasks`);
			setTasks(response.data);
		} catch (error) {
			console.error("Error fetching users with tasks:", error);
		}
	};

	const handleSearch = (event) => {
		setSearchTerm(event.target.value);
		setPageNumber(0); // Reiniciar a la primera página al realizar una búsqueda
	};

	const filteredTasks = tasks.filter((task) => {
		const fullName = `${task.firstName || ""} ${ task.Surname || "" } ${task.secondName || ""} ${ task.secondSurname || "" }`.toLowerCase(); //Filtra las tareas por el nombre completo del empleado
		return fullName.includes(searchTerm.toLowerCase());
	});

	//Calcula la cantidad de páginas necesarias para mostrar todas las tareas
	const pageCount = Math.ceil(filteredTasks.length / tasksPerPage);

	// Función para manejar el cambio de página
	const changePage = ({ selected }) => {
		setPageNumber(selected);
	};

	//Sirve para obtener las tareas de la página actual
	const offset = pageNumber * tasksPerPage;
	const paginatedTasks = filteredTasks.slice(offset, offset + tasksPerPage);

	const updateStatus = async (taskId) => {
		try {
			await axios.put(`${endpoint}/taskEmp/${taskId}`, {
				status: newStatus,
			});

			// Actualiza la lista de tareas después de la edición
			getAllTasks();
			setEditStatus(null);
		} catch (error) {
			console.error("Error updating task status:", error);
		}
	};

	const handleEditStatus = (taskId, currentStatus) => {
		// Al hacer clic en editar, establece el estado de edición y guarda el estado actual
		setEditStatus(taskId);
		setCurrentEditStatus(currentStatus);
		setNewStatus(currentStatus); // Configura el nuevo estado con el estado actual
	};

	return (
		<div className="container-fluid mt-4 px-md-5">
			<h1>MIS TAREAS</h1>
			<div className="d-flex justify-content-between align-items-center mt-4"
				style={{ fontSize: "16px", width: "80%", margin: "auto" }}>
				<div className="search-bar-container mr-2 w-50">
					<input
						type="text"
						placeholder="Busca las tareas por tu nombre"
						value={searchTerm}
						onChange={handleSearch}
						className="form-control"
					/>
				</div>
				<div className="ml-auto">
					<Link to="/MenuEmple" className="btn btn-success btn-md mx-1">
						Atrás
					</Link>
				</div>
			</div>
			<table
				className="table table-striped table-bordered shadow-lg table-hover mt-4"
				style={{ fontSize: "16px", width: "80%", margin: "auto" }}
			>
				<thead className="thead-light">
					<tr>
						<th scope="col" className="col-4 align-middle text-center">
							Descripción Tarea
						</th>
						<th scope="col" className="col-2 align-middle text-center">
							Empleado
						</th>
						<th scope="col" className="col-2 align-middle text-center">
							Estado
						</th>
						<th scope="col" className="col-4 align-middle text-center">
							Acción
						</th>
					</tr>
				</thead>
				<tbody>
					{paginatedTasks.map((task) => (
						<tr key={task.id}>
							<td className="align-middle text-center">{task.description}</td>
							<td className="align-middle text-center">
								{`${task.firstName || ""} ${task.Surname || ""}` ||
									"Sin Empleado"}
							</td>
							<td className="align-middle text-center">
								{editStatus === task.id ? ( // Si editStatus es igual al ID de la tarea, muestra un campo de selección
									<select
										value={newStatus}
										onChange={(e) => setNewStatus(e.target.value)}
										className="form-select border-bottom"
									>
										<option value="Por iniciar">Por iniciar</option>
										<option value="Pendiente">Pendiente</option>
										<option value="Finalizada">Finalizada</option>
									</select>
								) : (
									task.status // Si no está en modo de edición, muestra el estado actual de la tarea
								)}
							</td>
							<td className="align-middle text-center">
								{editStatus !== task.id ? ( // Si editStatus no es igual al ID de la tarea, muestra los btones
									<button
										//Se llama handleEditStatus para pasar el ID de la tarea y el estado actual.
										onClick={() => handleEditStatus(task.id, task.status)}
										className="btn btn-danger btn-md mx-1"
									>
										Editar Estado
									</button>
								) : (
									<div>
										<button
											onClick={() => updateStatus(task.id)}
											className="btn btn-success btn-md mx-1"
										>
											Guardar Cambios
										</button>
										<button
											onClick={() => setEditStatus(null)}
											className="btn btn-danger btn-md mx-1"
										>
											Cancelar
										</button>
									</div>
								)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<ReactPaginate
				previousLabel={"Anterior"}
				nextLabel={"Siguiente"}
				pageCount={pageCount}
				onPageChange={changePage}
				containerClassName={"pagination mt-4 justify-content-center"}
				previousLinkClassName={"page-link"}
				nextLinkClassName={"page-link"}
				disabledClassName={"page-item disabled"}
				activeClassName={"page-item active"}
				pageLinkClassName={"page-link"} // Agregar esta línea para estilizar los números de página
			/>
		</div>
	);
};

export default TaskEmp;
