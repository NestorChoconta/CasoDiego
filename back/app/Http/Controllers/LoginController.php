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
            $idRole = $user->idRole;
            $token = Str::random(60);
            
            // Obtener los datos necesarios del usuario
            $id = $user->id;
    
            return response()->json([
                'user' => $user,
                'idRole' => $idRole,
                'access_token' => $token,
                'id' => $id
            ], 200);
        } else {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    }

    public function logout(Request $request)
    {
        Auth::logout();
        return response()->json(['message' => 'Logged out'], 200);
    }
}