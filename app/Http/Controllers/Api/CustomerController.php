<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Csv;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;


class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $query = Customer::query();

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('name', 'like', "%$search%")
                  ->orWhere('phone', 'like', "%$search%");
        }

        return response()->json($query->get());
    }

    // ปรับให้รับ format จาก query param แทน
    public function export(Request $request)
    {
        $format = $request->query('format', 'xlsx'); // default xlsx

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // ดึงข้อมูลลูกค้าจาก DB
        $customers = Customer::all();

        // กำหนดหัวตาราง
        $sheet->setCellValue('A1', 'Name');
        $sheet->setCellValue('B1', 'Email');
        $sheet->setCellValue('C1', 'Phone');
        $sheet->setCellValue('D1', 'Purchase History');

        $rowIndex = 2;
        foreach ($customers as $customer) {
            $sheet->setCellValue("A$rowIndex", $customer->name);
            $sheet->setCellValue("B$rowIndex", $customer->email);
            $sheet->setCellValue("C$rowIndex", $customer->phone);
            $sheet->setCellValue("D$rowIndex", $customer->purchase_history);
            $rowIndex++;
        }

        $filename = "customers." . $format;

        if ($format === 'xlsx') {
            $writer = new Xlsx($spreadsheet);
            $contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        } elseif ($format === 'csv') {
            $writer = new Csv($spreadsheet);
            $contentType = 'text/csv';
        } else {
            return response()->json(['message' => 'Invalid format'], 400);
        }

        // สร้างไฟล์ใน temp
        $filePath = tempnam(sys_get_temp_dir(), $filename);
        $writer->save($filePath);

        return response()->download($filePath, $filename, [
            'Content-Type' => $contentType,
        ])->deleteFileAfterSend(true);
    }
    public function store(Request $request)
{
    $data = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'nullable|email|max:255',
        'phone' => 'nullable|string|max:20',
        'purchase_history' => 'nullable|string',
    ]);

    $customer = Customer::create($data);

    return response()->json($customer, 201);
}

public function update(Request $request, $id)
{
    $customer = Customer::findOrFail($id);

    $data = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'nullable|email|max:255',
        'phone' => 'nullable|string|max:20',
        'purchase_history' => 'nullable|string',
    ]);

    $customer->update($data);

    return response()->json($customer);
}

public function destroy($id)
{
    $customer = Customer::findOrFail($id);
    $customer->delete();

    return response()->json(null, 204);
}
}



