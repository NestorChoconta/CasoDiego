import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import Cookies from "js-cookie";

const endpoint = "http://localhost:8000/api";

const ListUserAdmin = () => {
	const [users, setUsers] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [pageNumber, setPageNumber] = useState(0);
	const usersPerPage = 11; // Número de usuarios por página
	const navigate = useNavigate();

	useEffect(() => {
		if (Cookies.get("casoDiego") === undefined) {
			navigate("/");
		}

		getAllUsers();
	}, [pageNumber]);

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
		return (
			user.role &&
			(user.idRole === 2 || user.idRole === 3) &&
			(user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
				phone.includes(searchTerm))
		);
	});

	const pageCount = Math.ceil(filteredUsers.length / usersPerPage);

	const changePage = ({ selected }) => {
		setPageNumber(selected);
	};

	const offset = pageNumber * usersPerPage;
	const paginatedUsers = filteredUsers.slice(offset, offset + usersPerPage);

	return (
		<div className="container-fluid mt-4 px-md-5">
			<h1>USUARIOS</h1>
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
					<Link to="/AdCrearU" className="btn btn-success btn-md mx-1">
						Crear Usuario
					</Link>
					<Link to="/MenuAdmin" className="btn btn-success btn-md mx-1">
						Atrás
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
									to={`/AdEditarU/${user.id}`}
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

export default ListUserAdmin;
