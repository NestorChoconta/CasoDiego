<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\model;

class User extends Authenticatable
{
    use HasFactory;
    protected $table = 'users';
    protected $fillable = ['firstName',
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
                            'idDocumentType'];

    public function roles(){
        return $this->belongsTo(Role::class, 'idRole');
    }

    public function documenttypes(){
        return $this->belongsTo(DocumentType::class, 'idDocumentType');
    }

    public function clients(){
        return $this->hasMany(Client::class, 'idUser');
    }

    public function tasks(){
        return $this->hasMany(Task::class, 'idEmpleado', 'id');
    }
}
