<?php
$timestamp = $_GET['timestamp'];
$dateString = date('Y-m-d', $timestamp);
$filePath = __DIR__ . '/DataDublin/Mobiles_01-10-2021_31-07-2022/' . $dateString . '.csv';

if (file_exists($filePath)) {
    $fileContents = file_get_contents($filePath);
    $fileContents = str_replace("\n", "<br>", $fileContents);
    header('Content-Type: text/html');
    echo $fileContents;
  } else {
    echo "None";
  }
?>
