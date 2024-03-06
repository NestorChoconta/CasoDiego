<?php

namespace App\Http\Controllers;


use App\Models\Company;
use App\Mail\CompanyVerificationMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Response;

class CompanyController extends Controller
{
    public function index()
{
    // Obtener todas las compañías, independientemente de su estado
    //$companies = Company::all();
    $company= Company::with('services')->get();

    // Devolver todas las compañías
    return response()->json($company);
}


    public function approveCompany(Request $request, string $id)
    {
        $company = Company::findOrFail($id);

        if ($company->statusCompany === 'Activa') {
            return response()->json(['message' => 'La compañía ya ha sido aprobada anteriormente'], 400);
        }

        $company->statusCompany = 'Activa';
        $company->save();

        return response()->json(['message' => 'La compañía ha sido aprobada exitosamente'], 200);
    }

    public function rejectCompany(Request $request, string $id)
{
    $company = Company::findOrFail($id);

    // Eliminar los registros relacionados en la tabla companies_services
    $company->services()->detach();

    // Eliminar la compañía
    $company->delete();

    return response()->json(['message' => 'La compañía ha sido rechazada y eliminada exitosamente'], 200);
}

    public function VerifyCreateCompany(Request $request)
    {
        $verification_code = mt_rand(100000, 999999); // Generar código de verificación único

        $roleIds = [1, 2];
        // Recupera los usuarios que son superAdministradores y Administradores
        $users = User::whereIn('idRole', $roleIds)->get();

        // Envía el correo electrónico a cada uno de ellos
        foreach ($users as $user) {
            Mail::to($user->email)->send(new CompanyVerificationMail($verification_code));
        }

        // Envía el código de verificación en la respuesta
        return Response::json([
            'verification_code' => $verification_code
        ]);
    }

    public function store(Request $request)
    {
        //if ($request->verification_code === $request->user_verification_code) {

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
            'company' => $company,
            'message'=>'Verificación exitosa'
        ], 200);
        //} else  {
            //return Response::json([
              //  'message' => 'codigo de verificación no valido'
            //], 400);
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
        //
    }

    public function update(Request $request, string $id)
    {
        //
    }

    public function destroy(string $id)
    {
        //
    }
}
