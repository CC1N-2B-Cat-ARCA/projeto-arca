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
        $user = $this->db->findBy('users', 'email', $data['email']);

        if (
            !$user ||
            $user['token'] !== $data['token'] ||
            !Hash::check($data['passwd'], $user['passwd'])
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

        $this->db->purge();

        return response()->json([
            'message' => 'A database foi pro caralho com sucesso.'
        ],200);
    }

    public function promote(array $data)
    {
        $user = $this->db->findBy('users', 'email', $data['email']);

        if (
            !$user ||
            $user['token'] !== $data['token'] ||
            !Hash::check($data['passwd'], $user['passwd'])
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

        $target = $this->db->findBy('users', 'email', $data['target']['email']);
        if (!$target) {
            return response()->json([
                'Error' => 'Target not found'
            ], 404);
        }

        $this->db->update('users', $target['id'], [
            'role' => 'admin'
        ]);
        return response()->json([
            'message' => 'User promoted successfully'
        ], 200);
    }
}
