import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { FiUsers, FiBriefcase } from 'react-icons/fi';

const endpoint = "http://localhost:8000/api";

const TaskManager = () => {
	const [usersWithTasks, setUsersWithTasks] = useState([]);
	const [pageNumber] = useState(0);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const tasksPerPage = 11;
	const navigate = useNavigate();

	useEffect(() => {
		if (Cookies.get("casoDiego") === undefined) {
			navigate("/");
		}
		fetchUsersWithTasks();
	}, []);

	const fetchUsersWithTasks = async () => {
		try {
			const response = await axios.get(`${endpoint}/regular-users`);
			setUsersWithTasks(response.data);
		} catch (error) {
			console.error("Error fetching users with tasks:", error);
			
		}
	};

	const offset = pageNumber * tasksPerPage;
	const paginatedUsersWithTasks = usersWithTasks.slice(
		offset,
		offset + tasksPerPage
	);
	const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

	const Sidebar = ({ isOpen, toggleSidebar }) => {
		return (
			isOpen && (
				<div style={{
					position: 'fixed',
					top: 0,
					left: 0,
					width: '200px',
					height: '100%',
					backgroundColor: '#333',
					color: 'white',
					padding: '20px',
					boxSizing: 'border-box',
					zIndex: 100,
				}}>
					<button
						onClick={toggleSidebar}
						style={{
							position: 'absolute',
							top: '10px',
							right: '10px',
							background: 'none',
							border: 'none',
							cursor: 'pointer',
							color: 'white',
							fontSize: '20px',
						}}
					>
						X
					</button>
					<ul style={{
						listStyleType: 'none',
						padding: 0,
					}}>
						<li style={{ marginBottom: '30%',marginTop: '30%', cursor: 'pointer' }}>
							<Link to="/MenuSuperAdmin" style={{ color: 'white', textDecoration: 'none'}}>
							☰ Menú Principal
							</Link>
						</li>
						<li style={{ marginBottom: '30%', cursor: 'pointer' }}>
							<Link to="/usuarios" style={{ color: 'white', textDecoration: 'none' }}>
								<FiUsers style={{ marginRight: '10px' }} /> Usuarios
							</Link>
						</li>
						<li style={{ marginBottom: '30%', cursor: 'pointer' }}>
							<Link to="/clientesSuper" style={{ color: 'white', textDecoration: 'none'}}>
							<FiUsers style={{ marginRight: '10px' }} /> Clientes
							</Link>
						</li>
						<li style={{ marginBottom: '30%', cursor: 'pointer' }}>
							<FiBriefcase style={{ marginRight: '10px' }} /> Compañias
						</li>
						
					</ul>
				</div>
			)
		);
	}

	return (
		<div className="container-fluid mt-4 px-md-5">
			<h1>TAREAS</h1>
				<button
				onClick={toggleSidebar}
				style={{
					position: 'fixed',
					top: '20px',
					left: '20px',
					background: 'none',
					border: 'none',
					cursor: 'pointer',
					color: 'black',
					fontSize: '20px',
				}}
			>
				☰ {/* Icono de hamburguesa */}
			</button>
			<Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
			
			<div className="d-flex justify-content-end align-items-center mt-4">
				<Link to="/crearT" className="btn btn-success btn-md mx-1">
					Crear Tarea
				</Link>
			</div>
			<div className="row mt-4">
				<div
					className="col"
					style={{
						boxShadow: "0 0 10px rgba(0,0,0,0.1)",
						padding: "15px",
						borderRadius: "5px",
						marginRight: "10px",
					}}
				>
					<h6 style={{ marginBottom: "15px" }}>Por Iniciar</h6>
					<ul className="list-group">
						{paginatedUsersWithTasks.map((userWithTasks) =>
							userWithTasks.tasks
								.filter((task) => task.status === "Por iniciar")
								.map((task) => (
									<li
										key={task.id}
										className="list-group-item d-flex align-items-center"
									>
										<span className="text-muted">
											Asignado a: {userWithTasks.firstName}
										</span>
										<span className="flex-grow-1">{task.description}</span>
										<div>
											<Link
												to={`/editarT/${task.id}`}
												className="btn btn-success btn-sm"
											>
												Editar
											</Link>
										</div>
									</li>
								))
						)}
					</ul>
				</div>
				<div
					className="col"
					style={{
						boxShadow: "0 0 10px rgba(0,0,0,0.1)",
						padding: "15px",
						borderRadius: "5px",
						marginRight: "10px",
						marginLeft: "10px",
					}}
				>
					<h6 style={{ marginBottom: "15px" }}>Pendientes</h6>
					<ul className="list-group">
						{paginatedUsersWithTasks.map((userWithTasks) =>
							userWithTasks.tasks
								.filter((task) => task.status === "Pendiente")
								.map((task) => (
									<li
										key={task.id}
										className="list-group-item d-flex align-items-center"
									>
										<span className="text-muted">
											Asignado a: {userWithTasks.firstName}
										</span>
										<span className="flex-grow-1">{task.description}</span>
										<div>
											<Link
												to={`/editarT/${task.id}`}
												className="btn btn-success btn-sm"
											>
												Editar
											</Link>
										</div>
									</li>
								))
						)}
					</ul>
				</div>
				<div
					className="col"
					style={{
						boxShadow: "0 0 10px rgba(0,0,0,0.1)",
						padding: "15px",
						borderRadius: "5px",
						marginLeft: "10px",
					}}
				>
					<h6 style={{ marginBottom: "15px" }}>Finalizadas</h6>
					<ul className="list-group">
						{paginatedUsersWithTasks.map((userWithTasks) =>
							userWithTasks.tasks
								.filter((task) => task.status === "Finalizada")
								.map((task) => (
									<li
										key={task.id}
										className="list-group-item d-flex align-items-center"
									>
										<span className="text-muted">
											Asignado a: {userWithTasks.firstName}
										</span>
										<span className="flex-grow-1">{task.description}</span>
										<div>
											<Link
												to={`/editarT/${task.id}`}
												className="btn btn-success btn-sm"
											>
												Editar
											</Link>
										</div>
									</li>
								))
						)}
					</ul>
				</div>
			</div>
			<style>
				{`
                    .task-item {
                        background-color: #f2f2f2;
                        padding: 5px 10px;
                        border-radius: 5px;
                        margin-bottom: 5px;
                    }
                `}
			</style>
		</div>
	);
};

export default TaskManager;

