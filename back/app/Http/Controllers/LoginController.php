<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Mail;
use App\Mail\VerificationCodeMail;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $idRole = $user->idRole;

            // Generar el token JWT para el usuario autenticado
            $customToken = JWTAuth::claims(['id' => $user->id, 'role' => $idRole])->fromUser($user);

            $verification_code = mt_rand(100000, 999999);

            Mail::to($user->email)->send(new VerificationCodeMail($verification_code));
            DB::table('users')
                ->where('id', $user->id)
                ->update(['verification_code' => $verification_code]);

            // Obtener los datos necesarios del usuario
            $id = $user->id;

            return response()->json([
                'user' => $user,
                'idRole' => $idRole,
                'access_token' => $customToken,
                'id' => $id,
                'verification_code' => $verification_code
            ], 200);
        } else {
            return response()->json(['error' => 'Credenciales incorrectas'], 401);
        }
    }

    public function verifyCode(Request $request)
{
    $user = $request->user();
    $token = $request->bearerToken();

    // Verificar si el usuario está autenticado y si se proporciona un token
    if ($user && $token) {
        // Obtener el idRole solo si el usuario está autenticado correctamente
        $idRole = $user->idRole;

        // Obtener el código enviado por el usuario en la solicitud
        $userVerificationCode = $request->input('verification_code');

        // Obtener el código guardado en la base de datos para el usuario actual
        $storedVerificationCode = $user->verification_code;

        // Comparar el código enviado por el usuario con el almacenado en la base de datos
        if ($userVerificationCode == $storedVerificationCode) {
            return response()->json([
                'message' => 'Verificación correcta',
                'user' => $user,
                'access_token' => $token,
                'idRole' => $idRole,
                'verification_code' => $storedVerificationCode
            ], 200);
        }
    }

    // Si la verificación falla o el usuario no está autenticado, devolver un error
    return response()->json(['error' => 'Verificación fallida'], 401);
}

    public function logout(Request $request)
    {
        Auth::logout();
        return response()->json(['message' => 'cierre de session exitoso'], 200);
    }
}
