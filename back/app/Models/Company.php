<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory; 
    protected $table = 'companies';
    protected $fillable = ['name',
                            'adress',
                            'phone',
                            'nit',
                            'client_serv_contract',
                            'statusCompany',
                            'verification_code',
                            'idService'];

    public function clients(){
        return $this->hasMany(Client::class, 'idCompany');
    }

    public function services(){
        return $this->belongsTo(Service::class, 'idService');
    }
}
