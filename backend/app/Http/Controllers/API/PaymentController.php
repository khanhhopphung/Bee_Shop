<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
// use Illuminate\Http\Request;
use PhpParser\Node\Expr\Match_;


use Illuminate\Http\Request;
class PaymentController extends Controller
{
    public function vnPay(Request $request)
    {
        // Lấy số tiền và mã ngân hàng từ request
        $vnp_Amount = $request->input('amount'); // Số tiền đơn hàng
        $vnp_BankCode = $request->input('bank_code'); // Mã ngân hàng

        // Kiểm tra nếu số tiền và mã ngân hàng không hợp lệ
        if (!$vnp_Amount || !$vnp_BankCode) {
            return response()->json(['code' => '01', 'message' => 'Số tiền hoặc mã ngân hàng không hợp lệ']);
        }

        // VNPAY thông tin
        $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        
        $vnp_Returnurl = "http://localhost:3000/ordersuccess";
        // $vnp_Returnurl = "http://localhost:3000/payments";
        // $vnp_Returnurl = "http://localhost/Bee_Shop/backend/vnpay_php/vnpay_return.php";
        $vnp_TmnCode = "AY8UDN7Q"; // Mã website tại VNPAY
        $vnp_HashSecret = "55TYK0C9CIEB0Q8MU57B3XCUGEFT9J0C"; // Chuỗi bí mật

        // Mã đơn hàng và thông tin đơn hàng
        // Generate a random transaction reference
$match = mt_rand(1000, 9999);  // Generate a random number
$vnp_TxnRef = "OD" . $match;   // Combine with "OD"

        $vnp_OrderInfo = "Thanh toán hóa đơn cho đơn hàng có mã: " . $vnp_TxnRef;
        $vnp_OrderType = "ATM";
        $vnp_Locale = 'VN';
        $vnp_IpAddr = $_SERVER['REMOTE_ADDR'];

        // Dữ liệu gửi tới VNPAY
        $inputData = array(
            "vnp_Version" => "2.1.0",
            "vnp_TmnCode" => $vnp_TmnCode,
            "vnp_Amount" => $vnp_Amount * 100, // Convert VND to cents
            "vnp_Command" => "pay",
            "vnp_CreateDate" => date('YmdHis'),
            "vnp_CurrCode" => "VND",
            "vnp_IpAddr" => $vnp_IpAddr,
            "vnp_Locale" => $vnp_Locale,
            "vnp_OrderInfo" => $vnp_OrderInfo,
            "vnp_OrderType" => $vnp_OrderType,
            "vnp_ReturnUrl" => $vnp_Returnurl,
            "vnp_TxnRef" => $vnp_TxnRef,
        );

        // Thêm thông tin ngân hàng nếu có
        if (isset($vnp_BankCode) && $vnp_BankCode != "") {
            $inputData['vnp_BankCode'] = $vnp_BankCode;
        }

        // Sắp xếp dữ liệu theo thứ tự A-Z
        ksort($inputData);
        $query = "";
        $i = 0;
        $hashdata = "";
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashdata .= urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
            $query .= urlencode($key) . "=" . urlencode($value) . '&';
        }

