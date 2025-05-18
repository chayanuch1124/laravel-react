<?php
// app/Http/Controllers/Api/KoreanDishController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\KoreanDish;
use Illuminate\Http\Request;

class KoreanDishController extends Controller
{
    //แสดงทั้งหมด
    public function index()
    {
        $korean_dishes = KoreanDish::all();
        return response()->json($korean_dishes);
    }

    // แสดงรายละเอียดของสินค้าเฉพาะรายการ
    public function show($id)
    {
        $korean_dishe = KoreanDish::find($id);

        if (!$korean_dishe) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        return response()->json($korean_dishe);
    }


    // เพิ่มเมนูใหม่
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'description' => 'required|string|max:255',
            'rating' => 'required|numeric',
            'price' => 'required|numeric|min:20',
            'image' => 'required|url',
        ]);

        $korean_dishe = KoreanDish::create($validated);
        return response()->json(['message' => 'Menu created successfully!', 'product' => $korean_dishe], 201);
    }


    // อัปเดตสินค้าที่มีอยู่
    public function update(Request $request, $id)
    {
        $korean_dishe = KoreanDish::find($id);

        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'description' => 'required|string|max:255',
            'rating' => 'required|numeric',
            'price' => 'required|numeric|min:20',
            'image' => 'required|url',
        ]);

        $korean_dishe->update($validated);

        return response()->json(['message' => 'Menu updated successfully!', 'Menu' => $korean_dishe]);
    }


    // ลบสินค้าที่มีอยู่
    public function destroy($id)
    {
        $korean_dishe = KoreanDish::find($id);


        if (!$korean_dishe) {
            return response()->json(['error' => 'Menu not found'], 404);
        }

        $korean_dishe->delete();

        return response()->json(['message' => 'Menu  deleted successfully!']);
    }
}

