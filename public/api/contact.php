<?php
/**
 * Contact form endpoint for pegpeg.net. Receives the POST from /<locale>/<contact>/ and redirects to the
 * localized "sent" or "not sent" page.
 *
 * Configuration comes from the server environment only; nothing secret lives in this repo:
 *   CONTACT_TO    address that receives the messages (required)
 *   CONTACT_FROM  sender address on the PegPeg domain (optional, defaults to CONTACT_TO)
 *
 * Spam protection without third-party scripts: a hidden "website" field that people leave
 * empty, and a minimum time between page load and submit. Bots get the "sent" page so they
 * learn nothing.
 */
declare(strict_types=1);

const RESULT_PAGES = [
    'es' => ['/es/enviado/', '/es/noenviado/'],
    'en' => ['/en/sent/', '/en/not-sent/'],
    'ca' => ['/ca/enviat/', '/ca/no-enviat/'],
];

function finish(string $locale, bool $ok): never
{
    header('Location: ' . RESULT_PAGES[$locale][$ok ? 0 : 1], true, 303);
    exit;
}

function field(string $name, int $max): string
{
    $value = $_POST[$name] ?? '';
    if (!is_string($value)) return '';
    $value = trim($value);
    return mb_strlen($value) <= $max ? $value : '';
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    exit;
}

$locale = field('locale', 2);
if (!isset(RESULT_PAGES[$locale])) $locale = 'en';

// Bots: filled the trap field, or submitted within 3 seconds of loading the page.
$started = (int) field('t', 12);
if (field('website', 500) !== '' || ($started > 0 && time() - $started < 3)) finish($locale, true);

$name = field('name', 200);
$email = field('email', 254);
$message = field('message', 5000);

$valid = $name !== '' && $message !== ''
    && filter_var($email, FILTER_VALIDATE_EMAIL) !== false
    && !preg_match('/[\r\n]/', $name . $email); // no header injection
$to = getenv('CONTACT_TO') ?: '';
$from = getenv('CONTACT_FROM') ?: $to;
if (!$valid || $to === '') finish($locale, false);

$subject = '=?UTF-8?B?' . base64_encode("Contacto web: $name") . '?=';
$body = "Nombre: $name\nEmail: $email\nIdioma: $locale\n\n$message\n";
$headers = implode("\r\n", [
    "From: PegPeg web <$from>",
    "Reply-To: $email",
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
]);

finish($locale, mail($to, $subject, $body, $headers));
