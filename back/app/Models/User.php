<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject; // Importar la interfaz JWTSubject

class User extends Authenticatable implements JWTSubject // Implementar la interfaz JWTSubject
{
    use HasFactory;

    protected $table = 'users';
    protected $fillable = [
        'firstName',
        'secondName',
        'Surname',
        'secondSurname',
        'numDocument',
        'birthdate',
        'email',
        'password',
        'phone',
        'adress',
        'idRole',
        'two_factor_auth',
        'idDocumentType'
    ];

    public function roles()
    {
        return $this->belongsTo(Role::class, 'idRole');
    }

    public function documenttypes()
    {
        return $this->belongsTo(DocumentType::class, 'idDocumentType');
    }

    public function clients()
    {
        return $this->hasMany(Client::class, 'idUser');
    }

    public function tasks()
    {
        return $this->hasMany(Task::class, 'idEmpleado', 'id');
    }

    // Implementación de los métodos de la interfaz JWTSubject
    public function getJWTIdentifier()
    {
        return $this->getKey(); // Retorna la clave primaria del usuario
    }

    public function getJWTCustomClaims()
    {
        return []; // Aquí puedes agregar información adicional al token si lo necesitas
    }
}
