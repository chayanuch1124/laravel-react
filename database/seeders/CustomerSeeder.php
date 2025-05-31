<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CustomerSeeder extends Seeder
{
    public function run()
    {
        DB::table('customers')->insert([
            ['name' => 'John Doe', 'email' => 'john@example.com', 'phone' => '1234567890', 'purchase_history' => 'Laptop, Wireless Mouse'],
            ['name' => 'Jane Smith', 'email' => 'jane@example.com', 'phone' => '0987654321', 'purchase_history' => 'Smartphone'],
            ['name' => 'Alice Johnson', 'email' => 'alice@example.com', 'phone' => '1122334455', 'purchase_history' => 'Bluetooth Speaker, Smartwatch'],
            ['name' => 'Bob Brown', 'email' => 'bob@example.com', 'phone' => '5566778899', 'purchase_history' => 'Tablet'],
            ['name' => 'Charlie Davis', 'email' => 'charlie@example.com', 'phone' => '6677889900', 'purchase_history' => 'Gaming Chair, Mechanical Keyboard'],
        ]);
    }
}
