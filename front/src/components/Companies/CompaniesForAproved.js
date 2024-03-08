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
    const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal
    const [enteredVerificationCode, setEnteredVerificationCode] = useState(); // Estado para almacenar el código de verificación ingresado por el usuario
    const [verificationCode, setVerificationCode] = useState();
    const [selectedCompanyId, setSelectedCompanyId] = useState(null);


    useEffect(() => {
        if (Cookies.get("casoDiego") === undefined) {
            navigate("/");
        }

        getAllCompanies();
    }, [pageNumber]); // Se actualiza cuando cambia la página

    useEffect(() => {
        setEnteredVerificationCode("");
    }, [showModal]);


    const handleFormSubmit = async (companyId ,e) => {
        e.preventDefault();


        try {
            // Generar un nuevo código de verificación
            const response = await axios.post(`${endpoint}/company`);
            const newVerificationCode = response.data.verification_code;
			// console.log("Código de Verificación:", newVerificationCode);
            setVerificationCode(newVerificationCode);
            setSelectedCompanyId(companyId);

            // Mostrar el modal para que el usuario valide el código de verificación
            setShowModal(true);
        } catch (error) {
            console.error("Error creating company:", error);
        }
    };


    const approveCompany = async () => {
        if (!selectedCompanyId) return; // Comprobar si hay una compañía seleccionada
        try {
            const enteredVerificationCodeNum = parseInt(enteredVerificationCode);
            if (verificationCode === enteredVerificationCodeNum) {
                await axios.post(`${endpoint}/company/${selectedCompanyId}/approve`);
                setCompanies(companies.filter(company => company.id !== selectedCompanyId));
                toast.success("¡La compañía ha sido aprobada con éxito!");
                setShowModal(false); // Cerrar el modal después de validar y mostrar la notificación
                setSelectedCompanyId(null); // Resetear el ID seleccionado
            } else {
                toast.error("Código de verificación incorrecto");
            }
        } catch (error) {
            console.error('Error al aprobar la compañía:', error);
            toast.error("Error al aprobar la compañía");
        }
    };



    const rejectCompany = async (companyId) => {
        try {
            await axios.delete(`${endpoint}/company/${companyId}/reject`);
            setCompanies(companies.filter(company => company.id !== companyId));
            toast.error("¡La compañía ha sido rechazada y eliminada!");
        } catch (error) {
            console.error('Error al rechazar la compañía:', error);
        }
    };

    const getAllCompanies = async () => {
        try {
            const response = await axios.get(`${endpoint}/companies`);
            // Filtrar las compañías con estado 'Inactiva'
            const inactiveCompanies = response.data.filter(company => company.statusCompany === 'Inactiva');
            setCompanies(inactiveCompanies);
            //console.log(inactiveCompanies);
        } catch (error) {
            console.error('Error al obtener las compañías:', error);
        }
    };

    const pageCount = Math.ceil(companies.length / companiesPerPage);
    const offset = pageNumber * companiesPerPage;
    const paginatedCompanies = companies.slice(offset, offset + companiesPerPage);

    const changePage = ({ selected }) => {
        setPageNumber(selected);
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
            <h1>COMPAÑIAS EN ESPERA</h1>
            <div className="d-flex justify-content-end align-items-center mt-4">
                <Link to="/compañias" className="btn btn-success btn-md mx-1">
                    Volver
                </Link>
            </div>
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
                                ) : "Sin servicio"}
                            </td>
                            <td className="align-middle text-center">
                                <button
                                    className="btn btn-primary btn-sm mb-1"
                                    onClick={(e) => handleFormSubmit(company.id, e)}
                                >
                                    Aprobar
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => rejectCompany(company.id)}
                                >
                                    Rechazar
                                </button>
                                {/* Modal para validar código de verificación */}
                                {showModal && (
                                    <div className="modal" style={{ display: "block" }}>
                                        <div className="modal-dialog" role="document">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title">Validar Código de Verificación</h5>
                                                    <button type="button" className="close" onClick={() => setShowModal(false)}>
                                                        <span>&times;</span>
                                                    </button>
                                                </div>
                                                <div className="modal-body">
                                                    <div className="form-group">
                                                        <label>El codigo de verificación fue enviado a su correo electronico </label><br/><br/>
                                                        <label>Por favor digite el codigo:</label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            value={enteredVerificationCode}
                                                            onChange={(e) => setEnteredVerificationCode(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                                                    <button type="button" className="btn btn-primary" onClick={() => approveCompany(company.id)}>Validar</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {/* Fondo oscuro cuando el modal está abierto */}
                                {showModal && <div className="modal-backdrop fade show"></div>}
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
