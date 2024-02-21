<?php

namespace App\Imports;

use App\Models\Client;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class ClientImport implements ToCollection, WithHeadingRow
{
    public function collection(Collection $rows)
    {
        try {
            foreach ($rows->toArray() as $row) {
                if (isset($row['primernombre'])) {
                    $this->createClientFromImport($row);
                }
            }

            // Opcional: Puedes realizar algún procesamiento adicional después de importar
        } catch (\Exception $e) {
            // Agregar un log para registrar el error
            \Illuminate\Support\Facades\Log::error('Error al importar el archivo: ' . $e->getMessage());
            throw $e;
        }
    }

    private function createClientFromImport(array $row)
    {
        Client::create([
            'firstNameClient' => $row['primernombre'],
            'secondNameClient' => $row['segundonombre'] ?? null,
            'SurnameClient' => $row['primerapellido'],
            'secondSurnameClient' => $row['segundoapellido'] ?? null,
            'numDocument' => $row['numerodocumento'],
            'phone' => $row['numerocelular'],
            'idUser' => $row['idusuario'],
            'idDocumentType' => $row['idtipodocumento'],
            'idCompany' => $row['idcompa'],
            'statusClient' => $row['estadocliente'],
        ]);
    }
}