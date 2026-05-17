<?php 
namespace App\Http\Controllers;

use App\Contracts\DatabaseInterface;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\adminService;

class AdminController extends Controller {
    public function __construct(
        private DatabaseInterface $db
    ){}

    public function index(){
        return $this->db->all('admin');
    }

    public function show(int $id){
        $user = $this->db->find('admin',$id);

        if(!$user){
            return response()->json(['error' => 'Not Found'],404);
        }

        return response()->json($user);
    }

    public function promote(Request $request, adminService $adm_service) {
        return $adm_service->promote($request->all());
    }

    public function store(Request $request){
        $data = $request->validate([
            'name' => 'required|string'
        ]);

        return response()->json(
            $this->db->insert('admin', $data)
        );
    }

    public function purge(Request $request, adminService $service){
        $data = $request->validate([
            'token' => ['required'],
        ]);

        return $service->purge_database($data);

    }
}