<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $user = Auth::user();

            // Generar y almacenar el código de autenticación de dos pasos
            $twoFactorCode = Str::random(6); // Genera un código de 6 dígitos
            $user->two_factor_code = $twoFactorCode;
            $user->save();

            // Enviar el código al usuario (por ejemplo, enviarlo por correo electrónico o SMS)

            return response()->json(['message' => 'Por favor, ingrese el código de autenticación de dos pasos'], 200);
        } else {
            return response()->json(['error' => 'Credenciales inválidas'], 401);
        }
    }

    public function verifyTwoFactor(Request $request)
    {
        $user = Auth::user();

        // Validar el código de autenticación de dos pasos
        if ($user->two_factor_code && $request->code === $user->two_factor_code) {
            // Si el código es válido, autenticar al usuario
            Auth::login($user);

            // Limpiar el código de autenticación de dos pasos
            $user->two_factor_code = null;
            $user->save();

            // Obtener los datos necesarios del usuario
            $idRole = $user->idRole;
            $token = Str::random(60);
            $id = $user->id;

            return response()->json([
                'user' => $user,
                'idRole' => $idRole,
                'access_token' => $token,
                'id' => $id
            ], 200);
        } else {
            return response()->json(['error' => 'Código de autenticación inválido'], 401);
        }
    }

    public function logout(Request $request)
    {
        Auth::logout();
        return response()->json(['message' => 'Se ha cerrado sesión'], 200);
    }
}
