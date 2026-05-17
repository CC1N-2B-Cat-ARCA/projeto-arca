<?php 
namespace App\Http\Controllers;

use App\Contracts\DatabaseInterface;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\userService;

class UserController extends Controller {
    public function __construct(
        private DatabaseInterface $db
    ){}

    public function index(){
        return $this->db->all('users');
    }

    public function show(int $id){
        $user = $this->db->find('users',$id);

        if(!$user){
            return response()->json(['error' => 'Not Found'],404);
        }

        return response()->json($user);
    }

    public function store(Request $request, userService $service){
        $data = $request->validate([
            'name' => ['required','string'],
            'email' => ['required','email'],
            'passwd' => ['required','min:6'] 
        ]);

        return $service->create($data);

/*         return response()->json([
            'user' => $user,
            'token' => bin2hex(random_bytes(8))
            ],
            201); */
    }

    public function login(Request $request, userService $service) {
        return $service->login($request->all());
    }

    public function all(Request $request, userService $service){
        return $service->all($request->all());
    }
}