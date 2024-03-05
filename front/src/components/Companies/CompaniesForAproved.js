import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const endpoint = "http://localhost:8000/api";

const ListCompaniesForAproved = () => {
    const [companies, setCompanies] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const navigate = useNavigate();
    const companiesPerPage = 11;
    const token = Cookies.get("casoDiego");
    const decodificacionToken = jwtDecode(token);
    const role = decodificacionToken.sub;

    useEffect(() => {
        if (Cookies.get("casoDiego") === undefined) {
            navigate("/");
        }

        getAllCompanies();
    }, [pageNumber]); // Se actualiza cuando cambia la página

    const approveCompany = async (companyId) => {
        try {
            await axios.post(`${endpoint}/company/${companyId}/approve`);
            setCompanies(companies.filter(company => company.id !== companyId));
        } catch (error) {
            console.error('Error al aprobar la compañía:', error);
        }
    };

    const rejectCompany = async (companyId) => {
        try {
            await axios.delete(`${endpoint}/company/${companyId}/reject`);
            setCompanies(companies.filter(company => company.id !== companyId));
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
            console.log(inactiveCompanies);
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
                                    <a href={`${endpoint}/companies/${company.id}/download`} download>
                                        {`DocumentoCompañia${company.name}.${company.documents[0].extension}`}
                                    </a>
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
                                    className="btn btn-primary btn-sm"
                                    onClick={() => approveCompany(company.id)}
                                >
                                    Aprobar
                                </button>
                                <button
                                    className="btn btn-danger btn-sm ml-2"
                                    onClick={() => rejectCompany(company.id)}
                                >
                                    Rechazar
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
                pageLinkClassName={"page-link"}
            />
        </div>
    );
};

export default ListCompaniesForAproved;
