<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CompanyEditionNotification extends Mailable
{
    use Queueable, SerializesModels;

    

    public function __construct()
    {
        
    }

    public function build()
    {
        return $this->subject('Edición en la información de la compañia')
                    ->view('emails.notificacion_edition_company')
                    ->with([]);
    }
}
