<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage;

class CompanyController extends Controller
{
    public function index()
    {
        $company = Company::with('services')->get();
        return Response::json($company);
    }

    public function store(Request $request)
    {
        $request->validate([
            'documents' => 'required|file|mimes:pdf',
            // Otros campos de validación...
        ]);

        $request->validate([
            'documents' => 'required|file|mimes:pdf',
            // Otros campos de validación...
        ]);
        
        $company = new Company();
        
        // Llenar los campos de la compañía
        $company->name = $request->name;
        $company->address = $request->address;
        $company->phone = $request->phone;
        $company->nit = $request->nit;
        $company->statusCompany = $request->statusCompany;
        $company->verification_code = $request->verification_code;
        
        if ($request->hasFile('documents')) {
            $file = $request->file('documents');
            $fileName = time() . '_' . $file->getClientOriginalName();
        
            // Almacenar el archivo en el sistema de archivos de Laravel
            $filePath = $file->storeAs('documents', $fileName, 'public');
        
            // Asignar directamente el campo 'documents'
            $company->documents = $filePath;
        }
        
        // Guardar cambios
        $company->save();

        return response()->json($company);
    }

    public function downloadDocument(string $id)
    {
        $company = Company::find($id);

        // Verifica que haya al menos un documento asociado a la compañía
        if ($company->documents) {
             // Convertir las barras diagonales a barras invertidas para la ruta
            $filePath = str_replace('/', '\\', $company->documents);
            // Descargar el documento
            return response()->download(storage_path("app/public/{$filePath}"), $company->name . '.pdf');
        }

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
