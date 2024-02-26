<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Response;


class UserController extends Controller
{

    public function index()
    {
        //El metodo all sirve para traer todos los registros de la tabla
        $user = DB::table('users')->join('roles', 'users.idRole', '=', 'roles.id')
            ->join('document_types', 'users.idDocumentType', '=', 'document_types.id')
            ->select('users.*', 'roles.role', 'document_types.description')
            ->get();
        return Response::json($user);
    }


    public function store(Request $request)
    {
        $countSuperAdmin = DB::table('users')->where('idRole', 1)->count();
        $countAdmin = DB::table('users')->where('idRole', 2)->count();

        if ($request->idRole == 1 && $countSuperAdmin >= 2) {
            return Response::json([
                'error' => 'Solo se permite el registro de 2 usuarios Super Administradores y ya existen.',
            ], 422);
        } elseif ($request->idRole == 2 && $countAdmin >= 2) {
            return Response::json([
                'error' => 'Solo se permite el registro de 2 usuarios Administradores y ya existen.',
            ], 422);
        }

        $user = new User();

        //se capturan los valores que se tienen en el formulario
        $user->firstName = $request->firstName;
        $user->secondName = $request->secondName;
        $user->Surname = $request->Surname;
        $user->secondSurname = $request->secondSurname;
        $user->numDocument = $request->numDocument;
        $user->birthdate = $request->birthdate;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->phone = $request->phone;
        $user->adress = $request->adress;
        $user->idRole = $request->idRole;
        $user->idDocumentType = $request->idDocumentType;

        //con el metodo save se guarda todo en laa tabla
        $user->save();

        return Response::json([
            'user' => $user
        ]);
    }


    public function show(string $id)
    {
        //El metodo find sirve para traer solo un registro
        $user = DB::table('users')->find($id);
        return $user;
    }


    public function update(Request $request, string $id)
    {
        // Busca el usuario por su ID
        $user = User::find($id);

        // Obtiene el rol actual del usuario antes de actualizar
        $currentRoleId = $user->idRole;

        // Realiza la validación de roles solo si el rol está siendo modificado
        if ($request->has('idRole') && $request->idRole != $currentRoleId) {

            $countSuperAdmin = DB::table('users')->where('idRole', 1)->count();
            $countAdmin = DB::table('users')->where('idRole', 2)->count();

            if ($request->idRole == 1 && $countSuperAdmin >= 2) {
                return Response::json([
                    'error' => 'Estas actualizando el rol del usuario mal, solo se permite el registro de 2 usuarios Super Administradores y ya existen.',
                ], 422);
            } elseif ($request->idRole == 2 && $countAdmin >= 2) {
                return Response::json([
                    'error' => 'Estas actualizando el rol del usuario mal, solo se permite el registro de 2 usuarios Administradores y ya existen.',
                ], 422);
            }
        }

        // Captura los valores que se modificaron en el formulario
        $user->firstName = $request->firstName;
        $user->secondName = $request->secondName;
        $user->Surname = $request->Surname;
        $user->secondSurname = $request->secondSurname;
        $user->numDocument = $request->numDocument;
        $user->birthdate = $request->birthdate;
        $user->email = $request->email;
        $user->phone = $request->phone;
        $user->adress = $request->adress;
        $user->idRole = $request->idRole;
        $user->idDocumentType = $request->idDocumentType;

        // Guarda los cambios en la base de datos
        $user->save();

        // Redirecciona al guardar los cambios del formulario
        return Response::json([
            'user' => $user
        ]);
    }

    public function destroy(string $id)
    {
        $user = User::destroy($id);
        return $user;
    }

    public function getRegularUsers()
    {
        $regularUsers = User::where('idRole', '3')->with('tasks')->get();
        return Response::json($regularUsers);
    }
}
