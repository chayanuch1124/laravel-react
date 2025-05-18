<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('korean_dishes', function (Blueprint $table) {
            $table->id();
            $table->string('image'); // รูปภาพ
            $table->string('name'); // ชื่ออาหาร
            $table->float('rating', 2, 1); // รีวิว
            $table->decimal('price', 8, 2); // ราคา
            $table->text('description'); // คำอธิบาย
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('korean_dishes');
    }
};
