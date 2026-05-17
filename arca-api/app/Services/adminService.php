<?php

namespace App\Services;

use App\Contracts\DatabaseInterface;
use Illuminate\Support\Facades\Hash;

class adminService
{
    public function __construct(private DatabaseInterface $db) {}

    public function create(array $data)
    {
        $data['passwd'] = Hash::make($data['passwd']);
        $data['role'] = 'user';

        return $this->db->insert('users', $data);
    }

    public function purge_database(array $data)
    {
        $user = $this->db->findBy('users', 'token', $data['token']);

        if (
            !$user ||
            $user['token'] !== $data['token']
        ) {
            return response()->json([
                'Error' => 'Invalid Credentials'
            ], 401);
        }

        if ($user['role'] !== 'admin') {
            return response()->json(
                [
                    'Error' => 'Unauthorized Credentials'
                ],
                403
            );
        }

        //$this->db->purge();

        return response()->json([
            'message' => 'A database foi pro caralho com sucesso.'
        ],200);
    }

    public function promote(array $data)
    {   
        $admin = $this->db->findBy('users','token',$data['token']);
        $target = $this->db->findBy('users', 'email', $data['email']);
        
        /* Aqui eu poderia adicionar algum teste pra ver por exemplo se os dados passados
        possuem um @ ou algo do tipo, pra informar "Digite um email valido" ou algo do tipo. 
        Mas por enquanto vou deixar apenas o 404 - Not found mesmo */
        if (!$target){
            return response()->json([
                'Error' => 'User not Found'
            ], 404);
        }

        if ($admin['role'] !== 'admin') {
            return response()->json(
                [
                    'Error' => 'Unauthorized Credentials'
                ],
                403
            );
        }

        $this->db->update('users', $target['id'], [
            'role' => 'admin'
        ]);
        return response()->json([
            'message' => 'User promoted successfully'
        ], 200);
    }
}
