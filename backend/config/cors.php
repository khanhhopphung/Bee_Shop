<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    // 'paths' => ['api/*', 'sanctum/csrf-cookie'],

    // 'allowed_methods' => ['*'],

    // 'allowed_origins' => ['*'],

    // 'allowed_origins_patterns' => [],

    // 'allowed_headers' => ['*'],

    // 'exposed_headers' => [],

    // 'max_age' => 0,

    // 'supports_credentials' => false,



    // 'paths' => ['api/*', 'sanctum/csrf-cookie'],

    // 'allowed_methods' => ['*'], // Cho phép tất cả các phương thức hoặc chỉ định các phương thức cụ thể như ['POST', 'GET']

    // 'allowed_origins' => ['http://localhost:3000'], // Thêm client của bạn vào đây

    // 'allowed_origins_patterns' => [],

    // 'allowed_headers' => ['*'], // Hoặc bạn có thể chỉ định ['Content-Type', 'Authorization']

    // 'exposed_headers' => [],

    // 'max_age' => 0,

    // 'supports_credentials' => false, // Đặt thành true nếu bạn muốn gửi thông tin xác thực (cookie)

    //     'paths' => ['api/*', 'login', 'logout', 'sanctum/csrf-cookie'],
    // 'allowed_methods' => ['*'],
    // 'allowed_origins' => ['http://localhost:3000'],
    // 'allowed_origins_patterns' => [],
    // 'allowed_headers' => ['*'],
    // 'exposed_headers' => [],
    // 'max_age' => 0,
    // 'supports_credentials' => true,

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'], // Cho phép tất cả các phương thức (GET, POST, ...)

    'allowed_origins' => [
        'http://localhost:3000/',  // Frontend URL
          // In case you use localhost as well
    ],


    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'], // Cho phép tất cả các header

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true, // Bật để cho phép gửi cookies, tokens


];
