import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";

const endpoint = "http://localhost:8000/api";

const ListCompaniesForAproved = () => {
    const [companies, setCompanies] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const navigate = useNavigate();
    const companiesPerPage = 11;
    const token = Cookies.get("casoDiego");
    const decodificacionToken = jwtDecode(token);
    const role = decodificacionToken.sub;
    const [selectedCompanyId, setSelectedCompanyId] = useState(null);
    const [rejectionReason, setRejectionReason] = useState(""); //Almacena el mensaje de rechazo
    const [showRejectionModal, setShowRejectionModal] = useState(false); // Estado para controlar la visibilidad del modal de rechazo
    const [showRejectionError, setShowRejectionError] = useState(false); // Estado para controlar si se muestra el error de rechazo
    const [searchTerm, setSearchTerm] = useState(""); // Término de búsqueda

    // Filtrar compañías por código
    const filteredCompanies = companies.filter((company) => company.verification_code.includes(searchTerm));

    useEffect(() => {
        if (Cookies.get("casoDiego") === undefined) {
            navigate("/");
        }

        getAllCompanies();
    }, [pageNumber]); // Se actualiza cuando cambia la página

    const handleFormSubmit = async (companyId, e) => {
        e.preventDefault();

        try {
            await axios.post(`${endpoint}/company/${companyId}/approve`);
            setCompanies(
                companies.filter((company) => company.id !== companyId)
            );
            toast.success("¡La compañía ha sido aprobada con éxito!");
        } catch (error) {
            console.error("Error al aprobar la compañía:", error);
            toast.error("Error al aprobar la compañía");
        }
    };

    const rejectCompany = async (companyId) => {
        try {
            setSelectedCompanyId(companyId); // Establecer el ID de la compañía seleccionada
            setShowRejectionModal(true); // Mostrar el modal de rechazo
        } catch (error) {
            console.error("Error al rechazar la compañía:", error);
        }
    };

    const submitRejectionReason = async () => {
        try {
			// Verifica si el motivo de rechazo está vacío
			if (rejectionReason.trim() === "") {
                // Mostrar el error si el motivo de rechazo está vacío
                setShowRejectionError(true);
                return;
            }

            // Si el motivo no está vacío, oculta cualquier mensaje de error anterior
            setShowRejectionError(false);

            // Enviar solicitud para rechazar la compañía con el motivo proporcionado
            await axios.delete(`${endpoint}/company/${selectedCompanyId}/reject`, {
                data: {
                    rejection_reason: rejectionReason
                }
            });
            // Actualizar la lista de compañías eliminando la compañía rechazada
            setCompanies(companies.filter((company) => company.id !== selectedCompanyId));
            toast.error("¡La compañía ha sido rechazada y eliminada!");
            setShowRejectionModal(false); // Cerrar el modal después de rechazar la compañía
            setSelectedCompanyId(null); // Resetear el ID seleccionado
            setRejectionReason(""); // Limpiar el mensaje de rechazo después de enviarlo
        } catch (error) {
            console.error("Error al rechazar la compañía:", error);
        }
    };

    const getAllCompanies = async () => {
        try {
            const response = await axios.get(`${endpoint}/companies`);
            // Filtrar las compañías con estado 'Inactiva'
            const inactiveCompanies = response.data.filter(
                (company) => company.statusCompany === "Inactiva"
            );
            setCompanies(inactiveCompanies);
            //console.log(inactiveCompanies);
        } catch (error) {
            console.error("Error al obtener las compañías:", error);
        }
    };

    const pageCount = Math.ceil(filteredCompanies.length / companiesPerPage);
    const offset = pageNumber * companiesPerPage;
    const paginatedCompanies = filteredCompanies.slice(offset, offset + companiesPerPage);

    const changePage = ({ selected }) => {
        setPageNumber(selected);
    };

    const downloadFile = async (id, name) => {
        try {
            const response = await axios.get(`${endpoint}/companies/${id}/download`, {
                responseType: "blob", // Indica que la respuesta es un archivo binario
            });

            // Crea un objeto Blob con los datos recibidos
            const blob = new Blob([response.data]);

            // Crea un enlace (link) temporal
            const link = document.createElement("a");
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
                console.error("Error al descargar el archivo:", error.message);
            }
        }
    };

    // Manejar el cambio en la barra de búsqueda
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setPageNumber(0); // Reiniciar a la primera página al realizar una búsqueda
    };

    return (
        <div className="container-fluid mt-4 px-md-5">
            <h1>COMPAÑIAS EN ESPERA</h1>
			<div className="d-flex justify-content-end align-items-center mt-4">
				<div className="search-bar-container mr-2">
					<input
						type="text"
						placeholder="Buscar por código"
						value={searchTerm}
						onChange={handleSearch}
						className="form-control"
					/>
				</div>
				<div>
					<Link to="/compañias" className="btn btn-success btn-md mx-1">
						Volver
					</Link>
				</div>
			</div>
            <table className="table table-striped table-bordered shadow-lg table-hover mt-4">
                <thead className="thead-light">
                    <tr>
                        <th scope="col" className="col-1 align-middle text-center">
                            Código
                        </th>
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
                            Correo Electrónico
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
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedCompanies.map((company) => (
                        <tr key={company.id}>
                            <td className="align-middle text-center">{company.verification_code}</td>
                            <td className="align-middle text-center">{company.name}</td>
                            <td className="align-middle text-center">{company.address}</td>
                            <td className="align-middle text-center">{company.phone}</td>
                            <td className="align-middle text-center">{company.email}</td>
                            <td className="align-middle text-center">{company.nit}</td>
                            <td className="align-middle text-center">
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
                                {company.services && company.services.length > 0 ? (
                                    <ul>
                                        {company.services.map((service) => (
                                            <li key={service.id}>{service.description}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    "Sin servicio"
                                )}
                            </td>
                            <td className="align-middle text-center">
                                <button
                                    className="btn btn-primary btn-sm mx-1"
                                    onClick={(e) => handleFormSubmit(company.id, e)}
                                >
                                    Aprobar
                                </button>
                                <button
                                    className="btn btn-danger btn-sm mx-1"
                                    onClick={() => rejectCompany(company.id)}
                                >
                                    Rechazar
                                </button>
                                {/* Modal para escribir el motivo de rechazo */}
                                {showRejectionModal && selectedCompanyId === company.id && (
                                    <div className="modal" style={{ display: "block" }}>
                                        <div className="modal-dialog" role="document">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title">Motivo de rechazo</h5>
                                                    <button
                                                        type="button"
                                                        className="close"
                                                        onClick={() => setShowRejectionModal(false)}
                                                    >
                                                        <span>&times;</span>
                                                    </button>
                                                </div>
                                                <div className="modal-body">
                                                    <div className="form-group">
                                                        <textarea
                                                            className={`form-control ${showRejectionError ? 'is-invalid' : ''}`}
                                                            value={rejectionReason}
                                                            onChange={(e) => {
																setRejectionReason(e.target.value);
																setShowRejectionError(false); // Ocultar el error al comenzar a escribir
															}}
                                                        ></textarea>
														{showRejectionError && <div className="invalid-feedback">Por favor escriba el motivo por el cual no se puede aprobar la compañía.</div>}
                                                    </div>
                                                </div>
                                                <div className="modal-footer">
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary"
                                                        onClick={() => setShowRejectionModal(false)}
                                                    >
                                                        Cancelar
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary"
                                                        onClick={submitRejectionReason}
                                                    >
                                                        Enviar Motivo
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {/* Fondo oscuro cuando el modal del motivo de rechazo está abierto */}
                                {showRejectionModal && selectedCompanyId === company.id && (
                                    <div className="modal-backdrop fade show"></div>
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
                pageLinkClassName={"page-link"}
            />
            {/* ToastContainer para mostrar las notificaciones */}
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </div>
    );
};

export default ListCompaniesForAproved;
