<?php
namespace App\Services;

use App\Contracts\DatabaseInterface;
use Illuminate\Support\Facades\Hash;

class userService {
    public function __construct(private DatabaseInterface $db) {}

    public function create(array $data){
        $data['passwd'] = Hash::make($data['passwd']);
        $data['role'] = 'user';
        $result = $this->db->insert('users', $data);

        if(!$result){
            return response()->json([
                'error' => 'user already registered'
            ],409);
        }

        return response()->json([
            $result
        ],201);
    }

    public function login(array $data){
        $user = $this->db->findBy('users','email',$data['email']);

        if(!$user || $user['name'] !== $data['name']) {
            return response()->json(['Error:' => 'Invalid Credentials'],401);
        }

        if(!Hash::check($data['passwd'],$user['passwd'])){
            return response()->json(['Error:' => 'Invalid Credentials'],401);
        }

        $user['token'] = bin2hex(random_bytes(16));
        
        $this->db->update('users',$user['id'],$user);

        return response()->json([
            'user' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role'],
            'token' => $user['token']
        ]);
    }

    public function all(array $data){
        $all = $this->db->all('users');

        if(!$all){
            return response()->json([
                'Error' => 'Table not found'
            ],404);
        }

        return response()->json([
            'message' => 'All users',
            $all
        ],200);
    }
}