<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class FaqController extends Controller
{
    public function index()
    {
        $faqData = [
            [
                'question' => 'Bagaimana cara memesan tenda di PMAQ Tenda?',
                'answer' => 'Anda dapat memesan tenda dengan mudah melalui formulir penyewaan di website kami. Pilih tenda yang Anda inginkan, isi detail acara, dan lanjutkan ke halaman konfirmasi.'
            ],
            [
                'question' => 'Kapan saya harus melakukan pembayaran?',
                'answer' => 'Pembayaran dilakukan secara penuh setelah proses pembongkaran tenda selesai di lokasi Anda. Kami tidak memerlukan uang muka (DP) untuk pemesanan.'
            ],
            [
                'question' => 'Apakah ada biaya untuk pembatalan pesanan?',
                'answer' => 'Tidak ada biaya pembatalan jika dilakukan sebelum tim kami berangkat ke lokasi pemasangan. Namun, jika pembatalan dilakukan saat tim kami sudah tiba di lokasi, akan dikenakan biaya transportasi sebesar 20% dari total biaya sewa.'
            ],
            [
                'question' => 'Apa yang terjadi jika tenda rusak saat masa penyewaan?',
                'answer' => 'Kerusakan pada tenda yang disebabkan oleh kelalaian penyewa akan dikenakan biaya perbaikan sesuai tingkat kerusakan. Namun, kerusakan yang disebabkan oleh bencana alam (seperti badai atau gempa) tidak akan dikenakan biaya tambahan.'
            ],
            [
                'question' => 'Area mana saja yang dijangkau oleh layanan PMAQ Tenda?',
                'answer' => 'Saat ini kami melayani seluruh area Prambanan dan sekitarnya. Untuk penyewaan di luar area tersebut, silakan hubungi kami terlebih dahulu untuk konfirmasi ketersediaan dan kemungkinan biaya tambahan.'
            ],
            [
                'question' => 'Apakah harga sewa sudah termasuk biaya pasang dan bongkar?',
                'answer' => 'Ya, semua harga yang tertera di website kami sudah termasuk biaya pemasangan dan pembongkaran oleh tim profesional kami. Anda tidak perlu khawatir tentang teknis pemasangan.'
            ],
        ];

        return Inertia::render('Faq/Index', [
            'faqs' => $faqData,
        ]);
    }
}