import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { FiUsers, FiClipboard } from "react-icons/fi";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const endpoint = "http://localhost:8000/api";

const ListCompaniesEmp = () => {
	const [companies, setCompanies] = useState([]);
	const [pageNumber, setPageNumber] = useState(0);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const navigate = useNavigate();
	const companiesPerPage = 10;

	const token = Cookies.get("casoDiego");
	const decodificacionToken = jwtDecode(token);
	const role = decodificacionToken.role;

	const [inactiveCompaniesCount, setInactiveCompaniesCount] = useState(0);

	useEffect(() => {
		if (Cookies.get("casoDiego") === undefined) {
			navigate("/");
		}

		getAllCompanies();
	}, [pageNumber]); // Se actualiza cuando cambia la página

	const getAllCompanies = async () => {
		const response = await axios.get(`${endpoint}/companies`);
		const activeCompanies = response.data.filter(company => company.statusCompany === 'Activa');
		setCompanies(activeCompanies);
		const inactiveCount = response.data.filter(company => company.statusCompany === 'Inactiva').length;
    	setInactiveCompaniesCount(inactiveCount);
	};

    // Se utiliza para calcular el número total de páginas necesarias para mostrar todas las compañías
	const pageCount = Math.ceil(companies.length / companiesPerPage);
	// Cálculo de índices de paginación
	const offset = pageNumber * companiesPerPage;
	// Obtención de compañías para la página actual
	const paginatedCompanies = companies.slice(offset, offset + companiesPerPage);

	const changePage = ({ selected }) => {
		setPageNumber(selected); // Actualiza el número de la página actual
	};

    // Se ejecuta al cambiar de página
	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};


	const DeffinitionClients = () => {
		switch (parseInt(role)) {
			case 1:
				navigate('/clientesSuper')
				break;
			case 2:
				navigate('/clientes')
				break;
			case 3:
				navigate('/clientes')
				break;
			default:
				break;
		}
	}

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
							to="/MenuEmple"
							style={{ color: "white", textDecoration: "none" }}>
							☰ Menú Principal
						</Link>
						</li>
						<li style={{ marginBottom: "30%", cursor: "pointer" }}>
						<Link
							to="/TareasEmp"
							style={{ color: "white", textDecoration: "none" }}>
							<FiClipboard style={{ marginRight: "10px" }} /> Tareas
						</Link>
						</li>
						<li style={{ marginBottom: "30%", cursor: "pointer" }}>
						<a onClick={()=>DeffinitionClients()} style={{ color: 'white', textDecoration: 'none'}}>
							<FiUsers style={{ marginRight: '10px' }} /> Clientes
							</a>
						</li>
					</ul>
				</div>
			)
		);
	};

	const downloadFile = async (id, name) => {
        try {
            const response = await axios.get(`${endpoint}/companies/${id}/download`, {
                responseType: 'blob', // Indica que la respuesta es un archivo binario
            });

            // Crea un objeto Blob con los datos recibidos
            const blob = new Blob([response.data]);

            // Crea un enlace (link) temporal
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `DocumentoCompañia${name}.pdf`;

            // Simula un clic en el enlace para iniciar la descarga
            link.click();

            // Libera recursos al finalizar
            window.URL.revokeObjectURL(link.href);
        } catch (error) {
            if (error.response && error.response.status === 404) {
				// Muestra la alerta si el archivo no se encuentra
				toast.error("El documento no se encuentra en nuestro sistema.");
			} else {
				console.error('Error al descargar el archivo:', error.message);
			}
        }
    };

	return (
		<div className="container-fluid mt-4 px-md-5">
			<h1>COMPAÑIAS</h1>
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
			<table className="table table-striped table-bordered shadow-lg table-hover mt-4">
				<thead className="thead-light">
					<tr>
						<th scope="col" className="col-1 align-middle text-center">
							Nombre Compañia
						</th>
						<th scope="col" className="col-1 align-middle text-center">
							Dirección
						</th>
						<th scope="col" className="col-1 align-middle text-center">
							Telefono
						</th>
						<th scope="col" className="col-1 align-middle text-center">
							NIT
						</th>
						<th scope="col" className="col-1 align-middle text-center">
							Documento
						</th>
						<th scope="col" className="col-1 align-middle text-center">
							Servicios
						</th>
						<th scope="col" className="col-1 align-middle text-center">
							Estado Compañia
						</th>
						<th scope="col" className="col-1 align-middle text-center">
							Acciones
						</th>
					</tr>
				</thead>
				<tbody>
					{paginatedCompanies.map((company) => (
						<tr key={company.id}>
							<td className="align-middle text-center">{company.name}</td>
							<td className="align-middle text-center">{company.address}</td>
							<td className="align-middle text-center">{company.phone}</td>
							<td className="align-middle text-center">{company.nit}</td>
							<td className="align-middle text-center">
								{/* Mostrar solo el nombre del archivo */}
								{company.documents && company.documents.length > 0 && (
									<button
									onClick={() => downloadFile(company.id, company.name)}
									className="btn btn-link"
									>
										Descargar Documento
									</button>
								)}
							</td>
							<td className="align-middle text-center">
								{/* verificar si la relacion se cargo */}
								{company.services && company.services.length > 0 ? (
									<ul>
										{/* iterar sobre los servicios y mostrar cada descripción en un elemento de la lista */}
										{company.services.map((service) => (
											<li key={service.id}>{service.description}</li>
										))}
									</ul>
								) : "Sin servicio"}
							</td>
							<td className="align-middle text-center">{company.statusCompany}</td>
							<td className="align-middle text-center">
								<Link
									to={`/editarCompañia/${company.id}`}
									className="btn btn-success btn-sm mx-1"
								>
									Editar
								</Link>
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

export default ListCompaniesEmp;