<?php

namespace App\Http\Controllers;

use App\Mail\CompanyRegistration;
use App\Mail\CompanyApproved;
use App\Mail\CompanyRejected;
use App\Models\Company;
use App\Mail\CompanyVerificationMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class CompanyController extends Controller
{
    public function index()
    {
        // Obtener todas las compañías, independientemente de su estado
        $company = Company::with('services')->get();

        // Devolver todas las compañías
        return response()->json($company);
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required',
                'address' => 'required',
                'nit' => 'required|unique:companies',
                'phone' => 'required|unique:companies',
                'email' => 'required|email|unique:companies',
                'documents' => 'required|mimes:pdf',
                'statusCompany' => 'required',
                'idService' => 'required|array|min:1',
            ], [
                'name.required' => 'El nombre de la compañía es obligatorio.',
                'address.required' => 'La dirección de la compañía es obligatoria.',
                'nit.required' => 'El NIT de la compañía es obligatorio.',
                'nit.unique' => 'Ya existe una compañia registrada con este NIT.',
                'phone.required' => 'El número de teléfono de la compañía es obligatorio.',
                'phone.unique' => 'Ya existe una compañia registrada con este número de teléfono.',
                'email.required' => 'El correo electrónico de la compañía es obligatorio.',
                'email.unique' => 'Ya existe una compañia registrada con este correo electrónico',
                'documents.required' => 'Por favor, seleccione un documento.',
                'documents.mimes' => 'El archivo debe ser un documento PDF.',
                'statusCompany.required' => 'El estado de la compañía es obligatorio.',
                'idService.required' => 'Seleccione al menos un servicio.',
                'idService.array' => 'Los servicios deben ser proporcionados como un arreglo.',
                'idService.min' => 'Seleccione al menos un servicio.',
            ]);
        } catch (ValidationException $e) {
            $errors = $e->errors();
            $response = [
                'nameError' => isset($errors['name']) ? $errors['name'][0] : null,
                'addressError' => isset($errors['address']) ? $errors['address'][0] : null,
                'nitError' => isset($errors['nit']) ? $errors['nit'][0] : null,
                'phoneError' => isset($errors['phone']) ? $errors['phone'][0] : null,
                'emailError' => isset($errors['email']) ? $errors['email'][0] : null,
                'documentsError' => isset($errors['documents']) ? $errors['documents'][0] : null,
                'statusCompanyError' => isset($errors['statusCompany']) ? $errors['statusCompany'][0] : null,
                'idServiceError' => isset($errors['idService']) ? $errors['idService'][0] : null,
            ];
            return response()->json($response, 422);
        }

        // Llenar los campos de la compañía
        $company = new Company();
        // se capturan los valores que se tienen en el formulario
        $company->name = $request->name;
        $company->address = $request->address;
        $company->phone = $request->phone;
        $company->nit = $request->nit;
        $company->email = $request->email;
        $company->statusCompany = $request->statusCompany;
        $verification_code = mt_rand(1000, 9999); // Generar código de verificación único
        $company->verification_code = $verification_code;

        if ($request->hasFile('documents')) {
            $file = $request->file('documents');

            // Verificar si el archivo es un PDF
            if ($file->getClientOriginalExtension() !== 'pdf') {
                return response()->json(['documentsError' => 'El archivo debe ser un documento PDF.'], 422);
            }

            $fileName = time() . '_' . $file->getClientOriginalName();

            // Almacenar el archivo en el sistema de archivos de Laravel
            $filePath = $file->storeAs('documents', $fileName, 'public');

            // Asignar directamente el campo 'documents'
            $company->documents = $filePath;
        }

        $roleIds = [1, 2];
        // Recupera los usuarios que son superAdministradores y Administradores
        $users = User::whereIn('idRole', $roleIds)->get();

        $nameCompany = $company->name;

        foreach ($users as $user){
        Mail::to($user->email)->send(new CompanyRegistration($nameCompany ,$verification_code));
        }

        // Guardar cambios
        $company->save();

        // guardar los servicios relacionados con la compañía
        $company->services()->sync($request->input('idService', []));

        return Response::json([
            'company' => $company,
            'message' => 'Verificación exitosa',
        ], 200);
    }

    public function approveCompany(Request $request, string $id)
    {
        $company = Company::findOrFail($id);

        if ($company->statusCompany === 'Activa') {
            return response()->json(['message' => 'La compañía ya ha sido aprobada anteriormente'], 400);
        }

        $company->statusCompany = 'Activa';
        $company->save();

        $nameCompany = $company->name;

        // Enviar el correo electrónico a la dirección de correo electrónico de la compañía registrada
        Mail::to($company->email)->send(new CompanyApproved($nameCompany));

        return response()->json(['message' => 'La compañía ha sido aprobada exitosamente'], 200);
    }

    public function rejectCompany(Request $request, string $id)
    {
        $company = Company::findOrFail($id);

        // Obtener el motivo de rechazo del cuerpo de la solicitud
        $rejectionReason = $request->input('rejection_reason');
        $nameCompany = $company->name;

        // Enviar correo electrónico de rechazo a la compañía
        Mail::to($company->email)->send(new CompanyRejected($nameCompany, $rejectionReason));

        // Eliminar los registros relacionados en la tabla companies_services
        $company->services()->detach();

        // Eliminar la compañía
        $company->delete();

        return response()->json(['message' => 'La compañía ha sido rechazada y eliminada exitosamente'], 200);
    }

    public function VerifyCreateCompany(Request $request)
    {
        $verification_code = mt_rand(100000, 999999); // Generar código de verificación único

        $companyName =$request->input('name');
        $roleIds = [1, 2];
        // Recupera los usuarios que son superAdministradores y Administradores
        $users = User::whereIn('idRole', $roleIds)->get();

        // Envía el correo electrónico a cada uno de ellos
        foreach ($users as $user) {
            Mail::to($user->email)->send(new CompanyVerificationMail($verification_code, $companyName));
        }

        // Envía el código de verificación en la respuesta
        return Response::json([
            'verification_code' => $verification_code
        ]);
    }

    public function downloadDocument(string $id)
    {
        $company = Company::find($id);

        // Verifica que haya al menos un documento asociado a la compañía
        if ($company->documents) {
            // Convertir las barras diagonales a barras invertidas para la ruta
            $filePath = str_replace('/', '\\', $company->documents);
            // Verificar si el archivo existe
            if (Storage::exists("public/{$filePath}")) {
                // Descargar el documento
                return response()->download(storage_path("app/public/{$filePath}"), $company->name . '.pdf');
            } else {
                // Devolver un código de estado HTTP 404 si el archivo no se encuentra
                return response()->json(['error' => 'El documento no se encuentra en nuestro sistema'], 404);
            }
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
        try {
            $request->validate([
                'name' => 'required',
                'address' => 'required',
                'nit' => 'required|unique:companies,nit,' . $id,
                'phone' => 'required|unique:companies,phone,' . $id,
                'email' => 'required|email|unique:companies,email,' . $id,
                'statusCompany' => 'required',
                'idService' => 'required|array|min:1',
            ], [
                'name.required' => 'El nombre de la compañía es obligatorio.',
                'address.required' => 'La dirección de la compañía es obligatoria.',
                'nit.required' => 'El NIT de la compañía es obligatorio.',
                'nit.unique' => 'Ya existe una compañía registrada con este NIT.',
                'phone.required' => 'El número de teléfono de la compañía es obligatorio.',
                'phone.unique' => 'Ya existe una compañía registrada con este número de teléfono.',
                'email.required' => 'El correo electrónico de la compañía es obligatorio.',
                'email.unique' => 'Ya existe una compañia registrada con este correo electrónico',
                'statusCompany.required' => 'El estado de la compañía es obligatorio.',
                'idService.required' => 'Seleccione al menos un servicio.',
                'idService.array' => 'Los servicios deben ser proporcionados como un arreglo.',
                'idService.min' => 'Seleccione al menos un servicio.',
            ]);
        } catch (ValidationException $e) {
            // Captura la excepción de validación
            $errors = $e->errors();
            $response = [
                'nameError' => isset($errors['name']) ? $errors['name'][0] : null,
                'addressError' => isset($errors['address']) ? $errors['address'][0] : null,
                'nitError' => isset($errors['nit']) ? $errors['nit'][0] : null,
                'phoneError' => isset($errors['phone']) ? $errors['phone'][0] : null,
                'emailError' => isset($errors['email']) ? $errors['email'][0] : null,
                'statusCompanyError' => isset($errors['statusCompany']) ? $errors['statusCompany'][0] : null,
                'idServiceError' => isset($errors['idService']) ? $errors['idService'][0] : null,
            ];
            return response()->json($response, 422); // Devuelve el error como JSON
        }

        // Busca el usuario por su ID
        $company = Company::find($id);

        //se capturan los valores que se tienen en el formulario
        $company->name = $request->name;
        $company->address = $request->address;
        $company->phone = $request->phone;
        $company->nit = $request->nit;
        $company->email = $request->email;
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
