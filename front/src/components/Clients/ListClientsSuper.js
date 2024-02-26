import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { FiUsers, FiBriefcase, FiClipboard } from "react-icons/fi";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import Modal from "react-modal";
import ImportClient from "./ImportClient";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const endpoint = "http://localhost:8000/api";

const ListClients = () => {
	const [clients, setClients] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [importAlert, setImportAlert] = useState(false);
	const [pageNumber, setPageNumber] = useState(0);
	const clientsPerPage = 11; // Número de clientes por página
	const navigate = useNavigate();
	const user = useSelector((state) => state.user);

	useEffect(() => {
		if (Cookies.get("casoDiego") === undefined) {
			navigate("/");
		}
		console.log(user);
		getClientes();
	}, [pageNumber]);

	//Para obtener todos los clientes
	const getClientes = async () => {
		const response = await axios.get(`${endpoint}/clientes`);
		setClients(response.data);
	};

	//Para filtrar clientes 
	const handleSearch = (event) => {
		setSearchTerm(event.target.value);
		setPageNumber(0); // Reiniciar a la primera página al realizar una búsqueda
	};

	//Filtra los clientes según el término de búsqueda.
	const filteredClient = clients.filter((client) => {
		const phone = client.phone ? client.phone.toString() : "";
		const numDocument = client.numDocument ? client.numDocument.toString() : "";
		const fullName = `${client.firstNameClient || ""} ${
			client.secondNameClient || ""
		} ${client.SurnameClient || ""} ${
			client.secondSurnameClient || ""
		}`.toLowerCase();
		return (
			fullName.includes(searchTerm.toLowerCase()) ||
			phone.includes(searchTerm) ||
			numDocument.includes(searchTerm)
		);
	});

	//Calcula el número total de páginas necesarias para la paginación.
	const pageCount = Math.ceil(filteredClient.length / clientsPerPage);

	const changePage = ({ selected }) => {
		setPageNumber(selected);
	};

	const offset = pageNumber * clientsPerPage;
	const paginatedClients = filteredClient.slice(offset, offset + clientsPerPage);

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
								onClick={handleMenuRedirect}
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
								to="/usuarios"
								style={{ color: "white", textDecoration: "none" }}
							>
								<FiUsers style={{ marginRight: "10px" }} /> Usuarios
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

	// Comprobar el rol del usuario en la página de menú principal
	const idRole = Cookies.get("idRole");

	const handleMenuRedirect = () => {
		switch (idRole) {
			case "1":
				navigate("/MenuSuperAdmin");
				break;
			case "2":
				navigate("/MenuAdmin");
				break;
			case "3":
				navigate("/MenuEmple");
				break;
			default:
				// Si el rol del usuario no está definido, redirige a la página de inicio de sesión
				navigate("/");
				break;
		}
	};

	const [isImportOpen, setIsImportOpen] = useState(false);

	const openImport = () => {
		setIsImportOpen(true);
	};

	const closeImport = () => {
		setIsImportOpen(false);
	};

	const handleImportFinish = () => {
		setImportAlert(true);
		toast.success("Importación finalizada correctamente.", {
			autoClose: 2000,
		});

		setTimeout(() => {
			// Recarga la página después de 2000 milisegundos
			window.location.reload();
		}, 2000);
	};

	return (
		<div className="container-fluid mt-4 px-md-5">
			<h1>CLIENTES</h1>
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
						placeholder="Busca clientes por número de teléfono, nombre, documento de identidad o nombre de compañía"
						value={searchTerm}
						onChange={handleSearch}
						className="form-control"
					/>
				</div>
				<div className="ml-auto">
					<button onClick={openImport} className="btn btn-success btn-md mx-1">
						Importar Clientes
					</button>

					<Modal
						isOpen={isImportOpen}
						onRequestClose={closeImport}
						style={{
							content: {
								width: "40%",
								height: "35%",
								margin: "auto",
								marginTop: "0%",
							},
						}}
					>
						{/* Renderiza el componente ImportClient dentro del modal */}
						<ImportClient
							closeModal={closeImport}
							onImportFinish={handleImportFinish}
						/>
					</Modal>
					<Link to="/crearC" className="btn btn-success btn-md mx-1">
						Crear Cliente
					</Link>
				</div>
			</div>
			<table className="table table-striped table-bordered shadow-lg table-hover mt-4">
				<thead className="thead-light">
					<tr>
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
							Telefono
						</th>
						<th scope="col" className="col-1 align-middle text-center">
							Usuario
						</th>
						<th scope="col" className="col-1 align-middle text-center">
							Compañia
						</th>
						<th scope="col" className="col-1 align-middle text-center">
							Estado Cliente
						</th>
						<th scope="col" className="col-1 align-middle text-center">
							Acciones
						</th>
					</tr>
				</thead>
				<tbody>
					{paginatedClients.map((client) => (
						<tr key={client.id}>
							<td className="align-middle text-center">
								{`${client.firstNameClient || ""} ${
									client.secondNameClient || ""
								}`}
							</td>
							<td className="align-middle text-center">
								{`${client.SurnameClient || ""} ${
									client.secondSurnameClient || ""
								}`}
							</td>
							<td className="align-middle text-center">
								{client.documenttypes
									? client.documenttypes.description
									: "Sin T.D"}
							</td>
							<td className="align-middle text-center">{client.numDocument}</td>
							<td className="align-middle text-center">{client.phone}</td>
							<td className="align-middle text-center">
								{client.users
									? `${client.users.firstName || ""} ${client.users.Surname}`
									: "Sin Usuario"}
							</td>
							<td className="align-middle text-center">
								{client.companies ? client.companies.name : "Sin Compañia"}
							</td>
							<td className="align-middle text-center">
								{client.statusClient}
							</td>
							<td className="align-middle text-center">
								<Link
									to={`/editarC/${client.id}`}
									className="btn btn-success btn-sm mx-1"
								>
									Editar
								</Link>
							</td>
						</tr>
					))}
				</tbody>

				<ToastContainer />
			</table>
			<div
				className={`pagination mt-4 justify-content-center ${
					isImportOpen ? "d-none" : ""
				}`}
			>
				{" "}
				{/* Utiliza la clase de Bootstrap d-none para ocultar */}
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
		</div>
	);
};

export default ListClients;
