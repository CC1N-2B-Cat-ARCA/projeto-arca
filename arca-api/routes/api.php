<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

use App\Contracts\DatabaseInterface;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;



/* Esse é o coração da api. Aqui definimos as rotas, os endereços
onde o servidor estará enviando dados e escutando chamadas.
por exemplo aqui temos que no endereço 
dominio_do_site/api/teste recebemos o retorno 
do objeto {mensagem: 'api funcionando'} 

ou seja, qualquer um que acessar esse endereço,
irá ter acesso a esse objeto*/

Route::prefix('v1')->group(function () {
    Route::get('/teste', function () {
        return response()->json([
            'mensagem' => 'API funcionando'
        ]);
    });
});

Route::prefix('v1')->group(function () {
    Route::get('/get_user', function () {
        return response()->json([
            'name' => 'marcos aurelio',
            'idade' => 17,
            'email'=> 'marcos.aurelio@gmail.com'
        ]);
    });
});

Route::prefix('v1')->group(function () {
    Route::post('/user', function (Request $request, DatabaseInterface $db) {
        
        $data = $request->validate([
            'name'=> ['required','string'],
            'email' => ['required','email'],
            'passwd' => ['required','min:6'],
        ]);

        $data['passwd'] = Hash::make($data['passwd']);
        $data['role'] = 'user';
        /* Isso vai ser mudado depois para services*/
        return response()->json(
            $db->insert('users',$data),
            201
        )->header('Access-Control-Allow-Origin', 'http://localhost:5500')
->header('Access-Control-Allow-Headers', '*')
->header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    });
});

Route::prefix('v1')->group(function () {
    Route::post('/user/create',[UserController::class, 'store']);
});

Route::prefix('v1')->group(function () {
    Route::post('/user/login',[UserController::class, 'login']);
});

Route::prefix('v1')->group(function () {
    Route::post('/admin/promote',[AdminController::class, 'promote']);
});

Route::prefix('v1')->group(function () {
    Route::delete('/admin/purge',[AdminController::class, 'purge']);
});

Route::prefix('v1')->group(function () {
    Route::get('/users',[userController::class, 'all']);
});