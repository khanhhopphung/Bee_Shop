<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class VnPayController extends Controller
{
    public function createPayment(Request $request)
{
    $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    $vnp_Returnurl = "http://localhost:3000/ordersuccess";
    // $vnp_Returnurl = "http://localhost:3000/payments";
    $vnp_TmnCode = "AY8UDN7Q";//Mã website tại VNPAY 
    $vnp_HashSecret = "55TYK0C9CIEB0Q8MU57B3XCUGEFT9J0C"; //Chuỗi bí mật
    
    $vnp_TxnRef = uniqid(); //Mã đơn hàng. Trong thực tế Merchant cần insert đơn hàng vào DB và gửi mã này 
    $vnp_OrderInfo = 'thanh toán';
    $vnp_OrderType = "shop";
    $vnp_Amount = $request->amount * 100;
    $vnp_Locale = 'VN';
    $vnp_BankCode = 'NCB';
$vnp_IpAddr = $_SERVER['REMOTE_ADDR'];
    
    $inputData = array(
        "vnp_Version" => "2.1.0",
        "vnp_TmnCode" => $vnp_TmnCode,
        "vnp_Amount" => $vnp_Amount,
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
    
    if (isset($vnp_BankCode) && $vnp_BankCode != "") {
        $inputData['vnp_BankCode'] = $vnp_BankCode;
    }
    if (isset($vnp_Bill_State) && $vnp_Bill_State != "") {
        $inputData['vnp_Bill_State'] = $vnp_Bill_State;
    }
    
    //var_dump($inputData);
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
    
    $vnp_Url = $vnp_Url . "?" . $query;
    if (isset($vnp_HashSecret)) {
        $vnpSecureHash =   hash_hmac('sha512', $hashdata, $vnp_HashSecret);//  
        $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;
    }
    $returnData = array('code' => '00'
        , 'message' => 'success'
        , 'data' => $vnp_Url);
        // if (isset($_POST['redirect'])) {
        //     header('Location: ' . $vnp_Url);
        //     die();
        // } else {
            echo json_encode($returnData);
    
    
}
}
// http://localhost:8000/api/vnpay/return?vnp_Amount=10000000&vnp_BankCode=NCB&vnp_BankTranNo=VNP14738962&vnp_CardType=ATM&vnp_OrderInfo=thanh+to%C3%A1n&vnp_PayDate=20241212143934&vnp_ResponseCode=00&vnp_TmnCode=AY8UDN7Q&vnp_TransactionNo=14738962&vnp_TransactionStatus=00&vnp_TxnRef=675a932b674ab&vnp_SecureHash=418a83118a3245f18960ff8f0b2dba94c6085768875818e9fe2a450a53e2b45e882f66f5d3c3ab16fd6cfdd3779797d9c4b7f32fb14c2c39250a0230641ca331