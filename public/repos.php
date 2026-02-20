<?php

header('Content-Type: application/json');

$cache_file = 'repos_cache.json';
$cache_time = 86400; // 24 Stunden
$github_url = 'https://api.github.com/users/frederikanspach/repos?sort=updated';

if (file_exists($cache_file) && (time() - filemtime($cache_file) < $cache_time)) {
    echo file_get_contents($cache_file);
    exit;
}

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $github_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_USERAGENT, 'Portfolio-Proxy-PHP');

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if ($http_code === 200 && is_string($response)) {
    $all_repos = json_decode($response, true);
    $excluded = ['frederikanspach'];

    $filtered = array_filter($all_repos, function (array $repo) use ($excluded) {
        return !($repo['fork'] ?? true)
            && !in_array($repo['name'] ?? '', $excluded, true)
            && !empty($repo['description'] ?? '');
    });

    $final_json = json_encode(array_values($filtered));
    file_put_contents($cache_file, $final_json);
    echo $final_json;
} elseif (file_exists($cache_file)) {
    echo file_get_contents($cache_file);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'API offline']);
}
