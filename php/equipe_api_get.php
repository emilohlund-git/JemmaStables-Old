<?php
    function CallAPI($url)
    {
        $curl = curl_init();
    
        // Optional Authentication:
        curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
        curl_setopt($curl, CURLOPT_USERPWD, "username:password");
    
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    
        $result = curl_exec($curl);
    
        curl_close($curl);
    
        return $result;
    }

    $data = CallAPI("https://tdb.ridsport.se/rider_results/2717?time_span_end=2020-12-31&time_span_start=2020-01-01");
?>