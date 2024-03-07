<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CompanyVerificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $CompanyVerificationCode;

    public function __construct($CompanyVerificationCode)
    {
        $this->CompanyVerificationCode = $CompanyVerificationCode;
    }

    public function build()
    {
        return $this->subject('Código de verificación para la creación de la compañía')
                    ->view('emails.company_verification_code')
                    ->with(['codigo' => $this->CompanyVerificationCode]);
    }
}
