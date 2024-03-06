<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50);
            $table->string('address', 50);
            $table->BigInteger('phone')->unique();
            $table->BigInteger('nit')->unique();
            $table->binary('documents');
            $table->enum('statusCompany', ['Activa', 'Inactiva'])->default('Inactiva');
            $table->string('verification_code')->nullable();
            $table->timestamps();
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
