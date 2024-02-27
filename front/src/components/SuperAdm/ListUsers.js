import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import Cookies from "js-cookie";
import { FiUsers, FiBriefcase, FiClipboard } from "react-icons/fi";
//import { useSelector }	 from "react-redux"
import { jwtDecode } from "jwt-decode";


const endpoint = "http://localhost:8000/api";

const ListUsers = () => {
	const [users, setUsers] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [pageNumber, setPageNumber] = useState(0);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const usersPerPage = 11; // Número de usuarios por página
	const navigate = useNavigate();
	//const user = useSelector(state => state.user)	

	useEffect(() => {
		if (Cookies.get("casoDiego") === undefined) {
			navigate("/");
		}

		const  token = Cookies.get("casoDiego")
		//console.log(token)
		//decodificamos el token con la libreria jwtDecode
		const decodificacionToken = jwtDecode(token); 

		//sacamos el rol(sub) del token 
		console.log(decodificacionToken.sub) 
		getAllUsers();
		//console.log(user)
	}, [pageNumber, navigate]);

	const getAllUsers = async () => {
		const response = await axios.get(`${endpoint}/usuarios`);
		setUsers(response.data);
	};

	const deleteUsers = async (id) => {
		await axios.delete(`${endpoint}/usuario/${id}`);
		getAllUsers();
	};

	const handleSearch = (event) => {
		setSearchTerm(event.target.value);
		setPageNumber(0); // Reiniciar a la primera página al realizar una búsqueda
	};

	const filteredUsers = users.filter((user) => {
		const phone = user.phone ? user.phone.toString() : "";
		const fullNameUser = `${user.firstName || ""} ${user.Surname || ""} ${
			user.secondName || ""
		} ${user.secondSurname || ""}`.toLowerCase();
		return (
			fullNameUser.includes(searchTerm.toLowerCase()) ||
			phone.includes(searchTerm)
		);
	});

	const pageCount = Math.ceil(filteredUsers.length / usersPerPage);

	const changePage = ({ selected }) => {
		setPageNumber(selected);
	};

	const offset = pageNumber * usersPerPage;
	const paginatedUsers = filteredUsers.slice(offset, offset + usersPerPage);

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	const Sidebar = ({ isOpen, toggleSidebar }) => {
		return (
			isOpen && (
				<div
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						width: "200px",
						height: "100%",
						backgroundColor: "#333",
						color: "white",
						padding: "20px",
						boxSizing: "border-box",
						zIndex: 100,
					}}
				>
					<button
						onClick={toggleSidebar}
						style={{
							position: "absolute",
							top: "10px",
							right: "10px",
							background: "none",
							border: "none",
							cursor: "pointer",
							color: "white",
							fontSize: "20px",
						}}
					>
						X
					</button>
					<ul
						style={{
							listStyleType: "none",
							padding: 0,
						}}
					>
						<li
							style={{
								marginBottom: "30%",
								marginTop: "30%",
								cursor: "pointer",
							}}
						>
							<Link
								to="/MenuSuperAdmin"
								style={{ color: "white", textDecoration: "none" }}
							>
								☰ Menú Principal
							</Link>
						</li>
						<li style={{ marginBottom: "30%", cursor: "pointer" }}>
							<Link
								to="/Tareas"
								style={{ color: "white", textDecoration: "none" }}
							>
								<FiClipboard style={{ marginRight: "10px" }} /> Tareas
							</Link>
						</li>
						<li style={{ marginBottom: "30%", cursor: "pointer" }}>
							<Link
								to="/clientesSuper"
								style={{ color: "white", textDecoration: "none" }}
							>
								<FiUsers style={{ marginRight: "10px" }} /> Clientes
							</Link>
						</li>
						<li style={{ marginBottom: "30%", cursor: "pointer" }}>
							<FiBriefcase style={{ marginRight: "10px" }} /> Compañias
						</li>
					</ul>
				</div>
			)
		);
	};

	return (
		<div className="container-fluid mt-4 px-md-5">
			<h1>USUARIOS</h1>
			<button
				onClick={toggleSidebar}
				style={{
					position: "fixed",
					top: "20px",
					left: "20px",
					background: "none",
					border: "none",
					cursor: "pointer",
					color: "black",
					fontSize: "20px",
				}}
			>
				☰ {/* Icono de hamburguesa */}
			</button>
			<Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
			<div className="d-flex justify-content-between align-items-center mt-4">
				<div className="search-bar-container mr-2 w-50">
					<input
						type="text"
						placeholder="Buscar por nombre o teléfono"
						value={searchTerm}
						onChange={handleSearch}
						className="form-control"
					/>
				</div>
				<div className="ml-auto">
					<Link to="/crearU" className="btn btn-success btn-md mx-1">
						Crear Usuario
					</Link>
				</div>
			</div>
			<table className="table table-striped table-bordered shadow-lg table-hover mt-4">
				<thead className="thead-light">
					<tr>
						<th scope="col" className="col-1 align-middle text-center">
							Rol
						</th>
						<th scope="col" className="col-1 align-middle text-center">
							Nombres
						</th>
						<th scope="col" className="col-1 align-middle text-center">
							Apellidos
						</th>
						<th scope="col" className="col-1 align-middle text-center">
							Tipo de documento
						</th>
						<th scope="col" className="col-1 align-middle text-center">
							Numero de documento
						</th>
						<th scope="col" className="col-1 align-middle text-center">
							Fecha de nacimiento
						</th>
						<th scope="col" className="col-1 align-middle text-center">
							Correo
						</th>
						<th scope="col" className="col-1 align-middle text-center">
							Telefono
						</th>
						<th scope="col" className="col-1 align-middle text-center">
							Dirección
						</th>
						<th scope="col" className="col-2 align-middle text-center">
							Acciones
						</th>
					</tr>
				</thead>
				<tbody>
					{paginatedUsers.map((user) => (
						<tr key={user.id}>
							<td className="align-middle text-center">
								{" "}
								{user.role || "Sin rol"}{" "}
							</td>
							<td className="align-middle text-center">
								{" "}
								{`${user.firstName || ""} ${user.secondName || ""}`}{" "}
							</td>
							<td className="align-middle text-center">
								{" "}
								{`${user.Surname || ""} ${user.secondSurname || ""}`}
							</td>
							<td className="align-middle text-center">
								{" "}
								{user.description || "Sin T.D"}{" "}
							</td>
							<td className="align-middle text-center"> {user.numDocument} </td>
							<td className="align-middle text-center"> {user.birthdate} </td>
							<td className="align-middle text-center"> {user.email} </td>
							<td className="align-middle text-center"> {user.phone} </td>
							<td className="align-middle text-center"> {user.adress} </td>
							<td className="align-middle text-center">
								<Link
									to={`/editarU/${user.id}`}
									className="btn btn-success btn-sm mx-1"
								>
									Editar
								</Link>
								<button
									onClick={() => deleteUsers(user.id)}
									className="btn btn-danger btn-sm mx-1"
								>
									Borrar
								</button>
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

export default ListUsers;
