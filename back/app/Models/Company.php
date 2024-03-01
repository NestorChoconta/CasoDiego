<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory; 
    protected $table = 'companies';
    protected $fillable = ['name',
                            'address',
                            'phone',
                            'nit',
                            'documents',
                            'statusCompany',
                            'verification_code'];

    public function clients(){
        return $this->hasMany(Client::class, 'idCompany');
    }

    //relación muchos a muchos con Service a través de la tabla pivot 'companies_services'
    public function services(){
        return $this->belongsToMany(Service::class, 'companies_services', 'idCompany', 'idService');
    }
}
