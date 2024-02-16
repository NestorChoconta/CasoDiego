<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentType extends Model
{
    use HasFactory;
    protected $table = 'document_types';
    protected $fillable = ['description'];

    public function users(){
        return $this->hasMany(User::class, 'idDocumentType');
    }

    public function clients(){
        return $this->hasMany(Client::class, 'idDocumentType');
    }
}
