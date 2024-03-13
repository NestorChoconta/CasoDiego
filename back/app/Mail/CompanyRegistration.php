<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CompanyRegistration extends Mailable
{
    use Queueable, SerializesModels;

    public $nameCompany;
    public $verification_code;

    public function __construct($nameCompany, $verification_code)
    {
        $this->nameCompany = $nameCompany;
        $this->verification_code = $verification_code;
    }

    public function build()
    {
        return $this->subject('Nueva Compañia En Espera')
                    ->view('emails.notificacion_company_registration')
                    ->with(['nombreCompañia' => $this->nameCompany, 'verification_code' => $this->verification_code]);
    }
}
