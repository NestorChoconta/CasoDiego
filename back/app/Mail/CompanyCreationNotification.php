<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CompanyCreationNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $nameCompany;

    public function __construct($nameCompany)
    {
        $this->nameCompany = $nameCompany;
    }

    public function build()
    {
        return $this->subject('Confirmación exitosa de creación de compañía')
                    ->view('emails.notificacion_creation_company')
                    ->with(['nombreCompañia' => $this->nameCompany]);
    }
}
