<?php

namespace App\Http\Controllers\API;
use Illuminate\Http\Request;
use App\Http\Controllers\BaseController;

class SearchController extends BaseController
{
   

    public function index()
    {
        try {
            return $this->get( $this->model);
      
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "An error occurred: " . $e->getMessage()
            ], 500);
        }
    }
    public function search(Request $request){
       return $request->col;
            // return $this->get( $this->model,
            // $request->all()
            // );
      

  
}
}