        // Tạo URL thanh toán
        $vnp_Url = $vnp_Url . "?" . $query;
        if (isset($vnp_HashSecret)) {
            $vnpSecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);
            $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;
        }

        // Trả về URL thanh toán
        $returnData = array('code' => '00', 'message' => 'success', 'data' => $vnp_Url);
        
        // Redirect tới URL thanh toán VNPAY
        if (isset($_POST['redirect'])) {
            header('Location: ' . $vnp_Url);
            die();
        } else {
            return response()->json($returnData);
        }
    }

    // Xử lý kết quả trả về từ VNPAY
    public function paymentReturn(Request $request)
    {
        $vnp_HashSecret = "55TYK0C9CIEB0Q8MU57B3XCUGEFT9J0C";
        $inputData = $request->data;
        $vnp_SecureHash = $inputData['vnp_SecureHash'];
        unset($inputData['vnp_SecureHash'], $inputData['vnp_SecureHashType']);
        $vnp_Returnurl = "http://localhost:3000/payments";
        $vnp_IpAddr = $_SERVER['REMOTE_ADDR'];
        $inputData = array(
            "vnp_Version" => "2.1.0",
            "vnp_TmnCode" => $inputData['vnp_TmnCode'],
            "vnp_Amount" => $inputData['vnp_Amount'], // Convert VND to cents
            "vnp_Command" => "pay",
            "vnp_CreateDate" => $inputData['vnp_PayDate'],
            "vnp_CurrCode" => "VND",
            "vnp_Locale" => "VN",
            "vnp_OrderInfo" => $inputData['vnp_OrderInfo'],
            "vnp_OrderType" => "ATM",
            // "vnp_ReturnUrl" => $vnp_Returnurl,
            "vnp_TxnRef" => $inputData['vnp_TxnRef'],
            "vnp_IpAddr" => $vnp_IpAddr,
            "vnp_ReturnUrl" => $vnp_Returnurl,

        );

        // Thêm thông tin ngân hàng nếu có
        if (isset($vnp_BankCode) && $vnp_BankCode != "") {
            $inputData['vnp_BankCode'] = $vnp_BankCode;
        }

        // Sắp xếp dữ liệu theo thứ tự A-Z
        ksort($inputData);
        $query = "";
        $i = 0;
        $hashdata = "";
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashdata .= urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
            $query .= urlencode($key) . "=" . urlencode($value) . '&';
        }
        $secureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);

        // ksort($inputData);
        // $hashData = "";

        // foreach ($inputData as $key => $value) {
        //     $hashData .= $key . '=' . $value . '&';
        // }

        // $hashData = rtrim($hashData, '&');

        // $secureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);

        if ($secureHash === $vnp_SecureHash) {
            // Xử lý kết quả giao dịch
            return response()->json(['success' => true, 'data' => $inputData]);
        }

        return response()->json(['success' => false, 'message' => 'Invalid signature'.$secureHash.'/////'.$vnp_SecureHash]);
    }
   



    // {
    //     $vnp_HashSecret = "55TYK0C9CIEB0Q8MU57B3XCUGEFT9J0C";
    //     // $vnp_HashSecret = config('services.vnpay.hash_secret');

    //     $inputData = $request->all();
    //     $vnp_SecureHash = $request->vnp_SecureHash;
    //     unset($request->vnp_SecureHash, $request->vnp_SecureHashType);
    //     ksort($inputData);
    //     $hashData = urldecode(http_build_query($inputData));
    //     $secureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);        
    //     // Kiểm tra chữ ký và mã phản hồi từ VNPAY
    //     if ($secureHash === $vnp_SecureHash) {
    //         if ($request->vnp_ResponseCode == '00') {
    //             return response()->json(['message' => 'Thanh toán thành công', 'data' => $inputData]);
    //         } else {
    //             return response()->json(['message' => 'Thanh toán không thành công', 'data' => $inputData]);
    //         }
    //     } else {
    //         return response()->json(['message' => 'Chữ ký không hợp lệ'.$secureHash."////".$vnp_SecureHash
    //     ]);
    //     }
    // }

    
}



    // public function vnPay(Request $request)
    // {
    //             $vnp_TmnCode = "AY8UDN7Q"; // Mã website tại VNPAY
    //     $vnp_HashSecret = "55TYK0C9CIEB0Q8MU57B3XCUGEFT9J0C"; // Chuỗi bí mật
    //     $vnp_Url ="https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    //     $vnp_Returnurl = config('vnpay.vnp_Returnurl');

    //     $vnp_TxnRef = time(); // Mã đơn hàng
    //     $vnp_OrderInfo = $request->input('orderDescription');
    //     $vnp_OrderType = 'billpayment';
    //     $vnp_Amount = $request->input('amount') * 100;
    //     $vnp_Locale = 'vn';
    //     $vnp_BankCode = $request->input('bankCode', '');

    //     $inputData = [
    //         "vnp_Version" => "2.1.0",
    //         "vnp_TmnCode" => $vnp_TmnCode,
    //         "vnp_Amount" => $vnp_Amount,
    //         "vnp_Command" => "pay",
    //         "vnp_CreateDate" => date('YmdHis'),
    //         "vnp_CurrCode" => "VND",
    //         "vnp_IpAddr" => $request->ip(),
    //         "vnp_Locale" => $vnp_Locale,
    //         "vnp_OrderInfo" => $vnp_OrderInfo,
    //         "vnp_OrderType" => $vnp_OrderType,
    //         "vnp_ReturnUrl" => $vnp_Returnurl,
    //         "vnp_TxnRef" => $vnp_TxnRef,
    //     ];

    //     if (!empty($vnp_BankCode)) {
    //         $inputData['vnp_BankCode'] = $vnp_BankCode;
    //     }

    //     ksort($inputData);
    //     $query = "";
    //     $hashdata = "";

    //     foreach ($inputData as $key => $value) {
    //         $hashdata .= $key . "=" . $value . '&';
    //         $query .= urlencode($key) . "=" . urlencode($value) . '&';
    //     }

    //     $query = rtrim($query, '&');
    //     $hashdata = rtrim($hashdata, '&');

    //     $vnp_Url .= "?" . $query;
    //     if ($vnp_HashSecret) {
    //         $vnpSecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);
    //         $vnp_Url .= '&vnp_SecureHash=' . $vnpSecureHash;
    //     }

    //     return response()->json(['paymentUrl' => $vnp_Url]);
    // }

    // public function callback(Request $request)
    // {
    //     $vnp_HashSecret = config('vnpay.vnp_HashSecret');
    //     $inputData = $request->all();
    //     $vnp_SecureHash = $inputData['vnp_SecureHash'];
    //     unset($inputData['vnp_SecureHash'], $inputData['vnp_SecureHashType']);

    //     ksort($inputData);
    //     $hashData = "";

    //     foreach ($inputData as $key => $value) {
    //         $hashData .= $key . '=' . $value . '&';
    //     }

    //     $hashData = rtrim($hashData, '&');

    //     $secureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);

    //     if ($secureHash === $vnp_SecureHash) {
    //         // Xử lý kết quả giao dịch
    //         return response()->json(['success' => true, 'data' => $inputData]);
    //     }

    //     return response()->json(['success' => false, 'message' => 'Invalid signature']);
    // }
// }
