<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CompanyRejected extends Mailable
{
    use Queueable, SerializesModels;

    public $nameCompany;
    public $rejectionReason;

    public function __construct($nameCompany, $rejectionReason)
    {
        $this->nameCompany = $nameCompany;
        $this->rejectionReason = $rejectionReason;
    }

    public function build()
    {
        return $this->subject('Rechazo de compañia')
                    ->view('emails.notificacion_rejected_company')
                    ->with(['nombreCompañia' => $this->nameCompany, 'rejectionReason' => $this->rejectionReason]);
    }
}
