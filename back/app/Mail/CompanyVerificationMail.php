<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CompanyVerificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $CompanyVerificationCode;
    public $companyName; // Agrega esta línea

    public function __construct($CompanyVerificationCode, $companyName) // Añade $companyName aquí
    {
        $this->CompanyVerificationCode = $CompanyVerificationCode;
        $this->companyName = $companyName; // Asigna el nombre de la compañía
    }

    public function build()
    {
        return $this->subject('Código de verificación para la creación de la compañía')
                    ->view('emails.company_verification_code')
                    ->with([
                        'codigo' => $this->CompanyVerificationCode,
                        'companyName' => $this->companyName, // Pasa el nombre de la compañía a la vista
                    ]);
    }
}
