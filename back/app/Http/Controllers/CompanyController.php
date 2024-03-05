<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class CompanyController extends Controller
{
    public function index()
    {
        $company = Company::with('services')->get();
        return Response::json($company);
    }

    public function store(Request $request)
    {
        $company = new Company();

        //se capturan los valores que se tienen en el formulario
        $company->name = $request->name;
        $company->address = $request->address;
        $company->phone = $request->phone;
        $company->nit = $request->nit;
        $company->documents = $request->documents;
        $company->statusCompany = $request->statusCompany;
        $company->verification_code = $request->verification_code;

        //con el metodo save se guarda todo en la tabla
        $company->save();

        //guardar los servicios relacionados con la compañía
        $company->services()->sync($request->input('idService', []));

        return Response::json([
            'company' => $company
        ]);
    }

    public function downloadDocument(string $id)
    {
        $company = Company::find($id);

        // Verifica que haya al menos un documento asociado a la compañía
        if ($company->documents) {
            // Descargar el documento
            return response($company->documents, 200, [
                'Content-Type' => $company->mime_type,
                'Content-Disposition' => 'attachment; filename="' . $company->name . '"',
            ]);
        }

        // Manejar el caso donde no hay documentos
        return response()->json(['error' => 'No hay documentos disponibles para descargar'], 404);
    }

    public function show(string $id)
    {
        //El metodo find sirve para traer solo un registro
        $company = Company::with('services')->find($id);
        return $company;
    }

    public function update(Request $request, string $id)
    {
        // Busca el usuario por su ID
        $company = Company::find($id);

        //se capturan los valores que se tienen en el formulario
        $company->name = $request->name;
        $company->address = $request->address;
        $company->phone = $request->phone;
        $company->nit = $request->nit;
        $company->statusCompany = $request->statusCompany;

        //Guarda cambios
        $company->save();

        //guardar los servicios relacionados con la compañía
        $company->services()->sync($request->input('idService', []));

        return Response::json([
            'company' => $company
        ]);
    }

    public function destroy(string $id)
    {
        //
    }
}
