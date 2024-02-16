<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;
    protected $table = 'clients';
    protected $fillable = ['firstNameClient',
                            'secondNameClient',
                            'SurnameClient',
                            'secondSurnameClient',
                            'numDocument',
                            'phone',
                            'idUser',
                            'idDocumentType',
                            'idCompany',
                            'statusClient'];

    public function users(){
        return $this->belongsTo(User::class, 'idUser');
    }

    public function documenttypes(){
        return $this->belongsTo(DocumentType::class, 'idDocumentType');
    }

    public function companies(){
        return $this->belongsTo(Company::class, 'idCompany');
    }
}
