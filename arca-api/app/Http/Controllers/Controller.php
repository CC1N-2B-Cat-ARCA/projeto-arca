<?php

namespace App\Http\Controllers;

use App\Contracts\DatabaseInterface;

abstract class Controller
{
    //
}

trait Indexable
{
    protected DatabaseInterface $db;
    public function index(string $table)
    {
        return $this->db->all('users');
    }

    public function show(int $id)
    {
        $user = $this->db->find('users', $id);

        if (!$user) {
            return response()->json(['error' => 'Not Found'], 404);
        }

        return response()->json($user);
    }
}
