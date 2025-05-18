<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KoreanDishsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('korean_dishes')->insert([
            [
                'name' => 'Kimchi Jjigae',
                'description' => 'ซุปกิมจิรสเผ็ดร้อน',
                'rating' => 9.8,
                'price' => 120.00,
                'image' => 'https://static.vecteezy.com/system/resources/previews/047/309/667/non_2x/kimchi-on-plate-korean-food-free-png.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Bibimbap',
                'description' => 'ข้าวยำเกาหลีคลุกซอสโกชูจัง',
                'rating' => 9.5,
                'price' => 150.00,
                'image' => 'https://static.vecteezy.com/system/resources/previews/047/309/687/non_2x/bibimbap-on-plate-korean-food-free-png.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Tteokbokki',
                'description' => 'ต๊อกบกกีเผ็ดหวาน',
                'rating' => 9.2,
                'price' => 100.00,
                'image' => 'https://static.vecteezy.com/system/resources/previews/036/464/978/non_2x/ai-generated-a-bowl-of-korean-food-tteokbokki-isolated-on-a-transparent-background-top-view-png.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Bulgogi',
                'description' => 'เนื้อผัดซอสเกาหลีหวานเค็ม',
                'rating' => 9.4,
                'price' => 180.00,
                'image' => 'https://static.vecteezy.com/system/resources/previews/053/987/608/non_2x/traditional-korean-bulgogi-bbq-on-transparent-background-png.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Sundubu Jjigae',
                'description' => 'ซุปเต้าหู้อ่อนรสจัดจ้าน',
                'rating' => 8.8,
                'price' => 130.00,
                'image' => 'https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-sundubu-jjigae-korean-food-png-image_10233523.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Galbi',
                'description' => 'ซี่โครงหมูย่างซอสหวาน',
                'rating' => 8.9,
                'price' => 220.00,
                'image' => 'https://png.pngtree.com/png-clipart/20240325/original/pngtree-pork-galbi-korean-food-png-image_14674010.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Haemul Pajeon',
                'description' => 'แพนเค้กซีฟู้ดต้นหอม',
                'rating' => 8.7,
                'price' => 110.00,
                'image' => 'https://png.pngtree.com/png-clipart/20230428/original/pngtree-haemul-pajeon-png-image_9117551.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Naengmyeon',
                'description' => 'บะหมี่เย็นราดซุปเปรี้ยวสดชื่น',
                'rating' => 8.9,
                'price' => 125.00,
                'image' => 'https://png.pngtree.com/png-clipart/20231020/original/pngtree-naengmyeon-korean-food-png-image_13374036.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
